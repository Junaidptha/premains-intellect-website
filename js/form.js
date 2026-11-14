/**
 * PREMAINS INTELLECT LLP - Forms Validation & Submission
 * Supports both Enquiry/Free Trial Form and Contact Form
 * Handles live slider feedback, blur validations, honeypot spam prevention, and fetch POST
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Transaction Volume Range Slider dynamic feedback
  const volumeSlider = document.getElementById('transaction-volume');
  const volumeDisplay = document.getElementById('transaction-volume-val');

  if (volumeSlider && volumeDisplay) {
    const updateDisplay = () => {
      const val = parseInt(volumeSlider.value, 10);
      if (val >= 1000) {
        volumeDisplay.textContent = '1,000+ txns / month (Enterprise Scale)';
      } else if (val >= 500) {
        volumeDisplay.textContent = `${val} txns / month (High Growth)`;
      } else if (val >= 150) {
        volumeDisplay.textContent = `${val} txns / month (Mid-tier Business)`;
      } else {
        volumeDisplay.textContent = `${val} txns / month (Early-stage / Starter)`;
      }
    };
    volumeSlider.addEventListener('input', updateDisplay);
    updateDisplay();
  }

  // 2. Form Validation & Submission
  const forms = document.querySelectorAll('form[data-validate="true"]');

  forms.forEach(form => {
    // Use the inline validation messages below instead of the browser's native popups
    form.noValidate = true;
    const submitBtn = form.querySelector('button[type="submit"]');
    const alertSuccess = form.querySelector('.alert-box--success');
    const alertError = form.querySelector('.alert-box--error');
    const honeypot = form.querySelector('input[name="_honey"]');

    // Validation helper
    function validateField(input) {
      const errorEl = input.nextElementSibling;
      let isValid = true;
      let errorMsg = '';

      // Check required
      if (input.hasAttribute('required') && !input.value.trim()) {
        isValid = false;
        errorMsg = 'This field is required.';
      } else if (input.type === 'email' && input.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value.trim())) {
          isValid = false;
          errorMsg = 'Please enter a valid business email address.';
        }
      } else if (input.type === 'tel' && input.value.trim()) {
        const phoneRegex = /^[0-9+\s\-()]{7,20}$/;
        if (!phoneRegex.test(input.value.trim())) {
          isValid = false;
          errorMsg = 'Please enter a valid phone or WhatsApp number.';
        }
      }

      if (!isValid) {
        input.classList.add('is-invalid');
        if (errorEl && errorEl.classList.contains('form-error')) {
          errorEl.textContent = errorMsg;
        }
      } else {
        input.classList.remove('is-invalid');
      }

      return isValid;
    }

    // Attach blur event to all inputs & textareas
    const inputs = form.querySelectorAll('input:not([type="hidden"]):not([type="checkbox"]), select, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) {
          validateField(input);
        }
      });
    });

    // Form Submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Check honeypot spam bot trap
      if (honeypot && honeypot.value.trim() !== '') {
        console.warn('Spam detected via honeypot.');
        return;
      }

      let allValid = true;
      inputs.forEach(input => {
        if (!validateField(input)) {
          allValid = false;
        }
      });

      // Validate consent checkbox if present
      const consentBox = form.querySelector('input[name="consent"]');
      if (consentBox && !consentBox.checked) {
        allValid = false;
        if (alertError) {
          alertError.textContent = 'Please consent to our privacy and confidentiality terms before submitting.';
          alertError.style.display = 'block';
        }
        return;
      }

      if (!allValid) {
        if (alertError) {
          alertError.textContent = 'Please review the highlighted fields above and correct the errors.';
          alertError.style.display = 'block';
        }
        return;
      }

      // Hide previous alerts
      if (alertSuccess) alertSuccess.style.display = 'none';
      if (alertError) alertError.style.display = 'none';

      // Button loading state
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="icon" style="animation: spin 1s linear infinite; margin-right: 6px;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="4" stroke-opacity="0.25"></circle>
            <path d="M4 12a8 8 0 018-8" stroke-width="4"></path>
          </svg>
          Processing...
        `;
      }

      // Collect Form Data
      const formData = new FormData(form);
      const dataObj = Object.fromEntries(formData.entries());

      // Collect multiple checkboxes (e.g., Services Needed)
      const selectedServices = [];
      form.querySelectorAll('input[name="services[]"]:checked').forEach(cb => {
        selectedServices.push(cb.value);
      });
      if (selectedServices.length > 0) {
        dataObj.services_selected = selectedServices.join(', ');
      }

      const cfg = window.SITE_CONFIG || {};
      const endpoint = cfg.forms?.actionUrl || "https://api.web3forms.com/submit";
      const accessKey = cfg.forms?.accessKey || "demo-mode";

      try {
        if (accessKey === "demo-mode" || !accessKey) {
          // No access key configured: never pretend the lead was delivered
          console.warn('[Form Submission] No Web3Forms access key set in js/data/config.js; request was NOT sent.', dataObj);
          throw new Error('Form service not configured');
        } else {
          // Live API dispatch
          dataObj.access_key = accessKey;
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(dataObj)
          });
          const result = await response.json();
          if (!response.ok && !result.success) {
            throw new Error(result.message || 'Submission failed');
          }
        }

        // Success Feedback
        if (alertSuccess) {
          alertSuccess.innerHTML = `<strong>Thank you!</strong> Your consultation request has been received. Our senior partner will contact you within 2 to 4 business hours.`;
          alertSuccess.style.display = 'block';
        }
        form.reset();

        // Track GA Event
        if (typeof window.trackEvent === 'function') {
          window.trackEvent('form_submission', 'Lead Generation', form.id || 'consultation_form');
        }

      } catch (err) {
        console.error('Form submission error:', err);
        if (alertError) {
          alertError.textContent = 'An unexpected error occurred while transmitting your request. Please call or WhatsApp us directly at +91 98181 22696.';
          alertError.style.display = 'block';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  });
});
