<!-- 💙 COMBINED FOOTER SCRIPTS: Google Translate (#153) + Memberstack Custom Fields (#10) + Register Business Fields + Select Styling 💙 -->

<style>
/* Select input styling */
.form_input.is-select-input {
  position: relative;
  width: 100%;
  padding: 1rem 2.5rem 1rem 1rem !important;
  appearance: none !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  background-color: #fff;
  background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9l6 6 6-6' stroke='%23000000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 16px;
  cursor: pointer;
  border-radius: 10px;
}
.form_input.is-select-input::-ms-expand { display: none; }
</style>

<script>
(function() {
  'use strict';

  // ==========================================================
  // GOOGLE TRANSLATE SCRIPT (#153) - EN/IT/ES/FR
  // ==========================================================
  
  // Load Google Translate (async)
  const gtScript = document.createElement('script');
  gtScript.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  gtScript.async = true;
  document.head.appendChild(gtScript);

  // Hide Google UI + Protect notranslate elements + Preserve layout
  const style = document.createElement('style');
  style.innerHTML = `body{top:0!important;position:static!important}.goog-te-banner-frame,.skiptranslate,#goog-gt-tt,.goog-te-balloon-frame,.goog-text-highlight{display:none!important;background:none!important;box-shadow:none!important}.notranslate{translate:no!important}.notranslate *{translate:no!important}[data-ms-member].notranslate{box-sizing:border-box!important}[data-ms-member].notranslate:before,[data-ms-member].notranslate:after{display:none!important;content:none!important}`;
  document.head.appendChild(style);

  // Hidden container (once)
  if (!document.getElementById('google_translate_element')) {
    const d = document.createElement('div');
    d.id = 'google_translate_element';
    d.style.display = 'none';
    document.body.appendChild(d);
  }

  // Init widget
  window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({pageLanguage:'en',layout:google.translate.TranslateElement.FloatPosition.TOP_LEFT},'google_translate_element');
  };

  // Helpers
  const getCookie = n => document.cookie.split(';').map(c => c.trim().split('=')).reduce((a,[k,v]) => Object.assign(a,{[k]:decodeURIComponent(v||'')}),{})[n] || null;
  const setGT = v => {
    const past = "expires=Thu, 01 Jan 1970 00:00:01 GMT;", future = "expires=Fri, 31 Dec 9999 23:59:59 GMT;";
    if (!v) {
      document.cookie = "googtrans=;path=/;" + past;
      document.cookie = "googtrans=;domain=.webflow.io;path=/;" + past;
    } else {
      const e = "googtrans=" + encodeURIComponent(v) + ";path=/;" + future;
      document.cookie = e;
      document.cookie = "googtrans=" + encodeURIComponent(v) + ";domain=.webflow.io;path=/;" + future;
    }
  };
  const allowed = new Map([["en","English"],["it","Italian"],["es","Spanish"],["fr","French"]]);
  const badgeUpdate = code => {
    const lc = (allowed.has(code) ? code : 'en');
    const label = (lc.includes('-') ? lc : lc.slice(0,2)).toUpperCase();
    const readable = allowed.get(lc) || lc;
    document.querySelectorAll('.material-icons.language .google-icons').forEach(b => {
      b.textContent = label;
      b.setAttribute('data-lang', lc);
      b.title = readable;
      b.setAttribute('aria-label', 'Language: ' + readable);
    });
  };
  const showLang = code => {
    const lc = (allowed.has(code) ? code : 'en');
    const name = (allowed.get(lc) || 'English').toLowerCase();
    const cls = `.languagespecific.${name}specific`;
    document.querySelectorAll('.languagespecific').forEach(el => el.style.display = 'none');
    const nodes = document.querySelectorAll(cls);
    (nodes.length ? nodes : document.querySelectorAll('.languagespecific.englishspecific')).forEach(el => el.style.display = 'block');
  };
  const fire = c => {
    c.dispatchEvent(new Event('input', {bubbles:true}));
    c.dispatchEvent(new Event('change', {bubbles:true}));
  };

  // CUSTOM WORD TRANSLATIONS (per-language)
  const customLangTranslations = {
    es: new Map([
      ['Scooter', 'Pasola'],
      ['Scooters', 'Pasolas'],
      ['First name', 'Nombre'],
      ['Buggy', 'Buggy'],
      ['ATV', 'Fourwheel'],
      ['Make', 'Marca'],
    ]),
    fr: new Map([
      ['VTT', 'Quad'],
    ]),
  };

  // Apply/restore custom translations based on language
  const applyCustomWordTranslations = lang => {
    const customTranslations = customLangTranslations[lang];
    if (!customTranslations || customTranslations.size === 0) {
      document.querySelectorAll('span[data-custom-trans="true"]').forEach(span => {
        const original = span.getAttribute('data-original');
        if (original) {
          const textNode = document.createTextNode(original);
          span.parentNode.replaceChild(textNode, span);
        }
      });
      document.querySelectorAll('[data-custom-trans-applied]').forEach(el => {
        if (!el.querySelector('span[data-custom-trans="true"]')) el.removeAttribute('data-custom-trans-applied');
      });
      return;
    }
    {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: node => {
          const parent = node.parentElement;
          if (!parent || parent.closest('.notranslate') || parent.closest('script') || parent.closest('style') || parent.closest('noscript')) return NodeFilter.FILTER_REJECT;
          if (node.textContent.trim().length === 0) return NodeFilter.FILTER_REJECT;
          if (parent.hasAttribute('data-custom-trans-applied')) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      const textNodes = [];
      let node;
      while (node = walker.nextNode()) textNodes.push(node);
      textNodes.forEach(textNode => {
        const parent = textNode.parentElement;
        if (!parent) return;
        let text = textNode.textContent;
        const replacements = [];
        customTranslations.forEach((toWord, fromWord) => {
          const regex = new RegExp(`\\b${fromWord.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\b`,'gi');
          let match;
          while ((match = regex.exec(text)) !== null) {
            replacements.push({index:match.index, length:match[0].length, from:match[0], to:toWord});
          }
        });
        if (replacements.length > 0) {
          const computed = getComputedStyle(parent);
          const layoutProps = ['display','flex-direction','align-items','justify-content','flex-wrap','gap','flex','flex-grow','flex-shrink','flex-basis','align-self','order'];
          const originalStyles = {};
          layoutProps.forEach(prop => {
            const value = computed.getPropertyValue(prop);
            if (value && value.trim() && value !== 'none' && value !== 'auto' && value !== 'normal') {
              originalStyles[prop] = value.trim();
            }
          });
          replacements.sort((a,b) => b.index - a.index);
          const fragment = document.createDocumentFragment();
          let lastIndex = text.length;
          replacements.forEach(({index,length,from,to}) => {
            if (index + length < lastIndex) {
              const afterText = text.substring(index + length, lastIndex);
              if (afterText) fragment.insertBefore(document.createTextNode(afterText), fragment.firstChild);
            }
            const span = document.createElement('span');
            span.className = 'notranslate';
            span.setAttribute('translate', 'no');
            span.setAttribute('data-custom-trans', 'true');
            span.setAttribute('data-original', from);
            span.style.display = 'inline';
            span.textContent = to;
            fragment.insertBefore(span, fragment.firstChild);
            lastIndex = index;
          });
          if (lastIndex > 0) {
            const beforeText = text.substring(0, lastIndex);
            if (beforeText) fragment.insertBefore(document.createTextNode(beforeText), fragment.firstChild);
          }
          parent.replaceChild(fragment, textNode);
          parent.setAttribute('data-custom-trans-applied', 'true');
          if (Object.keys(originalStyles).length > 0) {
            const restoreLayout = () => {
              Object.keys(originalStyles).forEach(prop => {
                parent.style.setProperty(prop, originalStyles[prop], 'important');
              });
            };
            restoreLayout();
            setTimeout(restoreLayout, 10);
            setTimeout(restoreLayout, 50);
            setTimeout(restoreLayout, 100);
          }
        }
      });
  };

  // PROTECT DATA ATTRIBUTES FROM TRANSLATION
  const protect = () => {
    document.querySelectorAll('[data-ms-member]').forEach(el => {
      if (el.getAttribute('data-ms-code') === 'translate') return;
      if (!el.classList.contains('notranslate')) {
        const computed = getComputedStyle(el);
        const layoutProps = ['display','position','text-align','margin','padding'];
        const originalStyles = {};
        layoutProps.forEach(prop => {
          const value = computed.getPropertyValue(prop);
          if (value && value.trim() && value !== 'none' && value !== 'auto') {
            originalStyles[prop] = value.trim();
          }
        });
        el.classList.add('notranslate');
        el.setAttribute('translate', 'no');
        const orig = el.getAttribute('data-ms-member');
        if (orig) el.setAttribute('data-ms-original-value', orig);
        if (Object.keys(originalStyles).length > 0) {
          el.setAttribute('data-ms-layout-styles', JSON.stringify(originalStyles));
          const restoreLayout = () => {
            try {
              const stored = el.getAttribute('data-ms-layout-styles');
              if (stored) {
                const styles = JSON.parse(stored);
                Object.keys(styles).forEach(prop => {
                  el.style.setProperty(prop, styles[prop], 'important');
                });
              }
            } catch(e) {}
          };
          setTimeout(restoreLayout, 50);
          setTimeout(restoreLayout, 200);
          setTimeout(restoreLayout, 500);
          const styleWatcher = new MutationObserver(() => restoreLayout());
          styleWatcher.observe(el, {attributes:true, attributeFilter:['style']});
          setTimeout(() => styleWatcher.disconnect(), 5000);
        }
        new MutationObserver(m => m.forEach(n => {
          if (n.type === 'attributes' && n.attributeName === 'data-ms-member' && el.getAttribute('data-ms-member') !== orig) {
            el.setAttribute('data-ms-member', orig);
          }
        })).observe(el, {attributes:true, attributeFilter:['data-ms-member']});
      }
    });
  };

  // Wait for .goog-te-combo once, with a short-lived observer
  function getCombo(maxWaitMs = 4000) {
    return new Promise(resolve => {
      const existing = document.querySelector('.goog-te-combo');
      if (existing) return resolve(existing);
      const started = Date.now();
      const obs = new MutationObserver(() => {
        const c = document.querySelector('.goog-te-combo');
        if (c) { obs.disconnect(); resolve(c); }
        else if (Date.now() - started > maxWaitMs) { obs.disconnect(); resolve(null); }
      });
      obs.observe(document.body, {childList:true, subtree:true});
      setTimeout(() => { obs.disconnect(); resolve(document.querySelector('.goog-te-combo')); }, maxWaitMs);
    });
  }

  async function applyLang(code) {
    const target = allowed.has(code) ? code : 'en';
    badgeUpdate(target);
    showLang(target);
    protect();
    if (target === 'en') {
      setGT('');
      location.hash = '';
    } else {
      setGT(`/en/${target}`);
      location.hash = `#googtrans(en|${target})`;
    }
    const combo = await Promise.race([
      getCombo(2000),
      new Promise(resolve => setTimeout(() => resolve(null), 2000))
    ]);
    if (!combo) {
      setTimeout(() => {
        if (!document.querySelector('.goog-te-combo')) {
          window.location.reload();
        } else {
          protect();
          applyCustomWordTranslations(target);
        }
      }, 100);
      return;
    }
    const triggerTranslation = () => {
      fire(combo);
      ['change','input','blur'].forEach(type => {
        combo.dispatchEvent(new Event(type, {bubbles:true, cancelable:true}));
      });
      if (window.google && window.google.translate && window.google.translate.TranslateService) {
        try {
          const service = window.google.translate.TranslateService.getInstance();
          if (service && service.restore) service.restore();
        } catch(e) {}
      }
    };
    if (target === 'en') {
      const hasBlank = [].some.call(combo.options, o => o.value === '');
      if (hasBlank) {
        combo.value = '';
        triggerTranslation();
      } else {
        combo.value = 'en';
        triggerTranslation();
        setTimeout(() => {
          combo.value = '';
          triggerTranslation();
        }, 50);
      }
    } else {
      if (combo.value === '' || combo.value === 'en') {
        combo.value = 'en';
        triggerTranslation();
        setTimeout(() => {
          combo.value = target;
          triggerTranslation();
        }, 50);
      } else {
        combo.value = target;
        triggerTranslation();
      }
    }
    const applyWithRetry = (attempt = 0) => {
      if (attempt > 5) {
        const currentLang = getCookie('googtrans')?.split('/').pop() || 'en';
        if (currentLang !== target) {
          console.log('Translation not applied, forcing page reload');
          window.location.reload();
        }
        return;
      }
      protect();
      applyCustomWordTranslations(target);
      setTimeout(() => {
        const currentLang = getCookie('googtrans')?.split('/').pop() || 'en';
        const comboValue = combo ? combo.value : '';
        const expectedValue = target === 'en' ? '' : target;
        const isCorrect = (currentLang === target) || (comboValue === expectedValue);
        if (!isCorrect && attempt < 5) {
          if (combo) {
            combo.value = target === 'en' ? '' : target;
            triggerTranslation();
          }
          applyWithRetry(attempt + 1);
        }
      }, 150 * (attempt + 1));
    };
    setTimeout(() => applyWithRetry(), 100);
  }

  // Enhanced click handler with immediate feedback
  function setupLangButtons() {
    document.querySelectorAll('[data-ms-code-lang-select]:not([data-lang-handler-bound])').forEach(el => {
      el.setAttribute('data-lang-handler-bound', 'true');
      const handler = function(e) {
        e.preventDefault();
        e.stopPropagation();
        const code = el.getAttribute('data-ms-code-lang');
        if (code) {
          badgeUpdate(code);
          showLang(code);
          applyLang(code);
        }
        const dropdown = el.closest('.w-dropdown');
        if (dropdown) {
          const toggle = dropdown.querySelector('.w-dropdown-toggle');
          if (toggle && toggle.classList.contains('w--open')) {
            setTimeout(() => toggle.click(), 100);
          }
        }
      };
      el.addEventListener('click', handler, {passive:false});
      el.addEventListener('touchend', function(e) {
        e.preventDefault();
        handler(e);
      }, {passive:false});
    });
  }

  // ==========================================================
  // MEMBERSCRIPT #10 - HIDE ELEMENTS IF CUSTOM FIELD IS BLANK
  // ==========================================================
  
  function hideCustomFieldElements() {
    let msMem = {};
    try {
      msMem = JSON.parse(localStorage.getItem('_ms-mem')) || {};
    } catch(e) {
      msMem = {};
    }
    const customFields = msMem.customFields || {};
    const elements = document.querySelectorAll('[ms-code-customfield]');
    elements.forEach(element => {
      const attr = element.getAttribute('ms-code-customfield');
      if (!attr) return;
      if (attr.startsWith('!')) {
        const key = attr.slice(1);
        if (customFields[key]) element.remove();
      } else {
        if (!customFields[attr]) element.remove();
      }
    });
  }

  // ==========================================================
  // REGISTER BUSINESS SIGN UP FIELDS SCRIPT
  // ==========================================================
  
  const FIELD_1_SELECTOR = '#rnc';
  const FIELD_2_SELECTOR = '#business-name';
  const STORAGE_KEY = 'montate_register_business_clicked';

  function showField(fieldElement) {
    if (!fieldElement) return;
    const wrapper = fieldElement.closest('.form_field-wrapper');
    if (wrapper) {
      wrapper.classList.remove('hidden');
      if (wrapper.style.display === 'none') wrapper.style.display = '';
      wrapper.style.opacity = '1';
      wrapper.style.maxHeight = 'none';
      wrapper.style.overflow = 'visible';
      wrapper.style.margin = '';
      wrapper.style.padding = '';
      wrapper.style.pointerEvents = 'auto';
    } else {
      fieldElement.classList.remove('hidden');
      if (fieldElement.style.display === 'none') fieldElement.style.display = '';
    }
  }

  function isSignUpPage() {
    const path = window.location.pathname.toLowerCase();
    const href = window.location.href.toLowerCase();
    return path.includes('/sign-up') || path.includes('/signup') || path.includes('/register') ||
           path.includes('/sign-up/') || href.includes('sign-up') || href.includes('signup') ||
           document.querySelector('form[data-wf-form-id]') !== null;
  }

  function setupRegisterBusinessButton() {
    document.addEventListener('click', function(e) {
      const button = e.target.closest('#register-business');
      if (button) {
        sessionStorage.setItem(STORAGE_KEY, 'true');
        button.style.opacity = '0.7';
        setTimeout(() => { button.style.opacity = ''; }, 200);
      }
    });
    const existingButton = document.getElementById('register-business');
    if (existingButton && !existingButton.hasAttribute('data-register-handler-bound')) {
      existingButton.setAttribute('data-register-handler-bound', 'true');
      existingButton.addEventListener('click', function() {
        sessionStorage.setItem(STORAGE_KEY, 'true');
      });
    }
  }

  function showBusinessFields() {
    const flag = sessionStorage.getItem(STORAGE_KEY);
    if (flag === 'true') {
      const field1 = document.querySelector(FIELD_1_SELECTOR);
      if (field1) showField(field1);
      const field2 = document.querySelector(FIELD_2_SELECTOR);
      if (field2) showField(field2);
    }
  }

  // ==========================================================
  // INITIALIZATION
  // ==========================================================
  
  function init() {
    // Google Translate initialization
    protect();
    const current = (allowed.has(getCookie('googtrans')?.split('/').pop()) ? getCookie('googtrans')?.split('/').pop() : 'en') || 'en';
    badgeUpdate(current);
    showLang(current);
    setTimeout(() => applyCustomWordTranslations(current), 200);
    setupLangButtons();
    setTimeout(setupLangButtons, 100);
    setTimeout(setupLangButtons, 500);
    new MutationObserver(() => setupLangButtons()).observe(document.body, {childList:true, subtree:true});
    getCombo().then(c => {
      if (!c || c._msBound) return;
      c.addEventListener('change', () => {
        const v = allowed.has(c.value) ? c.value : 'en';
        badgeUpdate(v);
        showLang(v);
        setTimeout(() => { protect(); applyCustomWordTranslations(v); }, 100);
      });
      c._msBound = true;
    });
    new MutationObserver(protect).observe(document.body, {childList:true, subtree:true});
    setInterval(protect, 1000);

    // Memberstack custom fields
    hideCustomFieldElements();

    // Register business fields
    setupRegisterBusinessButton();
    if (isSignUpPage()) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', showBusinessFields);
      } else {
        showBusinessFields();
        setTimeout(showBusinessFields, 500);
        setTimeout(showBusinessFields, 1000);
      }
      const observer = new MutationObserver(() => showBusinessFields());
      observer.observe(document.body, {childList:true, subtree:true});
      setTimeout(() => observer.disconnect(), 5000);
    }
  }

  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    protect();
    setTimeout(setupLangButtons, 50);
    hideCustomFieldElements();
  }

})();
</script>

