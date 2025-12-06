<!-- ==========================================================
MONTATE – GLOBAL FRONTEND SCRIPT (SEARCH + PICKERS + A2HS)
Version: 1.0 | Nov 2025 | Author: Magnaem Ambata
--------------------------------------------------------------
PURPOSE:
• Handles search form data + redirect
• Initializes Flatpickr date & time pickers with rules
• Displays Add-to-Home-Screen banner for iOS & Android
=========================================================== -->

<!-- Flatpickr CDN (required) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
<!-- Note: Using custom locale definitions instead of CDN locale files for accuracy -->
<style>
/* Protect Flatpickr calendar from Google Translate */
.flatpickr-calendar,
.flatpickr-calendar *,
.flatpickr-weekday,
.flatpickr-day,
.flatpickr-month,
.flatpickr-current-month {
  translate: no !important;
}
</style>

<script>
document.addEventListener("DOMContentLoaded", function () {

  /* ==========================================================
     1. SEARCH FORM SUBMISSION HANDLING
     - Saves search data to localStorage
     - Redirects to /search-results with query params
     - If location = "Other", redirect to waitlist page
  ========================================================== */
  const searchForm = document.getElementById("wf-form-Search-Form");

  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Extract form values
      // FIXED: Changed from 'Vehicle-Type' to 'Car-Type' to match form HTML
      const location = searchForm.querySelector("[name='Location']")?.value?.trim() || "";
      const vehicleType = searchForm.querySelector("[name='Car-Type']")?.value?.trim() || "";
      const start = document.getElementById("start-date")?.value?.trim() || "";
      const end = document.getElementById("end-date")?.value?.trim() || "";

      // If user selects "Other" → redirect to waitlist
      if (location.toLowerCase() === "other") {
        window.location.href = "/join-the-waitlist";
        return;
      }

      // Store last search in localStorage for UX memory
      const searchData = { location, vehicleType, start, end };
      localStorage.setItem("lastSearch", JSON.stringify(searchData));

      // Build redirect query string
      const params = new URLSearchParams();
      if (location) params.append("location", location);
      if (vehicleType) params.append("vehicleType", vehicleType);
      if (start) params.append("start", start);
      if (end) params.append("end", end);

      // Redirect to results page
      window.location.href = "/search-results?" + params.toString();
    });
  }

  /* ==========================================================
     2. FLATPICKR DATE & TIME PICKERS
     - Both allow past & future dates
     - End date always forced to be >= start date
     - Placeholders preserved to prevent flickering
  ========================================================== */
  let startDateInstance, endDateInstance;

  // Placeholder translation setup (must be defined before Flatpickr init)
  const placeholderTranslations = {
    en: { start: "Start", end: "End" },
    it: { start: "Inizio", end: "Fine" },
    es: { start: "Inicio", end: "Fin" },
    fr: { start: "Début", end: "Fin" }
  };

  function getCurrentLanguage() {
    try {
      const getCookie = n => document.cookie.split(';').map(c => c.trim().split('=')).reduce((a,[k,v]) => Object.assign(a,{[k]:decodeURIComponent(v||'')}),{})[n] || null;
      const googtrans = getCookie('googtrans');
      if (googtrans) {
        const lang = googtrans.split('/').pop();
        if (placeholderTranslations[lang]) return lang;
      }
    } catch (e) {}
    return 'en';
  }

  function getTranslatedPlaceholders() {
    const lang = getCurrentLanguage();
    return placeholderTranslations[lang] || placeholderTranslations.en;
  }

  // Custom accurate locale definitions (to ensure correct translations)
  // Weekdays array always starts with Sunday (index 0) regardless of firstDayOfWeek
  const customLocales = {
    en: null, // English is default - use Flatpickr's built-in English
    it: {
      weekdays: {
        shorthand: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
        longhand: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato']
      },
      months: {
        shorthand: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
        longhand: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']
      },
      firstDayOfWeek: 1
    },
    es: {
      weekdays: {
        shorthand: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
        longhand: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
      },
      months: {
        shorthand: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        longhand: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
      },
      firstDayOfWeek: 1
    },
    fr: {
      weekdays: {
        shorthand: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
        longhand: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
      },
      months: {
        shorthand: ['Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
        longhand: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
      },
      firstDayOfWeek: 1
    }
  };

  // Flatpickr locale mapping (ONLY using custom accurate locales - ignore CDN)
  function getFlatpickrLocaleForLang(lang) {
    if (lang === 'en') {
      // For English, explicitly return null to use default English locale
      return null;
    }
    
    // ALWAYS use custom locale definitions - never use CDN locales
    if (customLocales[lang]) {
      // Return a fresh copy to avoid reference issues
      const localeCopy = JSON.parse(JSON.stringify(customLocales[lang]));
      console.log('Using custom locale for', lang, localeCopy);
      return localeCopy;
    }
    
    // If custom locale not found, return null (will use English default)
    console.warn('Custom locale not found for language:', lang);
    return null;
  }

  function getFlatpickrLocale() {
    const lang = getCurrentLanguage();
    return getFlatpickrLocaleForLang(lang);
  }

  // Track current locale to prevent unnecessary updates (declare early)
  let currentLocale = null;

  // Ensure placeholders are set on inputs before Flatpickr initializes
  const startInput = document.getElementById("start-date");
  const endInput = document.getElementById("end-date");
  const translations = getTranslatedPlaceholders();
  
  if (startInput && !startInput.value) {
    startInput.setAttribute("placeholder", translations.start);
  }
  if (endInput && !endInput.value) {
    endInput.setAttribute("placeholder", translations.end);
  }

  // Get initial locale (always use custom locales, no need to wait for CDN)
  let initialLocale = getFlatpickrLocale();
  const initialLang = getCurrentLanguage();
  currentLocale = initialLang;

  // Build config for start date picker (conditionally include locale)
  const startPickerConfig = {
    enableTime: true,
    dateFormat: "d/m/Y H:i",
    placeholder: translations.start,
    allowInput: true,
    disableMobile: true, // CRITICAL: Forces custom picker on mobile to preserve placeholder
    onReady: function(selectedDates, dateStr, instance) {
      // Ensure placeholder stays visible after initialization
      const trans = getTranslatedPlaceholders();
      if (!instance.input.value) {
        instance.input.setAttribute("placeholder", trans.start);
        instance.input.placeholder = trans.start; // Set both ways for compatibility
      }
      // Force placeholder visibility with a small delay
      setTimeout(function() {
        if (!instance.input.value && instance.input) {
          const trans = getTranslatedPlaceholders();
          instance.input.setAttribute("placeholder", trans.start);
          instance.input.placeholder = trans.start;
        }
      }, 100);
      // Ensure year is visible
      ensureYearVisible(instance);
    },
    onOpen: function(selectedDates, dateStr, instance) {
      // Ensure year is visible when calendar opens
      setTimeout(() => ensureYearVisible(instance), 50);
      setTimeout(() => ensureYearVisible(instance), 200);
      setTimeout(() => ensureYearVisible(instance), 500);
    },
    onChange: function (selectedDates, dateStr, instance) {
      // Restore placeholder when cleared
      if (!dateStr && instance.input) {
        const trans = getTranslatedPlaceholders();
        instance.input.setAttribute("placeholder", trans.start);
        instance.input.placeholder = trans.start;
      }
      
      if (!selectedDates.length || !endDateInstance) return;

      // Always enforce end date >= start date
      endDateInstance.set("minDate", selectedDates[0]);

      // If currently selected end date is invalid, clear it
      if (endDateInstance.selectedDates[0] < selectedDates[0]) {
        endDateInstance.clear();
      }
    }
  };
  
  // Only add locale if it's not null (for non-English languages)
  if (initialLocale !== null) {
    startPickerConfig.locale = initialLocale;
  }
  
  // Start date picker
  startDateInstance = flatpickr("#start-date", startPickerConfig);
  
  // Protect Flatpickr calendar from Google Translate
  if (startDateInstance) {
    protectFlatpickrFromTranslation(startDateInstance);
  }

  // Build config for end date picker (conditionally include locale)
  const endPickerConfig = {
    enableTime: true,
    dateFormat: "d/m/Y H:i",
    placeholder: translations.end,
    allowInput: true,
    disableMobile: true, // CRITICAL: Forces custom picker on mobile to preserve placeholder
    onReady: function(selectedDates, dateStr, instance) {
      // Ensure placeholder stays visible after initialization
      const trans = getTranslatedPlaceholders();
      if (!instance.input.value) {
        instance.input.setAttribute("placeholder", trans.end);
        instance.input.placeholder = trans.end; // Set both ways for compatibility
      }
      // Force placeholder visibility with a small delay
      setTimeout(function() {
        if (!instance.input.value && instance.input) {
          const trans = getTranslatedPlaceholders();
          instance.input.setAttribute("placeholder", trans.end);
          instance.input.placeholder = trans.end;
        }
      }, 100);
      // Ensure year is visible
      ensureYearVisible(instance);
    },
    onOpen: function(selectedDates, dateStr, instance) {
      // Ensure year is visible when calendar opens
      setTimeout(() => ensureYearVisible(instance), 50);
      setTimeout(() => ensureYearVisible(instance), 200);
      setTimeout(() => ensureYearVisible(instance), 500);
    },
    onChange: function (selectedDates, dateStr, instance) {
      // Restore placeholder when cleared
      if (!dateStr && instance.input) {
        const trans = getTranslatedPlaceholders();
        instance.input.setAttribute("placeholder", trans.end);
        instance.input.placeholder = trans.end;
      }
    }
  };
  
  // Only add locale if it's not null (for non-English languages)
  if (initialLocale !== null) {
    endPickerConfig.locale = initialLocale;
  }
  
  // End date picker
  endDateInstance = flatpickr("#end-date", endPickerConfig);
  
  // Protect Flatpickr calendar from Google Translate
  if (endDateInstance) {
    protectFlatpickrFromTranslation(endDateInstance);
  }
  
  // Function to ensure year input is visible and functional
  function ensureYearVisible(instance) {
    if (!instance || !instance.calendarContainer) return;
    
    const yearInputs = instance.calendarContainer.querySelectorAll('.cur-year, .numInput.cur-year, input.cur-year, .numInputWrapper input.cur-year');
    yearInputs.forEach(yearInput => {
      if (!yearInput) return;
      
      // Set value if empty
      if (!yearInput.value || yearInput.value === '' || yearInput.value === '0') {
        const currentYear = new Date().getFullYear();
        yearInput.value = currentYear;
        yearInput.setAttribute('value', currentYear);
        // Trigger input event to update Flatpickr
        yearInput.dispatchEvent(new Event('input', { bubbles: true }));
        yearInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
      
      // Force visibility and functionality
      yearInput.style.setProperty('display', 'inline-block', 'important');
      yearInput.style.setProperty('visibility', 'visible', 'important');
      yearInput.style.setProperty('opacity', '1', 'important');
      yearInput.style.setProperty('width', 'auto', 'important');
      yearInput.style.setProperty('min-width', '70px', 'important');
      yearInput.style.setProperty('color', '#111', 'important');
      yearInput.style.setProperty('-webkit-text-fill-color', '#111', 'important');
      yearInput.style.setProperty('background', 'transparent', 'important');
      yearInput.style.setProperty('border', 'none', 'important');
      yearInput.style.setProperty('pointer-events', 'auto', 'important');
      yearInput.style.setProperty('cursor', 'text', 'important');
      yearInput.removeAttribute('disabled');
      yearInput.removeAttribute('readonly');
      
      // Protect from translation
      yearInput.classList.add('notranslate');
      yearInput.setAttribute('translate', 'no');
      
      // Ensure parent wrapper is visible and functional
      const wrapper = yearInput.closest('.numInputWrapper');
      if (wrapper) {
        wrapper.style.setProperty('display', 'inline-block', 'important');
        wrapper.style.setProperty('visibility', 'visible', 'important');
        wrapper.style.setProperty('opacity', '1', 'important');
        wrapper.classList.add('notranslate');
        wrapper.setAttribute('translate', 'no');
        
        // Ensure arrows are visible
        const arrows = wrapper.querySelectorAll('.arrowUp, .arrowDown');
        arrows.forEach(arrow => {
          arrow.style.setProperty('display', 'block', 'important');
          arrow.style.setProperty('visibility', 'visible', 'important');
        });
      }
    });
  }
  
  // Function to protect Flatpickr calendar elements from Google Translate
  function protectFlatpickrFromTranslation(instance) {
    if (!instance) return;
    
    const protectCalendar = () => {
      // Find calendar container and mark as notranslate
      const calendar = instance.calendarContainer;
      if (calendar) {
        calendar.classList.add('notranslate');
        calendar.setAttribute('translate', 'no');
        // Protect all elements inside calendar
        const allElements = calendar.querySelectorAll('*');
        allElements.forEach(el => {
          el.classList.add('notranslate');
          el.setAttribute('translate', 'no');
          // Also set on font tags that Google Translate adds
          if (el.tagName === 'FONT') {
            el.setAttribute('translate', 'no');
          }
        });
        
        // Ensure year is visible using dedicated function
        ensureYearVisible(instance);
      }
    };
    
    // Protect immediately
    protectCalendar();
    
    // Protect on open (if handlers exist)
    if (instance._handlers && instance._handlers.open) {
      const originalOpen = instance._handlers.open;
      instance._handlers.open = originalOpen.map(handler => {
        return function(...args) {
          const result = handler.apply(this, args);
          setTimeout(protectCalendar, 10);
          return result;
        };
      });
      instance._handlers.open.push(protectCalendar);
    }
    
    // Use MutationObserver to continuously protect (throttled)
    let protectTimeout = null;
    const throttledProtect = () => {
      if (protectTimeout) clearTimeout(protectTimeout);
      protectTimeout = setTimeout(protectCalendar, 200);
    };
    
    const observer = new MutationObserver(throttledProtect);
    
    // Observe the calendar container when it exists
    if (instance.calendarContainer) {
      observer.observe(instance.calendarContainer, {
        childList: true,
        subtree: false, // Reduced scope
        attributes: false // Don't watch attributes to reduce calls
      });
    }
    
    // Also observe document for when calendar is created (throttled)
    let docObserverTimeout = null;
    const docObserver = new MutationObserver(() => {
      if (docObserverTimeout) clearTimeout(docObserverTimeout);
      docObserverTimeout = setTimeout(() => {
        if (instance.calendarContainer) {
          protectCalendar();
          observer.observe(instance.calendarContainer, {
            childList: true,
            subtree: false,
            attributes: false
          });
        }
      }, 500);
    });
    docObserver.observe(document.body, { childList: true, subtree: false }); // Reduced scope
    
    // Reduced interval frequency
    setInterval(protectCalendar, 2000); // Increased from 500ms to 2000ms
  }

  /* ==========================================================
     FLATPICKR LOCALE & PLACEHOLDER UPDATE FUNCTIONS
     - Updates calendar locale and placeholders when language changes
     - Debounced to prevent flickering
  ========================================================== */
  let updateTimeout = null;
  let isUpdating = false;
  // currentLocale is declared earlier in the script

  function updateFlatpickrLocale() {
    if (isUpdating) return;
    
    const lang = getCurrentLanguage();
    const newLocale = getFlatpickrLocale(); // null for English, locale object for others
    
    // Only update if locale actually changed
    if (currentLocale === lang) {
      // Double-check if locale is already set correctly
      if (startDateInstance && startDateInstance.config) {
        const currentConfigLocale = startDateInstance.config.locale;
        // For English, locale should be null/undefined
        if (lang === 'en') {
          if (!currentConfigLocale || currentConfigLocale === null) {
            return; // Already English, no change needed
          }
        } else {
          // For other languages, compare weekday arrays
          if (currentConfigLocale && newLocale && 
              currentConfigLocale.weekdays && newLocale.weekdays &&
              JSON.stringify(currentConfigLocale.weekdays.shorthand) === JSON.stringify(newLocale.weekdays.shorthand)) {
            return; // Same locale, no change needed
          }
        }
      }
    }
    
    currentLocale = lang;
    isUpdating = true;
    
    // Function to actually perform the update
    const performUpdate = () => {
      const actualLocale = getFlatpickrLocale(); // null for English
      
      if (startDateInstance) {
        const currentConfigLocale = startDateInstance.config ? startDateInstance.config.locale : null;
        // Check if update is needed
        let needsUpdate = false;
        if (lang === 'en') {
          // English: locale should be null/undefined
          needsUpdate = (currentConfigLocale !== null && currentConfigLocale !== undefined);
        } else {
          // Other languages: compare by weekday arrays
          if (!currentConfigLocale || !actualLocale) {
            needsUpdate = true;
          } else if (currentConfigLocale.weekdays && actualLocale.weekdays) {
            const currentWeekdays = JSON.stringify(currentConfigLocale.weekdays.shorthand);
            const newWeekdays = JSON.stringify(actualLocale.weekdays.shorthand);
            needsUpdate = (currentWeekdays !== newWeekdays);
          } else {
            needsUpdate = true;
          }
        }
        
        if (needsUpdate) {
          try {
            // Set locale (only set if not null, otherwise remove locale property)
            if (actualLocale !== null) {
              startDateInstance.set('locale', actualLocale);
            } else {
              // For English, remove locale to use default
              startDateInstance.set('locale', null);
            }
            // Force a complete redraw to ensure locale is applied
            // Redraw even if closed to ensure locale is set for next open
            requestAnimationFrame(() => {
              if (startDateInstance) {
                // Force update the calendar
                if (startDateInstance.calendarContainer) {
                  startDateInstance.redraw();
                  // Re-protect from translation after redraw (throttled)
                  setTimeout(() => protectFlatpickrFromTranslation(startDateInstance), 50);
                }
                // Also update config directly to ensure it sticks
                if (startDateInstance.config) {
                  if (actualLocale !== null) {
                    startDateInstance.config.locale = actualLocale;
                  } else {
                    delete startDateInstance.config.locale;
                  }
                }
              }
            });
          } catch (e) {
            console.warn('Error updating start date locale:', e);
          }
        }
      }
      
      if (endDateInstance) {
        const currentConfigLocale = endDateInstance.config ? endDateInstance.config.locale : null;
        // Check if update is needed
        let needsUpdate = false;
        if (lang === 'en') {
          // English: locale should be null/undefined
          needsUpdate = (currentConfigLocale !== null && currentConfigLocale !== undefined);
        } else {
          // Other languages: compare by weekday arrays
          if (!currentConfigLocale || !actualLocale) {
            needsUpdate = true;
          } else if (currentConfigLocale.weekdays && actualLocale.weekdays) {
            const currentWeekdays = JSON.stringify(currentConfigLocale.weekdays.shorthand);
            const newWeekdays = JSON.stringify(actualLocale.weekdays.shorthand);
            needsUpdate = (currentWeekdays !== newWeekdays);
          } else {
            needsUpdate = true;
          }
        }
        
        if (needsUpdate) {
          try {
            // Set locale (only set if not null, otherwise remove locale property)
            if (actualLocale !== null) {
              endDateInstance.set('locale', actualLocale);
            } else {
              // For English, remove locale to use default
              endDateInstance.set('locale', null);
            }
            // Force a complete redraw to ensure locale is applied
            // Redraw even if closed to ensure locale is set for next open
            requestAnimationFrame(() => {
              if (endDateInstance) {
                // Force update the calendar
                if (endDateInstance.calendarContainer) {
                  endDateInstance.redraw();
                  // Re-protect from translation after redraw
                  protectFlatpickrFromTranslation(endDateInstance);
                }
                // Also update config directly to ensure it sticks
                if (endDateInstance.config) {
                  if (actualLocale !== null) {
                    endDateInstance.config.locale = actualLocale;
                  } else {
                    delete endDateInstance.config.locale;
                  }
                }
              }
            });
          } catch (e) {
            console.warn('Error updating end date locale:', e);
          }
        }
      }
      
      isUpdating = false;
    };
    
    // Custom locales are always available, no need to wait
    performUpdate();
  }

  function updatePlaceholders() {
    if (isUpdating) return;
    isUpdating = true;
    
    const translations = getTranslatedPlaceholders();
    const startEl = document.getElementById("start-date");
    const endEl = document.getElementById("end-date");
    
    // Only update if input is empty
    if (startEl && !startEl.value) {
      const currentPlaceholder = startEl.getAttribute("placeholder");
      if (currentPlaceholder !== translations.start) {
        startEl.setAttribute("placeholder", translations.start);
        startEl.placeholder = translations.start;
        if (startDateInstance) {
          if (startDateInstance.config) {
            startDateInstance.config.placeholder = translations.start;
          }
          if (startDateInstance.input) {
            startDateInstance.input.setAttribute("placeholder", translations.start);
            startDateInstance.input.placeholder = translations.start;
          }
        }
      }
    }
    
    if (endEl && !endEl.value) {
      const currentPlaceholder = endEl.getAttribute("placeholder");
      if (currentPlaceholder !== translations.end) {
        endEl.setAttribute("placeholder", translations.end);
        endEl.placeholder = translations.end;
        if (endDateInstance) {
          if (endDateInstance.config) {
            endDateInstance.config.placeholder = translations.end;
          }
          if (endDateInstance.input) {
            endDateInstance.input.setAttribute("placeholder", translations.end);
            endDateInstance.input.placeholder = translations.end;
          }
        }
      }
    }
    
    isUpdating = false;
  }

  // Debounced update function to prevent flickering
  function debouncedUpdate() {
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }
    updateTimeout = setTimeout(() => {
      // Update placeholders first (faster)
      updatePlaceholders();
      // Then update locale (slower, needs to wait for locale files)
      updateFlatpickrLocale();
      updateTimeout = null;
    }, 150); // Increased debounce to 150ms to prevent flickering
  }

  /* ==========================================================
     PLACEHOLDER PERSISTENCE MONITOR
     - Continuously ensures placeholders stay visible
     - Prevents Flatpickr from removing them
     - Uses translated placeholders based on current language
     - Less aggressive to prevent flickering
  ========================================================== */
  function ensurePlaceholders() {
    // Skip if update is in progress to prevent conflicts
    if (isUpdating) return;
    
    const translations = getTranslatedPlaceholders();
    const startEl = document.getElementById("start-date");
    const endEl = document.getElementById("end-date");
    
    // Get all valid placeholder values for current language
    const validStartPlaceholders = Object.values(placeholderTranslations).map(t => t.start);
    const validEndPlaceholders = Object.values(placeholderTranslations).map(t => t.end);
    
    if (startEl && !startEl.value) {
      const currentPlaceholder = startEl.getAttribute("placeholder") || startEl.placeholder || "";
      // Only update if placeholder is missing or not a valid translated value
      if (!currentPlaceholder || !validStartPlaceholders.includes(currentPlaceholder)) {
        startEl.setAttribute("placeholder", translations.start);
        startEl.placeholder = translations.start;
        if (startDateInstance && startDateInstance.input) {
          startDateInstance.input.setAttribute("placeholder", translations.start);
          startDateInstance.input.placeholder = translations.start;
        }
      }
    }
    
    if (endEl && !endEl.value) {
      const currentPlaceholder = endEl.getAttribute("placeholder") || endEl.placeholder || "";
      // Only update if placeholder is missing or not a valid translated value
      if (!currentPlaceholder || !validEndPlaceholders.includes(currentPlaceholder)) {
        endEl.setAttribute("placeholder", translations.end);
        endEl.placeholder = translations.end;
        if (endDateInstance && endDateInstance.input) {
          endDateInstance.input.setAttribute("placeholder", translations.end);
          endDateInstance.input.placeholder = translations.end;
        }
      }
    }
  }

  // Monitor and restore placeholders periodically (throttled to prevent performance issues)
  let placeholderInterval = null;
  const throttledEnsurePlaceholders = () => {
    if (placeholderInterval) clearTimeout(placeholderInterval);
    placeholderInterval = setTimeout(ensurePlaceholders, 100);
  };
  setInterval(throttledEnsurePlaceholders, 1000); // Reduced frequency

  // Listen for language changes and update placeholders + calendar locale
  function setupPlaceholderTranslationListener() {
    // Monitor cookie changes for language switching (throttled to prevent performance issues)
    let lastLang = getCurrentLanguage();
    let langCheckTimeout = null;
    setInterval(() => {
      if (langCheckTimeout) return; // Skip if already checking
      langCheckTimeout = setTimeout(() => {
        const currentLang = getCurrentLanguage();
        if (currentLang !== lastLang) {
          lastLang = currentLang;
          currentLocale = null; // Reset locale cache to force update
          debouncedUpdate();
        }
        langCheckTimeout = null;
      }, 100);
    }, 1000); // Poll every 1000ms (reduced frequency)

    // Also listen for Google Translate events
    if (window.google && window.google.translate) {
      const originalTranslate = window.google.translate.TranslateService;
      if (originalTranslate && originalTranslate.getInstance) {
        const service = originalTranslate.getInstance();
        if (service) {
          const originalRestore = service.restore;
          if (originalRestore) {
            service.restore = function() {
              originalRestore.apply(this, arguments);
              // Use debounced update to prevent flickering
              debouncedUpdate();
            };
          }
        }
      }
    }

    // Listen for custom language change events
    document.addEventListener('languageChanged', updatePlaceholders);
    window.addEventListener('storage', function(e) {
      if (e.key === 'googtrans' || e.key === null) {
        // Use debounced update to prevent flickering
        debouncedUpdate();
      }
    });
  }

  // Initialize placeholder translation listener
  setupPlaceholderTranslationListener();
  
  // Expose functions globally so Google Translate script can call them
  // Use debounced versions to prevent flickering
  window.updateDatePlaceholders = debouncedUpdate;
  window.updateFlatpickrLocale = debouncedUpdate;

  /* ==========================================================
     3. ADD-TO-HOME-SCREEN (A2HS) BANNER
     - Displays to iOS & Android only
     - Dismiss state saved in localStorage
     - forceShow=false for production
  ========================================================== */
  setTimeout(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isiOS = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);
    if (!(isiOS || isAndroid)) return;

    const storageKey = "montateA2HS";
    const forceShow = false; // set true only when testing
    let hasSeen = false;

    try {
      hasSeen = localStorage.getItem(storageKey);
    } catch (e) {}

    if (hasSeen && !forceShow) return;

    // Banner element
    const wrap = document.createElement("div");
    wrap.id = "montate-a2hs";
    wrap.style.cssText = `
      position:fixed;bottom:20px;left:50%;transform:translateX(-50%);
      background:#fff;border-radius:16px;padding:18px 16px;text-align:center;
      width:90%;max-width:360px;box-shadow:0 8px 28px rgba(0,0,0,.15);
      font-family:Inter,sans-serif;z-index:9999;animation:montateSlide .35s ease-out;
    `;

    const icon = "https://cdn.prod.website-files.com/68cec10c0ce8479be5cf0065/69047714421aa78bd682be5e_montate-logo-mark-black-lime-rgb%201.png";
    const steps = isiOS
      ? `Tap the <img src="https://cdn.prod.website-files.com/68cec10c0ce8479be5cf0065/690477b4196479efa9817924_share.png" style="width:16px;vertical-align:middle;"> icon below → scroll and select <strong>Add to Home Screen</strong>.`
      : `Tap <strong>⋮ Menu</strong> → <strong>Add to Home Screen</strong>.`;

    wrap.innerHTML = `
      <img src="${icon}" alt="Montate" style="width:46px;margin-bottom:8px;animation:montatePulse 1s infinite alternate;">
      <h4 style="margin:0;font-size:16px;font-weight:600;color:#000;">Add Montate to Home Screen</h4>
      <p style="margin:6px 0 10px;font-size:13px;color:#444;">Access Montate quickly like an app.</p>
      <p style="margin:0;font-size:14px;">${steps}</p>
      <button id="montateGotIt"
        style="margin-top:12px;background:#C6FF00;color:#000;border:none;
        border-radius:8px;padding:8px 16px;font-size:14px;font-weight:500;">Got it</button>
    `;
    document.body.appendChild(wrap);

    // Dismiss and store
    document.getElementById("montateGotIt").addEventListener("click", () => {
      wrap.remove();
      try { localStorage.setItem(storageKey, "dismissed"); } catch (e) {}
    });

    // Inject animation styles once
    if (!document.getElementById("montate-style")) {
      const s = document.createElement("style");
      s.id = "montate-style";
      s.textContent = `
        @keyframes montateSlide { from {transform:translate(-50%,120%);opacity:0;} to {transform:translate(-50%,0);opacity:1;} }
        @keyframes montatePulse { from {transform:scale(1);} to {transform:scale(1.1);} }
      `;
      document.head.appendChild(s);
    }
  }, 4000);

});
</script>

