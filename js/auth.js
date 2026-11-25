/**
 * PREMAINS INTELLECT LLP - Supabase Authentication
 * One shared client for login, registration, logout and session handling.
 * Used by login.html and enquiry.html (load js/vendor/supabase.js first).
 *
 * Only the PUBLISHABLE key is used here. Never put a secret / service_role key
 * in front-end code; row level security in the database protects the data.
 */
(function () {
  const cfg = (window.SITE_CONFIG && window.SITE_CONFIG.supabase) || {};
  const sdk = window.supabase;
  const configured = Boolean(cfg.url && cfg.publishableKey && sdk && typeof sdk.createClient === 'function');

  const client = configured
    ? sdk.createClient(cfg.url, cfg.publishableKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    })
    : null;

  // Where to go after login: only same-site pages on this domain are allowed
  // (blocks "?next=https://evil.com" open-redirect tricks).
  const DEFAULT_NEXT = 'enquiry.html#consultation-form';
  function safeNext(raw) {
    const value = String(raw || '').trim();
    return /^[A-Za-z0-9_\-]+\.html(#[A-Za-z0-9_\-]+)?$/.test(value) ? value : DEFAULT_NEXT;
  }

  // Supabase errors -> plain language the visitor can act on
  function friendlyError(err) {
    if (!err) return 'Something went wrong. Please try again.';
    const code = String(err.code || '').toLowerCase();
    const msg = String(err.message || '').toLowerCase();
    const status = err.status;

    if (code === 'invalid_credentials' || msg.includes('invalid login credentials')) {
      return 'Incorrect email or password. Please check and try again.';
    }
    if (code === 'email_not_confirmed' || msg.includes('email not confirmed')) {
      return 'Please confirm your email address first. We sent you a confirmation link (check your spam folder too).';
    }
    if (code === 'user_already_exists' || msg.includes('already registered')) {
      return 'An account with this email already exists. Please log in instead.';
    }
    if (code === 'same_password' || msg.includes('different from the old password')) {
      return 'Your new password must be different from your old one.';
    }
    if (code === 'weak_password' || msg.includes('password should be')) {
      return 'Please choose a stronger password (at least 8 characters, with letters and numbers).';
    }
    if (code === 'session_not_found' || code === 'bad_jwt' || msg.includes('auth session missing')) {
      return 'Your reset link has expired. Please request a new one.';
    }
    if (code === 'over_email_send_rate_limit' || code === 'over_request_rate_limit' || status === 429
      || msg.includes('rate limit') || msg.includes('too many')) {
      return 'Too many attempts. Please wait a minute and try again.';
    }
    if (code === 'email_address_invalid' || msg.includes('invalid email')) {
      return 'Please enter a valid email address.';
    }
    if (err.name === 'AuthRetryableFetchError' || msg.includes('failed to fetch') || msg.includes('network')) {
      return 'We could not reach the server. Please check your internet connection and try again.';
    }
    return 'Something went wrong. Please try again, or call us at ' +
      ((window.SITE_CONFIG && window.SITE_CONFIG.contact && window.SITE_CONFIG.contact.phoneDisplay) || 'our office') + '.';
  }

  async function getSession() {
    if (!client) return null;
    const { data } = await client.auth.getSession();
    return data && data.session ? data.session : null;
  }

  async function signUp({ fullName, phone, email, password }) {
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone },
        // Back to the login page after the e-mail link is clicked.
        emailRedirectTo: window.location.origin + '/login.html?confirmed=1'
      }
    });
    if (error) throw error;
    // Supabase hides "already registered" by returning a user with no identities.
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      const dup = new Error('User already registered');
      dup.code = 'user_already_exists';
      throw dup;
    }
    // session is present only when e-mail confirmation is switched off
    return { user: data.user, session: data.session, needsConfirmation: !data.session };
  }

  async function signIn(email, password) {
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    if (!client) return;
    const { error } = await client.auth.signOut();
    if (error) throw error;
  }

  async function resendConfirmation(email) {
    const { error } = await client.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: window.location.origin + '/login.html?confirmed=1' }
    });
    if (error) throw error;
  }

  // Always answers the same way, so nobody can use this to find out who has an account.
  async function sendPasswordReset(email) {
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/login.html'
    });
    if (error) throw error;
  }

  async function updatePassword(password) {
    const { error } = await client.auth.updateUser({ password });
    if (error) throw error;
  }

  // At least 8 characters with a letter and a number.
  function passwordProblem(pw) {
    if (!pw || pw.length < 8) return 'Use at least 8 characters.';
    if (!/[A-Za-z]/.test(pw) || !/[0-9]/.test(pw)) return 'Use both letters and numbers.';
    return '';
  }

  window.PremainsAuth = {
    configured, client, cfg, safeNext, friendlyError,
    getSession, signUp, signIn, signOut, resendConfirmation,
    sendPasswordReset, updatePassword, passwordProblem
  };
})();
