(function(){
  const initScript=()=>{
    if(!document.head||!document.body) return;
    const selectStyle=document.createElement('style');
    selectStyle.innerHTML=`/* Select input styling */.form_input.is-select-input{position:relative;width:100%;padding:1rem 2.5rem 1rem 1rem!important;appearance:none!important;-webkit-appearance:none!important;-moz-appearance:none!important;background-color:#fff;background-image:url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9l6 6 6-6' stroke='%23000000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 1rem center;background-size:16px;cursor:pointer;border-radius:10px}.form_input.is-select-input::-ms-expand{display:none}`;
    document.head.appendChild(selectStyle);
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
  };
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',initScript);
  }else{
    initScript();
  }
})();
window.googleTranslateElementInit=function(){
  new google.translate.TranslateElement({pageLanguage:'en',layout:google.translate.TranslateElement.FloatPosition.TOP_LEFT},'google_translate_element');
};
const getCookie=n=>document.cookie.split(';').map(c=>c.trim().split('=')).reduce((a,[k,v])=>Object.assign(a,{[k]:decodeURIComponent(v||'')}),{})[n]||null;
const setGT=v=>{
  const past="expires=Thu, 01 Jan 1970 00:00:01 GMT;",future="expires=Fri, 31 Dec 9999 23:59:59 GMT;";
  if(!v){ document.cookie="googtrans=;path=/;"+past; document.cookie="googtrans=;domain=.webflow.io;path=/;"+past; }
  else{ const e="googtrans="+encodeURIComponent(v)+";path=/;"+future; document.cookie=e; document.cookie="googtrans="+encodeURIComponent(v)+";domain=.webflow.io;path=/;"+future; }
};
const allowed=new Map([["en","English"],["it","Italian"],["es","Spanish"],["fr","French"]]);
const badgeUpdate=code=>{
  const lc=(allowed.has(code)?code:'en');
  const label=(lc.includes('-')?lc:lc.slice(0,2)).toUpperCase();
  const readable=allowed.get(lc)||lc;
  document.querySelectorAll('.material-icons.language .google-icons').forEach(b=>{
    b.textContent=label; b.setAttribute('data-lang',lc); b.title=readable; b.setAttribute('aria-label','Language: '+readable);
  });
};
const showLang=code=>{
  const lc=(allowed.has(code)?code:'en');
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
const customTranslations=new Map([['Scooter','Pasola'],['Scooters','Pasolas'],['First name','Nombre'],['Buggy','Buggy'],['ATV','Fourwheel'],['Make','Marca']]);
const applyCustomWordTranslations=lang=>{
  if(customTranslations.size===0||lang!=='es') {
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
    customTranslations.forEach((spanish,english)=>{
      const regex=new RegExp(`\\b${english.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\b`,'gi');
      let match;
      while((match=regex.exec(text))!==null){
        replacements.push({index:match.index,length:match[0].length,english:match[0],spanish:preserveCase(match[0],spanish)});
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
      replacements.forEach(({index,length,english,spanish})=>{
        if(index+length<lastIndex){
          const after=text.substring(index+length,lastIndex);
          if(after) fragment.insertBefore(document.createTextNode(after),fragment.firstChild);
        }
        const span=document.createElement('span');
        span.className='notranslate';
        span.setAttribute('translate','no');
        span.setAttribute('data-custom-trans','true');
        span.setAttribute('data-original',english);
        span.style.display='inline';
        span.textContent=spanish;
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
const protect=()=>{
  document.querySelectorAll('.flatpickr-calendar, .flatpickr-weekday, .flatpickr-day, .flatpickr-month, .flatpickr-current-month, .numInputWrapper, .cur-year, .flatpickr-current-month input, .flatpickr-current-month .numInputWrapper input').forEach(el=>{
    if(!el.classList.contains('notranslate')){
      el.classList.add('notranslate');
      el.setAttribute('translate','no');
      if(el.style) el.style.display='';
      el.querySelectorAll('font').forEach(font=>{
        font.classList.add('notranslate');
        font.setAttribute('translate','no');
        if(font.style) font.style.display='';
      });
    }
  });
  document.querySelectorAll('.flatpickr-current-month .numInputWrapper input.cur-year, .cur-year, input.cur-year, .numInput.cur-year').forEach(yearInput=>{
    if(!yearInput.classList.contains('notranslate')){
      yearInput.classList.add('notranslate');
      yearInput.setAttribute('translate','no');
      if(yearInput.style) {
        yearInput.style.setProperty('display','inline-block','important');
        yearInput.style.setProperty('visibility','visible','important');
        yearInput.style.setProperty('opacity','1','important');
        yearInput.style.setProperty('width','auto','important');
        yearInput.style.setProperty('min-width','70px','important');
        yearInput.style.setProperty('color','#111','important');
        yearInput.style.setProperty('-webkit-text-fill-color','#111','important');
        yearInput.style.setProperty('pointer-events','none','important');
        yearInput.style.setProperty('cursor','default','important');
        yearInput.style.setProperty('user-select','none','important');
        yearInput.style.setProperty('-webkit-user-select','none','important');
        yearInput.setAttribute('readonly','readonly');
        yearInput.setAttribute('tabindex','-1');
      }
    }
    if(!yearInput.value||yearInput.value===''||yearInput.value==='0'){
      const currentYear=new Date().getFullYear();
      yearInput.value=currentYear;
      yearInput.setAttribute('value',currentYear);
      yearInput.dispatchEvent(new Event('input',{bubbles:true}));
      yearInput.dispatchEvent(new Event('change',{bubbles:true}));
    }
    const parent=yearInput.closest('.numInputWrapper');
    if(parent&&!parent.classList.contains('notranslate')){
      parent.classList.add('notranslate');
      parent.setAttribute('translate','no');
      if(parent.style) {
        parent.style.setProperty('display','inline-block','important');
        parent.style.setProperty('visibility','visible','important');
        parent.style.setProperty('opacity','1','important');
        parent.style.setProperty('pointer-events','auto','important');
      }
      const arrows=parent.querySelectorAll('.arrowUp,.arrowDown');
      arrows.forEach(arrow=>{
        arrow.style.setProperty('display','block','important');
        arrow.style.setProperty('visibility','visible','important');
        arrow.style.setProperty('pointer-events','auto','important');
        arrow.style.setProperty('cursor','pointer','important');
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
async function applyLang(code){
  const target=allowed.has(code)?code:'en';
  const currentLang=getCookie('googtrans')?.split('/').pop()||'en';
  if(target==='en'&&currentLang==='en') return;
  badgeUpdate(target);
  showLang(target);
  protect();
  if(target!=='en') storeOriginalTexts();
  if(target==='en'){ 
    setGT(''); 
    location.hash='';
    const s=window.google?.translate?.TranslateService?.getInstance();
    if(s?.restore) {
      s.restore();
      setTimeout(()=>{if(s?.restore) s.restore();},100);
      setTimeout(()=>{if(s?.restore) s.restore();},300);
    }
    if(window.updateDatePlaceholders) window.updateDatePlaceholders();
    if(window.updateFlatpickrLocale) window.updateFlatpickrLocale();
  }else{ 
    setGT(`/en/${target}`); 
    location.hash=`#googtrans(en|${target})`; 
  }
  const combo=await Promise.race([getCombo(2000),new Promise(r=>setTimeout(()=>r(null),2000))]);
  if(!combo){
    setTimeout(()=>{
      if(!document.querySelector('.goog-te-combo')) window.location.reload();
      else{ protect(); applyCustomWordTranslations(target); if(target!=='en') restoreTranslationCase(); }
      if(window.updateDatePlaceholders) window.updateDatePlaceholders();
      if(window.updateFlatpickrLocale) window.updateFlatpickrLocale();
    },100);
    return;
  }
  const trigger=()=>{
    fire(combo);
    ['change','input','blur'].forEach(type=>combo.dispatchEvent(new Event(type,{bubbles:true,cancelable:true})));
  };
  if(target==='en'){
    const hasBlank=[].some.call(combo.options,o=>o.value==='');
    if(hasBlank){ 
      combo.value=''; 
      trigger(); 
      const s=window.google?.translate?.TranslateService?.getInstance();
      if(s?.restore) s.restore();
    }else{ 
      combo.value='en'; 
      trigger(); 
      setTimeout(()=>{ 
        combo.value=''; 
        trigger(); 
        const s=window.google?.translate?.TranslateService?.getInstance();
        if(s?.restore) s.restore();
      },50); 
    }
  }else{
    if(combo.value===''||combo.value==='en'){ 
      combo.value='en'; 
      trigger(); 
      setTimeout(()=>{ 
        combo.value=target; 
        trigger(); 
      },50); 
    }else{ 
      combo.value=target; 
      trigger(); 
    }
  }
  const applyWithRetry=(attempt=0)=>{
    if(attempt>5){
      const currentLang=getCookie('googtrans')?.split('/').pop()||'en';
      if(currentLang!==target){ console.log('Translation not applied, forcing page reload'); window.location.reload(); }
      return;
    }
    protect();
    applyCustomWordTranslations(target);
    if(target!=='en') restoreTranslationCase();
    if(window.updateDatePlaceholders) window.updateDatePlaceholders();
    if(window.updateFlatpickrLocale) window.updateFlatpickrLocale();
    setTimeout(()=>{
      const currentLang=getCookie('googtrans')?.split('/').pop()||'en';
      const comboValue=combo?.value||'';
      const expectedValue=target==='en'?'':target;
      if((currentLang!==target&&comboValue!==expectedValue)&&attempt<5){
        if(combo){ combo.value=target==='en'?'':target; trigger(); }
        applyWithRetry(attempt+1);
      }
    },150*(attempt+1));
  };
  setTimeout(()=>applyWithRetry(),100);
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
  const current=(allowed.has(getCookie('googtrans')?.split('/').pop())?getCookie('googtrans')?.split('/').pop():'en')||'en';
  badgeUpdate(current);
  showLang(current);
  if(current!=='en') storeOriginalTexts();
  setTimeout(()=>{applyCustomWordTranslations(current); if(current!=='en') restoreTranslationCase();},200);
  setupLangButtons();
  setTimeout(setupLangButtons,100);
  setTimeout(setupLangButtons,500);
  new MutationObserver(()=>setupLangButtons()).observe(document.body,{childList:true,subtree:true});
  getCombo().then(c=>{
    if(!c||c._msBound) return;
    c.addEventListener('change',()=>{
      const v=allowed.has(c.value)?c.value:'en';
      const currentLang=getCookie('googtrans')?.split('/').pop()||'en';
      if(v==='en'&&currentLang==='en') return;
      badgeUpdate(v); 
      showLang(v);
      if(v==='en'){ 
        setGT(''); 
        location.hash='';
        const s=window.google?.translate?.TranslateService?.getInstance();
        if(s?.restore) {
          s.restore();
          setTimeout(()=>{if(s?.restore) s.restore();},100);
          setTimeout(()=>{if(s?.restore) s.restore();},300);
        }
        if(window.updateDatePlaceholders) window.updateDatePlaceholders();
        if(window.updateFlatpickrLocale) window.updateFlatpickrLocale();
      }else{ 
        storeOriginalTexts(); 
        setGT(`/en/${v}`); 
        location.hash=`#googtrans(en|${v})`; 
      }
      setTimeout(()=>{
        protect(); 
        applyCustomWordTranslations(v); 
        if(v!=='en') restoreTranslationCase(); 
        if(window.updateDatePlaceholders) window.updateDatePlaceholders();
        if(window.updateFlatpickrLocale) window.updateFlatpickrLocale();
      },100);
    });
    c._msBound=true;
  });
  new MutationObserver(()=>{
    protect();
    const lang=getCookie('googtrans')?.split('/').pop()||'en';
    if(lang!=='en') restoreTranslationCase();
    if(window.updateDatePlaceholders) window.updateDatePlaceholders();
  }).observe(document.body,{childList:true,subtree:true,characterData:true});
  setInterval(()=>{
    protect();
    const lang=getCookie('googtrans')?.split('/').pop()||'en';
    if(lang!=='en') restoreTranslationCase();
    if(window.updateDatePlaceholders) window.updateDatePlaceholders();
  },1000);
};
function hideCustomFieldElements(){
  let msMem={};
  try{
    msMem=JSON.parse(localStorage.getItem('_ms-mem'))||{};
  }catch(e){
    msMem={};
  }
  const customFields=msMem.customFields||{};
  const elements=document.querySelectorAll('[ms-code-customfield]');
  elements.forEach(element=>{
    const attr=element.getAttribute('ms-code-customfield');
    if(!attr) return;
    if(attr.startsWith('!')){
      const key=attr.slice(1);
      if(customFields[key]) element.remove();
    }else{
      if(!customFields[attr]) element.remove();
    }
  });
}
if(document.readyState==='complete'||document.readyState==='interactive') init();
else document.addEventListener('DOMContentLoaded',init);
document.addEventListener('DOMContentLoaded',hideCustomFieldElements);
