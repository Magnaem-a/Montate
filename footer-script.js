<!-- 💙 MEMBERSCRIPT #153 v2.0 💙 - FREE MULTILINGUAL SITE WITH GOOGLE TRANSLATE -->

<script>

  // 1) Load Google Translate

  const gtScript = document.createElement('script');

  gtScript.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

  document.head.appendChild(gtScript);

  // 2) Hide Google UI

  const style = document.createElement('style');

  style.innerHTML = `

    body { top: 0px !important; position: static !important; }

    .goog-te-banner-frame, .skiptranslate,

    #goog-gt-tt, .goog-te-balloon-frame,

    .goog-text-highlight {

      display: none !important;

      background: none !important;

      box-shadow: none !important;

    }

  `;

  document.head.appendChild(style);

  // 3) Ensure container exists

  if (!document.getElementById('google_translate_element')) {

    const holder = document.createElement('div');

    holder.id = 'google_translate_element';

    holder.style.display = 'none';

    document.body.appendChild(holder);

  }

  // 4) Init widget

  window.googleTranslateElementInit = function () {

    new google.translate.TranslateElement({

      pageLanguage: 'en',

      layout: google.translate.TranslateElement.FloatPosition.TOP_LEFT

    }, 'google_translate_element');

  };

  // 5) Cookies

  function getCookie(name) {

    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {

      const [key, value] = cookie.trim().split('=');

      if (key === name) return decodeURIComponent(value);

    }

    return null;

  }

  function setGoogTransCookie(pathValue) {

    const expiresPast = "expires=Thu, 01 Jan 1970 00:00:01 GMT;";

    const expiresFuture = "expires=Fri, 31 Dec 9999 23:59:59 GMT;";

    if (!pathValue) {

      document.cookie = "googtrans=;path=/;" + expiresPast;

      document.cookie = "googtrans=;domain=.webflow.io;path=/;" + expiresPast;

    } else {

      document.cookie = "googtrans=" + encodeURIComponent(pathValue) + ";path=/;" + expiresFuture;

      document.cookie = "googtrans=" + encodeURIComponent(pathValue) + ";domain=.webflow.io;path=/;" + expiresFuture;

    }

  }

  // 6) Language map

  const languageMap = new Map([

    ["af","Afrikaans"], ["sq","Albanian"], ["ar","Arabic"], ["hy","Armenian"],

    ["az","Azerbaijani"], ["eu","Basque"], ["be","Belarusian"], ["bg","Bulgarian"],

    ["ca","Catalan"], ["zh-CN","ChineseSimplified"], ["zh-TW","ChineseTraditional"],

    ["hr","Croatian"], ["cs","Czech"], ["da","Danish"], ["nl","Dutch"], ["de","German"],

    ["en","English"], ["et","Estonian"], ["tl","Filipino"], ["fi","Finnish"],

    ["fr","French"], ["gl","Galician"], ["ka","Georgian"], ["el","Greek"],

    ["ht","Haitian"], ["iw","Hebrew"], ["hi","Hindi"], ["hu","Hungarian"],

    ["is","Icelandic"], ["id","Indonesian"], ["ga","Irish"], ["it","Italian"],

    ["ja","Japanese"], ["ko","Korean"], ["lv","Latvian"], ["lt","Lithuanian"],

    ["mk","Macedonian"], ["ms","Malay"], ["mt","Maltese"], ["no","Norwegian"],

    ["fa","Persian"], ["pl","Polish"], ["pt","Portuguese"], ["ro","Romanian"],

    ["ru","Russian"], ["sr","Serbian"], ["sk","Slovak"], ["sl","Slovenian"],

    ["es","Spanish"], ["sw","Swahili"], ["sv","Swedish"], ["th","Thai"],

    ["tr","Turkish"], ["uk","Ukrainian"], ["ur","Urdu"], ["vi","Vietnamese"],

    ["cy","Welsh"], ["yi","Yiddish"]

  ]);

  // 7) Current language

  let currentLang = getCookie("googtrans")?.split("/").pop() || "en";

  // 8) Badge + content helpers

  function formatLangCodeForBadge(code) {

    return code && code.includes('-') ? code.toUpperCase() : (code || 'en').slice(0, 2).toUpperCase();

  }

  function updateLanguageBadge(langCode) {

    const badgeEl = document.querySelector('.material-icons.language .google-icons');

    if (badgeEl) {

      const lc = langCode || 'en';

      badgeEl.textContent = formatLangCodeForBadge(lc);

      badgeEl.setAttribute('data-lang', lc);

      const readable = languageMap.get(lc) || lc;

      badgeEl.setAttribute('title', readable);

      badgeEl.setAttribute('aria-label', `Language: ${readable}`);

    }

  }

  function updateLanguageSpecificContent(langCode) {

    const readable = languageMap.get(langCode || 'en');

    const langClass = readable ? `.languagespecific.${readable.toLowerCase()}specific` : `.languagespecific.englishspecific`;

    const fallbackClass = `.languagespecific.englishspecific`;

    document.querySelectorAll('.languagespecific').forEach(el => { el.style.display = 'none'; });

    if (document.querySelector(langClass)) {

      document.querySelectorAll(langClass).forEach(el => el.style.display = 'block');

    } else {

      document.querySelectorAll(fallbackClass).forEach(el => el.style.display = 'block');

    }

  }

  // 9) Wait for dropdown

  function waitForCombo(maxWaitMs = 6000) {

    return new Promise((resolve) => {

      const existing = document.querySelector('.goog-te-combo');

      if (existing) return resolve(existing);

      const started = Date.now();

      const obs = new MutationObserver(() => {

        const c = document.querySelector('.goog-te-combo');

        if (c) {

          obs.disconnect();

          resolve(c);

        } else if (Date.now() - started > maxWaitMs) {

          obs.disconnect();

          resolve(null);

        }

      });

      obs.observe(document.body, { childList: true, subtree: true });

      setTimeout(() => {

        const c = document.querySelector('.goog-te-combo');

        if (c) {

          obs.disconnect();

          resolve(c);

        }

      }, maxWaitMs);

    });

  }

  // 10) Robust event dispatch

  function fireComboEvents(combo) {

    combo.dispatchEvent(new Event('input', { bubbles: true }));

    combo.dispatchEvent(new Event('change', { bubbles: true }));

    combo.dispatchEvent(new Event('blur', { bubbles: true }));

  }

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // 11) Apply language (single-click reliable)

  async function applyLanguage(langCode) {

    const combo = await waitForCombo();

    const target = langCode || 'en';

    updateLanguageBadge(target);

    updateLanguageSpecificContent(target);

    if (!combo) {

      if (target === 'en') {

        setGoogTransCookie('');

        window.location.hash = '';

      } else {

        setGoogTransCookie(`/en/${target}`);

        window.location.hash = `#googtrans(en|${target})`;

      }

      return;

    }

    combo.focus();

    if (target === 'en') {

      setGoogTransCookie('');

      window.location.hash = '';

      const hasBlank = Array.from(combo.options).some(o => o.value === '');

      if (hasBlank) {

        combo.value = '';

        fireComboEvents(combo);

      } else {

        combo.value = 'en';

        fireComboEvents(combo);

        await sleep(120);

        combo.value = '';

        fireComboEvents(combo);

      }

      return;

    }

    if (combo.value === '') {

      combo.value = 'en';

      fireComboEvents(combo);

      await sleep(120);

    }

    setGoogTransCookie(`/en/${target}`);

    window.location.hash = `#googtrans(en|${target})`;

    combo.value = target;

    fireComboEvents(combo);

    await sleep(120);

    if (combo.value !== target) {

      combo.value = target;

      fireComboEvents(combo);

    }

  }

  // 12) Custom Translations

  const preserveCase = (o, t) => {

    if (!o || !t) return t;

    if (o[0] === o[0].toUpperCase() && o[0] !== o[0].toLowerCase()) return t[0].toUpperCase() + t.slice(1).toLowerCase();

    return t.toLowerCase();

  };

  const customLangTranslations = {

    es: new Map([['Scooter','Pasola'],['Scooters','Pasolas'],['First name','Nombre'],['Buggy','Buggy'],['ATV','Fourwheel'],['Make','Marca']]),

    fr: new Map([['ATV','Quad'],['ATVs','Quads'],['atv','Quad'],['atvs','Quads'],['ATV\'s','Quads'],['atv\'s','Quads'],['VTT','Quad'],['Vtt','Quad'],['vtt','Quad'],['VTTs','Quads'],['Vtts','Quads'],['des quads','Quads'],['des VTT','Quads'],['Équipes de quatre','Quads'],['équipes de quatre','Quads']])

  };

  const reverseTranslationMap = new Map([

    ['VTT','ATV'],['Vtt','ATV'],['vtt','ATV'],['VTTs','ATVs'],['Vtts','ATVs'],

    ['des quads','ATVs'],['des VTT','ATVs'],['Équipes de quatre','ATVs'],['équipes de quatre','ATVs'],

    ['Fourwheel','ATV'],['fourwheel','ATV'],['Fourwheels','ATVs'],['fourwheels','ATVs'],

    ['Pasola','Scooter'],['Pasolas','Scooters'],

    ['Nombre','First name']

  ]);

  let isApplyingCustomTrans = false;

  let lastCustomTransTime = 0;

  function applyCustomWordTranslations(lang) {

    if (isApplyingCustomTrans) return;

    const now = Date.now();

    if (now - lastCustomTransTime < 1000) return;

    isApplyingCustomTrans = true;

    lastCustomTransTime = now;

    const customTranslations = customLangTranslations[lang];

    if (!customTranslations || customTranslations.size === 0) {

      document.querySelectorAll('span[data-custom-trans="true"]').forEach(span => {

        const origEnglish = span.getAttribute('data-orig-english');

        if (origEnglish) {

          const t = document.createTextNode(origEnglish);

          const parent = span.parentNode;

          if (parent) parent.replaceChild(t, span);

        }

      });

      document.querySelectorAll('[data-custom-trans-applied]').forEach(el => {

        if (!el.querySelector('span[data-custom-trans="true"]')) el.removeAttribute('data-custom-trans-applied');

      });

      isApplyingCustomTrans = false;

      return;

    }

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {

      acceptNode: n => {

        const p = n.parentElement;

        if (!p || !n.textContent.trim()) return NodeFilter.FILTER_REJECT;

        if (p.closest('.notranslate') || p.closest('script') || p.closest('style') || p.closest('noscript')) return NodeFilter.FILTER_REJECT;

        if (p.closest('span[data-custom-trans="true"]')) return NodeFilter.FILTER_REJECT;

        if (p.hasAttribute('data-custom-trans-applied') && p.querySelector('span[data-custom-trans="true"]')) return NodeFilter.FILTER_REJECT;

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

      if (text.includes('Quad') && !text.includes('ATV') && !text.includes('VTT')) return;

      const replacements = [];

      customTranslations.forEach((toWord, fromWord) => {

        const escaped = fromWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const regex = new RegExp(escaped.includes(' ') ? escaped : `\\b${escaped}\\b`, 'gi');

        let match;

        while ((match = regex.exec(text)) !== null) {

          let origEnglish = fromWord;

          const rev = reverseTranslationMap.get(match[0]);

          if (rev) origEnglish = rev;

          replacements.push({

            index: match.index,

            length: match[0].length,

            from: match[0],

            to: preserveCase(match[0], toWord),

            origEnglish

          });

        }

      });

      if (replacements.length > 0) {

        const computed = getComputedStyle(parent);

        const layoutProps = ['display','flex-direction','align-items','justify-content','flex-wrap','gap','flex','flex-grow','flex-shrink','flex-basis','align-self','order'];

        const originalStyles = {};

        layoutProps.forEach(prop => {

          const v = computed.getPropertyValue(prop);

          if (v && v.trim() && v !== 'none' && v !== 'auto' && v !== 'normal') originalStyles[prop] = v.trim();

        });

        replacements.sort((a, b) => b.index - a.index);

        const fragment = document.createDocumentFragment();

        let lastIndex = text.length;

        replacements.forEach(({index, length, from, to, origEnglish}) => {

          if (index + length < lastIndex) {

            const after = text.substring(index + length, lastIndex);

            if (after) fragment.insertBefore(document.createTextNode(after), fragment.firstChild);

          }

          const span = document.createElement('span');

          span.className = 'notranslate';

          span.setAttribute('translate', 'no');

          span.setAttribute('data-custom-trans', 'true');

          span.setAttribute('data-orig-english', origEnglish);

          span.style.display = 'inline';

          span.textContent = to;

          fragment.insertBefore(span, fragment.firstChild);

          lastIndex = index;

        });

        if (lastIndex > 0) {

          const before = text.substring(0, lastIndex);

          if (before) fragment.insertBefore(document.createTextNode(before), fragment.firstChild);

        }

        parent.replaceChild(fragment, textNode);

        parent.setAttribute('data-custom-trans-applied', 'true');

        if (Object.keys(originalStyles).length > 0) {

          const restore = () => Object.keys(originalStyles).forEach(prop => parent.style.setProperty(prop, originalStyles[prop], 'important'));

          [0, 10, 50, 100].forEach(d => setTimeout(restore, d));

        }

      }

    });

    isApplyingCustomTrans = false;

  }

  // 13) Protect elements (data-ms-member and calendar)

  function protect() {

    document.querySelectorAll('.flatpickr-calendar, .flatpickr-weekday, .flatpickr-day, .flatpickr-month, .flatpickr-current-month, .numInputWrapper, .cur-year, .flatpickr-current-month input, .flatpickr-current-month .numInputWrapper input').forEach(el => {

      if (!el.classList.contains('notranslate')) {

        el.classList.add('notranslate');

        el.setAttribute('translate', 'no');

        if (el.style) el.style.display = '';

        el.querySelectorAll('font').forEach(font => {

          font.classList.add('notranslate');

          font.setAttribute('translate', 'no');

          if (font.style) font.style.display = '';

        });

      }

    });

    document.querySelectorAll('[data-ms-member]').forEach(el => {

      if (el.getAttribute('data-ms-code') === 'translate' || el.classList.contains('notranslate')) return;

      const computed = getComputedStyle(el);

      const layoutProps = ['display','position','text-align','margin','padding'];

      const originalStyles = {};

      layoutProps.forEach(prop => {

        const v = computed.getPropertyValue(prop);

        if (v && v.trim() && v !== 'none' && v !== 'auto') originalStyles[prop] = v.trim();

      });

      el.classList.add('notranslate');

      el.setAttribute('translate', 'no');

      const orig = el.getAttribute('data-ms-member');

      if (orig) el.setAttribute('data-ms-original-value', orig);

      if (Object.keys(originalStyles).length > 0) {

        el.setAttribute('data-ms-layout-styles', JSON.stringify(originalStyles));

        const restore = () => {

          try {

            const s = el.getAttribute('data-ms-layout-styles');

            if (s) {

              const styles = JSON.parse(s);

              Object.keys(styles).forEach(prop => el.style.setProperty(prop, styles[prop], 'important'));

            }

          } catch(e) {}

        };

        [50, 200, 500].forEach(d => setTimeout(restore, d));

        const watcher = new MutationObserver(restore);

        watcher.observe(el, { attributes: true, attributeFilter: ['style'] });

        setTimeout(() => watcher.disconnect(), 5000);

      }

      new MutationObserver(m => m.forEach(n => {

        if (n.type === 'attributes' && n.attributeName === 'data-ms-member' && el.getAttribute('data-ms-member') !== orig) {

          el.setAttribute('data-ms-member', orig);

        }

      })).observe(el, { attributes: true, attributeFilter: ['data-ms-member'] });

    });

  }

  // 14) Memberstack custom fields (#10)

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

      if (attr && attr.startsWith('!')) {

        const key = attr.substring(1);

        if (customFields[key]) element.remove();

      } else {

        if (!customFields[attr]) element.remove();

      }

    });

  }

  // 15) Wire up

  document.addEventListener("DOMContentLoaded", function () {

    updateLanguageBadge(currentLang);

    updateLanguageSpecificContent(currentLang);

    protect();

    hideCustomFieldElements();

    document.querySelectorAll('[data-ms-code-lang-select]').forEach(el => {

      el.addEventListener('click', function (e) {

        e.preventDefault();

        const selectedLang = this.getAttribute('data-ms-code-lang');

        applyLanguage(selectedLang);

      });

    });

    waitForCombo().then((combo) => {

      if (!combo) return;

      if (!combo._msBound) {

        combo.addEventListener('change', () => {

          const val = combo.value || 'en';

          updateLanguageBadge(val);

          updateLanguageSpecificContent(val);

          setTimeout(() => {

            protect();

            if (val !== 'en') applyCustomWordTranslations(val);

            else applyCustomWordTranslations('en');

          }, 500);

        });

        combo._msBound = true;

      }

    });

    // Periodic protection and custom translations

    setInterval(() => {

      protect();

      const lang = getCookie("googtrans")?.split("/").pop() || "en";

      if (lang !== 'en') applyCustomWordTranslations(lang);

    }, 3000);

  });

</script>
