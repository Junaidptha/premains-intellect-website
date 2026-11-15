/**
 * PREMAINS INTELLECT LLP - Login / Register page
 * Uses js/auth.js (PremainsAuth). Handles validation, e-mail confirmation return,
 * friendly errors, "resend confirmation" and logout.
 */
document.addEventListener('DOMContentLoaded', async () => {
  const Auth = window.PremainsAuth;
  const $ = (id) => document.getElementById(id);

  const forms = $('auth-forms');
  const signedIn = $('auth-signed-in');
  const okBox = $('auth-success');
  const errBox = $('auth-error');
  const resendWrap = $('auth-resend');
  const loginForm = $('login-form');
  const registerForm = $('register-form');
  const params = new URLSearchParams(window.location.search);
  const next = Auth ? Auth.safeNext(params.get('next')) : 'enquiry.html#consultation-form';

  if (!Auth || !Auth.configured) {
    forms.hidden = true;
    $('auth-config-error').style.display = 'block';
    return;
  }

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_RE = /^[0-9+()\s\-]{7,20}$/;
  let lastEmail = '';

  function say(kind, message) {
    okBox.style.display = 'none';
    errBox.style.display = 'none';
    resendWrap.hidden = true;
    if (!message) return;
    const box = kind === 'ok' ? okBox : errBox;
    box.textContent = message;
    box.style.display = 'block';
    box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function setInvalid(input, bad) {
    input.classList.toggle('is-invalid', bad);
    return !bad;
  }

  function busy(form, isBusy, label) {
    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;
    if (isBusy) {
      btn.dataset.html = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span>' + label + '</span>';
    } else {
      btn.disabled = false;
      if (btn.dataset.html) btn.innerHTML = btn.dataset.html;
    }
  }

  function selectTab(which) {
    const isLogin = which === 'login';
    $('tab-login').classList.toggle('is-active', isLogin);
    $('tab-register').classList.toggle('is-active', !isLogin);
    $('tab-login').setAttribute('aria-selected', String(isLogin));
    $('tab-register').setAttribute('aria-selected', String(!isLogin));
    loginForm.hidden = !isLogin;
    registerForm.hidden = isLogin;
    say();
  }
  $('tab-login').addEventListener('click', () => selectTab('login'));
  $('tab-register').addEventListener('click', () => selectTab('register'));
  document.querySelectorAll('[data-switch]').forEach((b) =>
    b.addEventListener('click', () => selectTab(b.dataset.switch)));

  // Clear a field's red state while typing
  document.querySelectorAll('#login-form input, #register-form input').forEach((input) => {
    input.addEventListener('input', () => input.classList.remove('is-invalid'));
  });

  function showSignedIn(session) {
    forms.hidden = true;
    signedIn.hidden = false;
    $('auth-signed-in-email').textContent = session.user.email || '';
    $('auth-continue').setAttribute('href', next);
  }

  // ---- e-mail confirmation link results arrive in the URL hash ----
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const hashError = hash.get('error_code') || hash.get('error');
  if (hashError) {
    const expired = hashError === 'otp_expired' || /expired/i.test(hash.get('error_description') || '');
    say('err', expired
      ? 'That confirmation link has expired or was already used. Log in, or request a new link below.'
      : 'We could not confirm your email. Please try logging in, or request a new confirmation link.');
    resendWrap.hidden = false;
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  // ---- already signed in? (also covers a fresh confirmation link) ----
  try {
    const session = await Auth.getSession();
    if (session) {
      if (params.get('confirmed') === '1' || /type=signup/.test(window.location.hash)) {
        showSignedIn(session);
        say('ok', 'Your email is confirmed. Taking you to the consultation form…');
        setTimeout(() => { window.location.href = next; }, 1400);
      } else {
        showSignedIn(session);
      }
    } else if (params.get('confirmed') === '1' && !hashError) {
      say('ok', 'Your email is confirmed. Please log in to continue.');
    }
  } catch (err) {
    console.warn('Session check failed', err);
  }
  if (params.get('tab') === 'register') selectTab('register');

  // ---------------------------------------------------------------- LOGIN ---
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    say();
    const email = $('login-email');
    const password = $('login-password');
    const valid = [setInvalid(email, !EMAIL_RE.test(email.value.trim())), setInvalid(password, !password.value)]
      .every(Boolean);
    if (!valid) return;

    lastEmail = email.value.trim();
    busy(loginForm, true, 'Signing in…');
    try {
      await Auth.signIn(lastEmail, password.value);
      window.location.href = next;
    } catch (err) {
      say('err', Auth.friendlyError(err));
      if (String(err.code || '').toLowerCase() === 'email_not_confirmed' || /not confirmed/i.test(err.message || '')) {
        resendWrap.hidden = false;
      }
      busy(loginForm, false);
    }
  });

  // ------------------------------------------------------------- REGISTER ---
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    say();
    const name = $('reg-name');
    const email = $('reg-email');
    const phone = $('reg-phone');
    const pw = $('reg-password');
    const pw2 = $('reg-password2');
    const consent = $('reg-consent');

    const checks = [
      setInvalid(name, name.value.trim().length < 2),
      setInvalid(email, !EMAIL_RE.test(email.value.trim())),
      setInvalid(phone, !PHONE_RE.test(phone.value.trim())),
      setInvalid(pw, pw.value.length < 8),
      setInvalid(pw2, pw2.value !== pw.value || !pw2.value)
    ];
    const consentOk = consent.checked;
    $('reg-consent-error').style.display = consentOk ? 'none' : 'block';
    if (!checks.every(Boolean) || !consentOk) return;

    lastEmail = email.value.trim();
    busy(registerForm, true, 'Creating account…');
    try {
      const result = await Auth.signUp({
        fullName: name.value.trim(),
        phone: phone.value.trim(),
        email: lastEmail,
        password: pw.value
      });
      if (result.needsConfirmation) {
        registerForm.reset();
        selectTab('login');
        $('login-email').value = lastEmail;
        say('ok', 'Account created! We have sent a confirmation link to ' + lastEmail +
          '. Please click it (check your spam folder too), then log in here.');
        resendWrap.hidden = false;
      } else {
        window.location.href = next;
      }
    } catch (err) {
      say('err', Auth.friendlyError(err));
    }
    busy(registerForm, false);
  });

  // ------------------------------------------- resend confirmation / logout ---
  $('auth-resend-btn').addEventListener('click', async () => {
    const email = lastEmail || $('login-email').value.trim() || $('reg-email').value.trim();
    if (!EMAIL_RE.test(email)) {
      say('err', 'Enter your email address in the form, then request a new confirmation link.');
      return;
    }
    try {
      await Auth.resendConfirmation(email);
      say('ok', 'A new confirmation link is on its way to ' + email + '.');
    } catch (err) {
      say('err', Auth.friendlyError(err));
    }
  });

  $('auth-logout').addEventListener('click', async () => {
    try {
      await Auth.signOut();
      signedIn.hidden = true;
      forms.hidden = false;
      selectTab('login');
      say('ok', 'You have been logged out.');
    } catch (err) {
      say('err', Auth.friendlyError(err));
    }
  });
});
