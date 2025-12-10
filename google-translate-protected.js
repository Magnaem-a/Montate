<!-- 💙 MEMBERSCRIPT #153 (EN/IT/ES/FR)  -->
<script>
  const gtScript=document.createElement('script');
  gtScript.src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  gtScript.async=true;
  document.head.appendChild(gtScript);
  const style=document.createElement('style');
  style.innerHTML=`body{top:0!important;position:static!important}.goog-te-banner-frame,.skiptranslate,#goog-gt-tt,.goog-te-balloon-frame,.goog-text-highlight{display:none!important;background:none!important;box-shadow:none!important}.notranslate{translate:no!important}.notranslate *{translate:no!important}[data-ms-member].notranslate{box-sizing:border-box!important}[data-ms-member].notranslate:before,[data-ms-member].notranslate:after{display:none!important;content:none!important}`;
  document.head.appendChild(style);
  if(!document.getElementById('google_translate_element')){
    const d=document.createElement('div');
    d.id='google_translate_element';
    d.style.display='none';
    document.body.appendChild(d);
  }
  window.googleTranslateElementInit=function(){
    new google.translate.TranslateElement({pageLanguage:'en',layout:google.translate.TranslateElement.FloatPosition.TOP_LEFT},'google_translate_element');
  };

  const getCookie=n=>document.cookie.split(';').map(c=>c.trim().split('=')).reduce((a,[k,v])=>Object.assign(a,{[k]:decodeURIComponent(v||'')}),{})[n]||null;
  const setGT=v=>{
    const p="expires=Thu, 01 Jan 1970 00:00:01 GMT;",f="expires=Fri, 31 Dec 9999 23:59:59 GMT;";
    if(!v){ document.cookie="googtrans=;path=/;"+p; document.cookie="googtrans=;domain=.webflow.io;path=/;"+p; }
    else{ const e="googtrans="+encodeURIComponent(v)+";path=/;"+f; document.cookie=e; document.cookie="googtrans="+encodeURIComponent(v)+";domain=.webflow.io;path=/;"+f; }
  };
  const allowed=new Map([["en","English"],["it","Italian"],["es","Spanish"],["fr","French"]]);
  const badgeUpdate=code=>{
    const lc=allowed.has(code)?code:'en';
    const label=(lc.includes('-')?lc:lc.slice(0,2)).toUpperCase();
    const readable=allowed.get(lc)||lc;
    document.querySelectorAll('.material-icons.language .google-icons').forEach(b=>{
      b.textContent=label; b.setAttribute('data-lang',lc); b.title=readable; b.setAttribute('aria-label','Language: '+readable);
    });
  };
  const showLang=code=>{
    const lc=allowed.has(code)?code:'en';
    const name=(allowed.get(lc)||'English').toLowerCase();
    const cls=`.languagespecific.${name}specific`;
    document.querySelectorAll('.languagespecific').forEach(el=>el.style.display='none');
    (document.querySelectorAll(cls).length?document.querySelectorAll(cls):document.querySelectorAll('.languagespecific.englishspecific')).forEach(el=>el.style.display='block');
  };
  const fire=c=>{ c.dispatchEvent(new Event('input',{bubbles:true})); c.dispatchEvent(new Event('change',{bubbles:true})); };
  const preserveCase=(o,t)=>{
    if(!o||!t) return t;
    if(o[0]===o[0].toUpperCase()&&o[0]!==o[0].toLowerCase()) return t[0].toUpperCase()+t.slice(1).toLowerCase();
    return t.toLowerCase();
  };

  const storeOriginalTexts=()=>{
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{
      acceptNode:n=>{
        const p=n.parentElement;
        if(!p||p.closest('.notranslate')||p.closest('script')||p.closest('style')||p.closest('noscript')) return NodeFilter.FILTER_REJECT;
        if(!n.textContent.trim()||p.hasAttribute('data-ms-orig-case')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let node;
    while(node=walker.nextNode()){
      const parent=node.parentElement;
      if(parent&&!parent.hasAttribute('data-ms-orig-case')){
        parent.setAttribute('data-ms-orig-case',node.textContent);
      }
    }
  };
  const restoreTranslationCase=()=>{
    document.querySelectorAll('[data-ms-orig-case]').forEach(el=>{
      const original=el.getAttribute('data-ms-orig-case');
      const current=el.textContent;
      if(original&&current&&original!==current){
        const origWords=original.split(/\b/);
        const currWords=current.split(/\b/);
        if(origWords.length===currWords.length){
          const result=origWords.map((ow,i)=>ow.match(/\s/) ? ow : preserveCase(ow,currWords[i]||'')).join('');
          if(result&&result!==current) el.textContent=result;
        }
      }
    });
  };
  const customLangTranslations={
    es:new Map([['Scooter','Pasola'],['Scooters','Pasolas'],['First name','Nombre'],['Buggy','Buggy'],['ATV','Fourwheel'],['Make','Marca']]),
    fr:new Map([['ATV','Quad'],['ATVs','Quads'],['atv','Quad'],['atvs','Quads'],['ATV\'s','Quads'],['atv\'s','Quads']])
  };

  const applyCustomWordTranslations=lang=>{
  const customTranslations=customLangTranslations[lang];
  if(!customTranslations||customTranslations.size===0) {
      document.querySelectorAll('span[data-custom-trans="true"]').forEach(span=>{
        const o=span.getAttribute('data-original');
        if(o){ const t=document.createTextNode(o); span.parentNode.replaceChild(t,span); }
      });
      document.querySelectorAll('[data-custom-trans-applied]').forEach(el=>{
        if(!el.querySelector('span[data-custom-trans="true"]')) el.removeAttribute('data-custom-trans-applied');
      });
      return;
    }
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{
      acceptNode:n=>{
        const p=n.parentElement;
        if(!p||p.closest('.notranslate')||p.closest('script')||p.closest('style')||p.closest('noscript')||!n.textContent.trim()||p.hasAttribute('data-custom-trans-applied')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const textNodes=[]; let node;
    while(node=walker.nextNode()) textNodes.push(node);
    textNodes.forEach(textNode=>{
      const parent=textNode.parentElement;
      if(!parent) return;
      let text=textNode.textContent;
      const replacements=[];
      customTranslations.forEach((toWord,fromWord)=>{
        const regex=new RegExp(`\\b${fromWord.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\b`,'gi');
        let match;
        while((match=regex.exec(text))!==null){
          replacements.push({index:match.index,length:match[0].length,from:match[0],to:preserveCase(match[0],toWord)});
        }
      });
      if(replacements.length>0){
        const computed=getComputedStyle(parent);
        const layoutProps=['display','flex-direction','align-items','justify-content','flex-wrap','gap','flex','flex-grow','flex-shrink','flex-basis','align-self','order'];
        const originalStyles={};
        layoutProps.forEach(prop=>{
          const v=computed.getPropertyValue(prop);
          if(v&&v.trim()&&v!=='none'&&v!=='auto'&&v!=='normal') originalStyles[prop]=v.trim();
        });
        replacements.sort((a,b)=>b.index-a.index);
        const fragment=document.createDocumentFragment();
        let lastIndex=text.length;
        replacements.forEach(({index,length,from,to})=>{
          if(index+length<lastIndex){
            const after=text.substring(index+length,lastIndex);
            if(after) fragment.insertBefore(document.createTextNode(after),fragment.firstChild);
          }
          const span=document.createElement('span');
          span.className='notranslate';
          span.setAttribute('translate','no');
          span.setAttribute('data-custom-trans','true');
          span.setAttribute('data-original',from);
          span.style.display='inline';
          span.textContent=to;
          fragment.insertBefore(span,fragment.firstChild);
          lastIndex=index;
        });
        if(lastIndex>0){
          const before=text.substring(0,lastIndex);
          if(before) fragment.insertBefore(document.createTextNode(before),fragment.firstChild);
        }
        parent.replaceChild(fragment,textNode);
        parent.setAttribute('data-custom-trans-applied','true');
        if(Object.keys(originalStyles).length>0){
          const restore=()=>Object.keys(originalStyles).forEach(prop=>parent.style.setProperty(prop,originalStyles[prop],'important'));
          [0,10,50,100].forEach(d=>setTimeout(restore,d));
        }
      }
    });
  };

  let protectTimeout=null,lastProtectTime=0;
  const protect=()=>{
    const now=Date.now();
    if(now-lastProtectTime<500) return;
    lastProtectTime=now;
    if(protectTimeout) clearTimeout(protectTimeout);
    protectTimeout=setTimeout(()=>{
      document.querySelectorAll('.flatpickr-calendar, .flatpickr-weekday, .flatpickr-day, .flatpickr-month, .flatpickr-current-month').forEach(el=>{
        if(!el.classList.contains('notranslate')){
          el.classList.add('notranslate');
          el.setAttribute('translate','no');
          el.querySelectorAll('font').forEach(font=>{
            font.classList.add('notranslate');
            font.setAttribute('translate','no');
          });
        }
      });
      document.querySelectorAll('[data-ms-member]').forEach(el=>{
        if(el.getAttribute('data-ms-code')==='translate'||el.classList.contains('notranslate')) return;
        const computed=getComputedStyle(el);
        const layoutProps=['display','position','text-align','margin','padding'];
        const originalStyles={};
        layoutProps.forEach(prop=>{
          const v=computed.getPropertyValue(prop);
          if(v&&v.trim()&&v!=='none'&&v!=='auto') originalStyles[prop]=v.trim();
        });
        el.classList.add('notranslate');
        el.setAttribute('translate','no');
        const orig=el.getAttribute('data-ms-member');
        if(orig) el.setAttribute('data-ms-original-value',orig);
        if(Object.keys(originalStyles).length>0){
          el.setAttribute('data-ms-layout-styles',JSON.stringify(originalStyles));
          const restore=()=>{
            try{
              const s=el.getAttribute('data-ms-layout-styles');
              if(s){
                const styles=JSON.parse(s);
                Object.keys(styles).forEach(prop=>el.style.setProperty(prop,styles[prop],'important'));
              }
            }catch(e){}
          };
          [50,200,500].forEach(d=>setTimeout(restore,d));
          const watcher=new MutationObserver(restore);
          watcher.observe(el,{attributes:true,attributeFilter:['style']});
          setTimeout(()=>watcher.disconnect(),5000);
        }
        new MutationObserver(m=>m.forEach(n=>{
          if(n.type==='attributes'&&n.attributeName==='data-ms-member'&&el.getAttribute('data-ms-member')!==orig) el.setAttribute('data-ms-member',orig);
        })).observe(el,{attributes:true,attributeFilter:['data-ms-member']});
      });
      document.querySelectorAll('form,button[type="submit"],input[type="submit"]').forEach(el=>{
        if(!el.classList.contains('notranslate')){
          el.classList.add('notranslate');
          el.setAttribute('translate','no');
        }
      });
    },100);
  };

  function getCombo(maxWaitMs=4000){
    return new Promise(resolve=>{
      const existing=document.querySelector('.goog-te-combo');
      if(existing) return resolve(existing);
      const started=Date.now();
      const obs=new MutationObserver(()=>{
        const c=document.querySelector('.goog-te-combo');
        if(c){ obs.disconnect(); resolve(c); }
        else if(Date.now()-started>maxWaitMs){ obs.disconnect(); resolve(null); }
      });
      obs.observe(document.body,{childList:true,subtree:true});
      setTimeout(()=>{obs.disconnect(); resolve(document.querySelector('.goog-te-combo'));},maxWaitMs);
    });
  }
  const restoreEnglish=()=>{
    try{
      setGT(''); 
      location.hash='';
      const s=window.google?.translate?.TranslateService?.getInstance();
      if(s?.restore) {
        s.restore();
        setTimeout(()=>s.restore(),100);
        setTimeout(()=>s.restore(),300);
      }
      if(window.updateDatePlaceholders) window.updateDatePlaceholders();
      if(window.updateFlatpickrLocale) window.updateFlatpickrLocale();
    }catch(e){}
  };

  async function applyLang(code){
    const target=allowed.has(code)?code:'en';
    const currentLang=getCookie('googtrans')?.split('/').pop()||'en';
    if(target==='en'&&currentLang==='en') return;
    badgeUpdate(target); showLang(target); protect();
    if(target==='en'){ restoreEnglish(); }else{ storeOriginalTexts(); setGT(`/en/${target}`); location.hash=`#googtrans(en|${target})`; }
    if(window.updateDatePlaceholders) window.updateDatePlaceholders();
    const combo=await Promise.race([getCombo(2000),new Promise(r=>setTimeout(()=>r(null),2000))]);
    if(!combo){
      setTimeout(()=>{
        if(!document.querySelector('.goog-te-combo')) window.location.reload();
        else{ protect(); applyCustomWordTranslations(target); if(target!=='en') restoreTranslationCase(); }
        if(window.updateDatePlaceholders) window.updateDatePlaceholders();
      },100);
      return;
    }
    const trigger=()=>{ fire(combo); ['change','input','blur'].forEach(t=>combo.dispatchEvent(new Event(t,{bubbles:true,cancelable:true}))); };
    if(target==='en'){
      restoreEnglish();
      const hasBlank=[].some.call(combo.options,o=>o.value==='');
      combo.value=''; trigger();
      setTimeout(()=>{
        const currentLang=getCookie('googtrans')?.split('/').pop()||'en';
        if(currentLang!=='en'){
          combo.value=''; trigger(); restoreEnglish();
          setTimeout(()=>{
            if(getCookie('googtrans')?.split('/').pop()!=='en'){
              restoreEnglish();
              if(window.updateDatePlaceholders) window.updateDatePlaceholders();
              if(window.updateFlatpickrLocale) window.updateFlatpickrLocale();
            }
          },200);
        }
      },100);
    }else{
      if(combo.value===''||combo.value==='en'){ combo.value='en'; trigger(); setTimeout(()=>{ combo.value=target; trigger(); },50); }else{ combo.value=target; trigger(); }
    }
    let retryTimeout=null;
    const applyWithRetry=(attempt=0)=>{
      if(retryTimeout) clearTimeout(retryTimeout);
      if(attempt>3){
        const currentLang=getCookie('googtrans')?.split('/').pop()||'en';
        if(currentLang!==target){ 
          if(target==='en'){ restoreEnglish(); }else{ console.log('Translation not applied'); }
        }
        return;
      }
      protect(); 
      applyCustomWordTranslations(target);
      if(target!=='en') restoreTranslationCase();
      if(window.updateDatePlaceholders) window.updateDatePlaceholders();
      if(window.updateFlatpickrLocale) window.updateFlatpickrLocale();
      if(target==='en'){ 
        restoreEnglish(); 
        if(combo){ combo.value=''; trigger(); }
        setTimeout(()=>restoreEnglish(),100);
        setTimeout(()=>restoreEnglish(),300);
      }
      retryTimeout=setTimeout(()=>{
        const currentLang=getCookie('googtrans')?.split('/').pop()||'en';
        const comboValue=combo?.value||'';
        const expectedValue=target==='en'?'':target;
        if((currentLang!==target&&comboValue!==expectedValue)&&attempt<3){
          if(combo){ combo.value=target==='en'?'':target; if(target==='en') restoreEnglish(); trigger(); }
          applyWithRetry(attempt+1);
        }
      },300*(attempt+1));
    };
    setTimeout(()=>applyWithRetry(),200);
  }
  function setupLangButtons(){
    document.querySelectorAll('[data-ms-code-lang-select]:not([data-lang-handler-bound])').forEach(el=>{
      el.setAttribute('data-lang-handler-bound','true');
      const handler=e=>{
        e.preventDefault();
        e.stopPropagation();
        const code=el.getAttribute('data-ms-code-lang');
        if(code){ badgeUpdate(code); showLang(code); applyLang(code); }
        const dropdown=el.closest('.w-dropdown');
        if(dropdown){
          const toggle=dropdown.querySelector('.w-dropdown-toggle');
          if(toggle?.classList.contains('w--open')) setTimeout(()=>toggle.click(),100);
        }
      };
      el.addEventListener('click',handler,{passive:false});
      el.addEventListener('touchend',e=>{ e.preventDefault(); handler(e); },{passive:false});
    });
  }

  const init=()=>{
    protect();
    const cookie=getCookie('googtrans');
    let current='en';
    if(cookie){
      const lang=cookie.split('/').pop();
      if(allowed.has(lang)) current=lang; else{ setGT(''); location.hash=''; }
    }
    if(current==='en') restoreEnglish();
    badgeUpdate(current); showLang(current);
    if(current!=='en') storeOriginalTexts();
    setTimeout(()=>{applyCustomWordTranslations(current); if(current!=='en') restoreTranslationCase();},200);
    setupLangButtons();
    let langButtonsTimeout=null;
    const debouncedSetupLangButtons=()=>{
      if(langButtonsTimeout) clearTimeout(langButtonsTimeout);
      langButtonsTimeout=setTimeout(setupLangButtons,300);
    };
    [100,500].forEach(d=>setTimeout(debouncedSetupLangButtons,d));
    let langButtonsObserver=null;
    const setupLangButtonsObserver=()=>{
      if(langButtonsObserver) langButtonsObserver.disconnect();
      langButtonsObserver=new MutationObserver(debouncedSetupLangButtons);
      langButtonsObserver.observe(document.body,{childList:true,subtree:false});
    };
    setupLangButtonsObserver();
    getCombo().then(c=>{
      if(!c||c._msBound) return;
      c.addEventListener('change',()=>{
        const v=allowed.has(c.value)?c.value:'en';
        const currentLang=getCookie('googtrans')?.split('/').pop()||'en';
        if(v==='en'&&currentLang==='en') return;
        badgeUpdate(v); showLang(v);
        if(v==='en'){ restoreEnglish(); }else{ storeOriginalTexts(); setGT(`/en/${v}`); location.hash=`#googtrans(en|${v})`; }
        if(window.updateDatePlaceholders) window.updateDatePlaceholders();
        setTimeout(()=>{ protect(); applyCustomWordTranslations(v); if(v!=='en') restoreTranslationCase(); if(window.updateDatePlaceholders) window.updateDatePlaceholders(); },100);
      });
      c._msBound=true;
    });
    let caseRestoreTimeout=null;
    const debouncedCaseRestore=()=>{
      if(caseRestoreTimeout) clearTimeout(caseRestoreTimeout);
      caseRestoreTimeout=setTimeout(()=>{
        const lang=getCookie('googtrans')?.split('/').pop()||'en';
        if(lang!=='en') restoreTranslationCase();
      },500);
    };
    let customTransTimeout=null;
    const debouncedApplyCustomTrans=()=>{
      if(customTransTimeout) clearTimeout(customTransTimeout);
      customTransTimeout=setTimeout(()=>{
        const lang=getCookie('googtrans')?.split('/').pop()||'en';
        if(lang!=='en') applyCustomWordTranslations(lang);
      },300);
    };
    new MutationObserver(()=>{
      debouncedCaseRestore();
      debouncedApplyCustomTrans();
    }).observe(document.body,{childList:true,subtree:true,characterData:true});
    setInterval(()=>{ 
      protect(); 
      const lang=getCookie('googtrans')?.split('/').pop()||'en';
      if(lang!=='en') {
        restoreTranslationCase();
        applyCustomWordTranslations(lang);
      }
      if(window.updateDatePlaceholders) window.updateDatePlaceholders(); 
    },2000);
  };

  if(document.readyState==='complete'||document.readyState==='interactive') init();
  else document.addEventListener('DOMContentLoaded',init);
</script>
