/**
 * PREMAINS INTELLECT LLP - Free Trial / Consultation (enquiry.html)
 *
 * Not logged in         -> the Free Trial form is visible, with a login notice;
 *                          submitting sends the visitor to log in (answers are kept)
 * Logged in, trial open -> Free Trial form        (one per account, for life)
 * Logged in, trial used -> normal Consultation form (as many as needed)
 *
 * IMPORTANT: this file only decides what to SHOW. The real rules (one free trial,
 * validation, who may write what) are enforced in the database by
 * supabase/migrations/*_consultation_system.sql, so nothing here can be bypassed.
 */
document.addEventListener('DOMContentLoaded', async () => {
  const root = document.getElementById('consultation-form');
  const Auth = window.PremainsAuth;
  if (!root) return;

  const $ = (id) => document.getElementById(id);
  const PANELS = ['cm-loading', 'cm-gate', 'cm-free', 'cm-normal', 'cm-success'];
  const PHONE_RE = /^[0-9+()\s\-]{7,20}$/;

  function show(panelId, alsoId) {
    PANELS.forEach((id) => { $(id).hidden = id !== panelId && id !== alsoId; });
  }

  // Answers typed before logging in are kept for this browser tab only, then restored.
  const DRAFT_KEY = 'premains_consultation_draft';
  const SUFFIXES = ['name', 'phone', 'company', 'service', 'btype', 'req', 'extra', 'date'];
  function saveDraft(form, prefix) {
    try {
      const draft = {};
      SUFFIXES.forEach((sfx) => {
        const el = form.querySelector('#' + prefix + '-' + sfx);
        if (el && el.value) draft[sfx] = el.value;
      });
      window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch (e) { /* storage blocked: the visitor just retypes */ }
  }
  function restoreDraft() {
    try {
      const draft = JSON.parse(window.sessionStorage.getItem(DRAFT_KEY) || 'null');
      if (!draft) return;
      ['ft', 'cn'].forEach((prefix) => SUFFIXES.forEach((sfx) => {
        const el = $(prefix + '-' + sfx);
        if (el && !el.value && draft[sfx]) el.value = draft[sfx];
      }));
      window.sessionStorage.removeItem(DRAFT_KEY);
    } catch (e) { /* ignore */ }
  }
  function goToLogin() {
    window.location.href = 'login.html?next=' + encodeURIComponent('enquiry.html#consultation-form');
  }

  // ---- service blocks: "Enquire about this" pre-selects the service (still changeable) ----
  function chooseService(value) {
    ['ft-service', 'cn-service'].forEach((id) => {
      const sel = $(id);
      if (!sel) return;
      const has = Array.from(sel.options).some((o) => o.value === value);
      if (has) {
        sel.value = value;
        sel.classList.remove('is-invalid');
      }
    });
    document.querySelectorAll('.service-block').forEach((b) => {
      const btn = b.querySelector('[data-service]');
      b.classList.toggle('is-selected', Boolean(btn) && btn.dataset.service === value);
    });
  }
  document.querySelectorAll('[data-service]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      chooseService(btn.dataset.service);
      root.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  const wanted = new URLSearchParams(window.location.search).get('service');
  if (wanted) chooseService(wanted);

  // Login system switched off (its scripts are commented out in enquiry.html): "open mode".
  const OPEN_MODE = !Auth;

  if (Auth && !Auth.configured) {
    PANELS.forEach((id) => { $(id).hidden = true; });
    $('cm-config-error').style.display = 'block';
    return;
  }
  const client = Auth ? Auth.client : null;

  // Local "today" as yyyy-mm-dd (for the date picker's minimum)
  const today = (() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  })();
  const dateInput = $('cn-date');
  if (dateInput) dateInput.min = today;

  // ============================================================================
  // OPEN MODE (no login): the form e-mails the request to the office through
  // Web3Forms (key in js/data/config.js). To bring the login system back,
  // un-comment the three <script> tags in enquiry.html.
  // ============================================================================
  if (OPEN_MODE) {
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const form = $('free-trial-form');
    const email = $('ft-email');
    $('cm-userbar').hidden = true;
    email.readOnly = false;
    email.required = true;
    email.placeholder = 'you@company.com';
    const note = $('ft-email-note');
    if (note) note.textContent = 'We will reply to this address.';
    show('cm-free');

    form.querySelectorAll('.form-control').forEach((el) => {
      el.addEventListener('input', () => el.classList.remove('is-invalid'));
      el.addEventListener('change', () => el.classList.remove('is-invalid'));
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (form.dataset.busy === '1') return;
      showFormError(form, '');
      const { valid, fields } = collect(form, 'ft');
      const emailOk = check(email, !EMAIL_RE.test(email.value.trim()));
      if (!valid || !emailOk) {
        showFormError(form, 'Please review the highlighted fields and try again.');
        return;
      }

      const cfg = (window.SITE_CONFIG && window.SITE_CONFIG.forms) || {};
      const phone = (window.SITE_CONFIG && window.SITE_CONFIG.contact && window.SITE_CONFIG.contact.phoneDisplay) || '+91 98181 22696';
      if (!cfg.accessKey || cfg.accessKey === 'demo-mode') {
        console.warn('Set forms.accessKey (Web3Forms) in js/data/config.js; request was NOT sent.');
        showFormError(form, 'Sorry, online submission is not available right now. Please call or WhatsApp us at ' + phone + '.');
        return;
      }

      const ref = 'REQ-' + Date.now().toString(36).toUpperCase();
      setBusy(form, true);
      try {
        const res = await fetch(cfg.actionUrl || 'https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: cfg.accessKey,
            subject: 'New Consultation request: ' + fields.company.value.trim() + ' (' + ref + ')',
            from_name: 'PREMAINS INTELLECT website',
            replyto: email.value.trim(),
            botcheck: '',
            reference: ref,
            request_type: 'CONSULTATION',
            full_name: fields.name.value.trim(),
            email: email.value.trim(),
            phone: fields.phone.value.trim(),
            company_name: fields.company.value.trim(),
            service_required: fields.service.value,
            business_type: fields.btype.value,
            requirements: fields.req.value.trim(),
            additional_information: fields.extra.value.trim()
          })
        });
        const result = await res.json().catch(() => ({}));
        if (!res.ok || result.success === false) throw new Error(result.message || 'Submission failed');

        form.reset();
        showSuccess('CONSULTATION', ref);
        $('cm-success-title').textContent = 'Your request is received';
        $('cm-success-text').textContent = 'Thank you! Our senior partner will contact you within 2 to 4 business hours.';
        $('cm-success-next').textContent = 'Submit Another Request';
      } catch (err) {
        console.error('Submit failed', err);
        showFormError(form, 'Sorry, we could not submit your request. Please try again, or call or WhatsApp us at ' + phone + '.');
      }
      setBusy(form, false);
    });

    $('cm-success-next').addEventListener('click', () => { show('cm-free'); });
    return;
  }

  let session = null;
  let profile = null;

  // ------------------------------------------------------------ state loading
  async function loadProfile(userId) {
    const { data, error } = await client
      .from('profiles')
      .select('full_name,email,phone,free_trial_used')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw error;
    // No row yet (very old account): treat as eligible; the database re-checks on submit.
    return data || { full_name: null, email: null, phone: null, free_trial_used: false };
  }

  function prefill(prefix) {
    const meta = (session.user && session.user.user_metadata) || {};
    const set = (suffix, value) => {
      const el = $(prefix + '-' + suffix);
      if (el && !el.value && value) el.value = value;
    };
    set('name', profile.full_name || meta.full_name);
    set('phone', profile.phone || meta.phone);
    $(prefix + '-email').value = session.user.email || profile.email || '';
  }

  async function refresh() {
    show('cm-loading');
    try {
      session = await Auth.getSession();
      if (!session) {
        $('cm-userbar').hidden = true;
        ['ft', 'cn'].forEach((p) => { $(p + '-email').placeholder = 'Filled from your account after login'; });
        show('cm-free'); // form only; login is required when the visitor submits
        return;
      }
      $('cm-user-email').textContent = session.user.email || '';
      $('cm-userbar').hidden = false;

      profile = await loadProfile(session.user.id);
      prefill('ft');
      prefill('cn');
      restoreDraft();
      show(profile.free_trial_used ? 'cm-normal' : 'cm-free');
      if (window.location.hash === '#consultation-form') root.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      console.error('Could not load account state', err);
      show('cm-gate');
      const gateText = $('cm-gate').querySelector('p');
      if (gateText) {
        gateText.textContent = 'We could not load your account details. Please refresh the page, or log in again.';
      }
    }
  }

  // --------------------------------------------------------------- validation
  function check(el, bad) {
    el.classList.toggle('is-invalid', bad);
    return !bad;
  }

  function collect(form, prefix) {
    const f = (suffix) => form.querySelector('#' + prefix + '-' + suffix);
    const fields = {
      name: f('name'), phone: f('phone'), company: f('company'),
      service: f('service'), btype: f('btype'), req: f('req'), extra: f('extra'), date: f('date')
    };
    const valid = [
      check(fields.name, fields.name.value.trim().length < 2),
      check(fields.phone, !PHONE_RE.test(fields.phone.value.trim())),
      check(fields.company, fields.company.value.trim().length < 2),
      check(fields.service, !fields.service.value),
      check(fields.btype, !fields.btype.value),
      check(fields.req, fields.req.value.trim().length < 10),
      fields.date ? check(fields.date, Boolean(fields.date.value) && fields.date.value < today) : true
    ].every(Boolean);
    return { valid, fields };
  }

  function showFormError(form, message) {
    const box = form.querySelector('[data-cm-error]');
    box.textContent = message || '';
    box.style.display = message ? 'block' : 'none';
    if (message) box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function setBusy(form, busy) {
    form.dataset.busy = busy ? '1' : '';
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = busy;
    if (busy) {
      btn.dataset.html = btn.innerHTML;
      btn.innerHTML = '<span>Submitting…</span>';
    } else if (btn.dataset.html) {
      btn.innerHTML = btn.dataset.html;
    }
  }

  // ------------------------------------------------------------------- submit
  async function submit(form, prefix) {
    if (form.dataset.busy === '1') return; // ignore double clicks
    showFormError(form, '');
    const { valid, fields } = collect(form, prefix);
    if (!valid) {
      showFormError(form, 'Please review the highlighted fields and try again.');
      return;
    }

    // Must be logged in before anything is submitted.
    let live = null;
    try { live = await Auth.getSession(); } catch (e) { /* treated as logged out */ }
    if (!live) {
      saveDraft(form, prefix);
      goToLogin();
      return;
    }

    const type = form.dataset.cmForm; // 'FREE_TRIAL' | 'CONSULTATION'
    setBusy(form, true);
    try {
      const { data, error } = await client.rpc('submit_consultation_request', {
        p_request_type: type,
        p_full_name: fields.name.value.trim(),
        p_phone: fields.phone.value.trim(),
        p_company_name: fields.company.value.trim(),
        p_service_required: fields.service.value,
        p_business_type: fields.btype.value,
        p_requirements: fields.req.value.trim(),
        p_additional_information: fields.extra.value.trim() || null,
        p_preferred_date: fields.date && fields.date.value ? fields.date.value : null
      });
      if (error) throw error;

      // The request is SAVED at this point. The e-mail is a separate, retryable step:
      // if it fails the request is not lost (it is re-sent by the retry job).
      client.functions.invoke('notify-consultation', { body: { request_id: data.id } })
        .then((res) => { if (res && res.error) console.warn('Notification e-mail pending:', res.error.message); })
        .catch((err) => console.warn('Notification e-mail pending:', err));

      form.reset();
      showSuccess(type, data.id);
    } catch (err) {
      await handleSubmitError(form, fields, err);
    }
    setBusy(form, false);
  }

  async function handleSubmitError(form, fields, err) {
    const text = String((err && err.message) || '');
    if (text.includes('FREE_TRIAL_ALREADY_USED')) {
      // Another tab/device already used it. Show the normal consultation form.
      await refresh();
      return;
    }
    if (text.includes('NOT_AUTHENTICATED') || (err && (err.status === 401 || /jwt/i.test(text)))) {
      saveDraft(form, form.dataset.cmForm === 'FREE_TRIAL' ? 'ft' : 'cn');
      goToLogin(); // session expired -> log in again, answers kept
      return;
    }
    if (text.includes('INVALID_PHONE')) { check(fields.phone, true); showFormError(form, 'Please enter a valid phone number.'); return; }
    if (text.includes('INVALID_DATE') && fields.date) { check(fields.date, true); showFormError(form, 'Please choose today or a future date.'); return; }
    if (text.includes('INVALID_INPUT')) { showFormError(form, 'Please check the lengths of your entries and try again.'); return; }

    console.error('Submit failed', err);
    const offline = err && (err.name === 'TypeError' || /failed to fetch|network/i.test(text));
    const phone = (window.SITE_CONFIG && window.SITE_CONFIG.contact && window.SITE_CONFIG.contact.phoneDisplay) || '+91 98181 22696';
    showFormError(form, offline
      ? 'We could not reach the server. Please check your connection and try again.'
      : 'Sorry, we could not submit your request. Please try again, or call or WhatsApp us at ' + phone + '.');
  }

  function showSuccess(type, requestId) {
    const trial = type === 'FREE_TRIAL';
    $('cm-success-title').textContent = trial ? 'Your free trial request is received' : 'Your consultation request is received';
    $('cm-success-text').textContent = trial
      ? 'Thank you! Our senior partner will contact you within 2 to 4 business hours to start your free trial. This was your one free trial; you can still book consultations at any time.'
      : 'Thank you! Our senior partner will contact you within 2 to 4 business hours.';
    $('cm-success-id').textContent = requestId;
    $('cm-success-next').textContent = trial ? 'Book a Consultation' : 'Submit Another Request';
    show('cm-success');
    root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // -------------------------------------------------------------------- wiring
  [['free-trial-form', 'ft'], ['consultation-request-form', 'cn']].forEach(([id, prefix]) => {
    const form = $(id);
    form.addEventListener('submit', (e) => { e.preventDefault(); submit(form, prefix); });
    form.querySelectorAll('.form-control').forEach((el) => {
      el.addEventListener('input', () => el.classList.remove('is-invalid'));
      el.addEventListener('change', () => el.classList.remove('is-invalid'));
    });
  });

  $('cm-success-next').addEventListener('click', refresh);

  $('cm-logout').addEventListener('click', async () => {
    try {
      await Auth.signOut();
    } catch (err) {
      console.warn('Logout failed', err);
    }
    await refresh();
  });

  // Log out in another tab, or a session that expires, returns the visitor to the gate.
  client.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') setTimeout(refresh, 0);
  });

  await refresh();
});
