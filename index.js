import{d as j,c as J,r as h,w as U,a as V,o as p,b as f,e as s,F as y,f as w,g as x,t as v,u as O,h as S,i as $,v as F,n as q,j as z,s as A,k as G,l as R,m as K,p as Q,q as T,x as D,y as I,z as W,A as X}from"./vendor.js";(function(){const d=document.createElement("link").relList;if(d&&d.supports&&d.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))l(n);new MutationObserver(n=>{for(const c of n)if(c.type==="childList")for(const i of c.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&l(i)}).observe(document,{childList:!0,subtree:!0});function o(n){const c={};return n.integrity&&(c.integrity=n.integrity),n.referrerPolicy&&(c.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?c.credentials="include":n.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function l(n){if(n.ep)return;n.ep=!0;const c=o(n);fetch(n.href,c)}})();function C(r,d){let o=!1;const l=r.replaceAll(/{[^{}]+?}/g,(n,c,i)=>{const g=n.slice(1,-1),m=d[g];return m===void 0&&(console.warn(`[renderTemplateString] ${n} is undefined`),o=!0),m});return{hasUndefined:o,value:l}}const b=r=>(D("data-v-9836fcf9"),r=r(),I(),r),Z={class:"main"},ee=["disabled"],te={key:0,class:"coord"},ne={class:"date"},se=b(()=>s("td",null,"timestamp",-1)),oe={class:"saved"},ae=b(()=>s("hr",null,null,-1)),re={key:0},le=["href"],ce={key:1,class:"saved-coord"},ie=b(()=>s("hr",null,null,-1)),ue={class:"entry"},de={class:"date"},pe={key:0,class:"out-link"},fe=["href"],_e=b(()=>s("hr",null,null,-1)),ve=j({__name:"Main",setup(r){const d=J("GPS_Points_DB","GPS_Points"),o=h(),l=h([]);async function n(){const e=await z(d);l.value=[];for(const a of e)l.value.push({timestamp:a[0],coords:a[1]});l.value=l.value.reverse()}n();async function c(){return new Promise((e,a)=>{navigator.geolocation.getCurrentPosition(t=>e(t),t=>a(t),{enableHighAccuracy:!0})})}function i(e){const a={};for(const t in e){if(E(e[t])){a[t]=i(e[t]);continue}a[t]=e[t]}return a}async function g(){try{o.value=await c(),m.value=!1}catch(e){alert(JSON.stringify(i(e),null,"  "))}}g();const m=h(!1);async function Y(){if(o.value)try{await A(o.value.timestamp,i(o.value.coords),d),l.value.unshift(i(o.value)),m.value=!0}catch(e){alert(JSON.stringify(i(e),null,"  "))}}function E(e){return typeof e=="object"&&!Array.isArray(e)&&e!==null}async function B(){const e=[...l.value];e.sort((t,u)=>t.timestamp-u.timestamp);const a=JSON.stringify(e);return console.log(a),a}async function L(){const e=await B(),a=G(R(new TextEncoder().encode(e)));if(!navigator.canShare){alert("Sharing is not supported"),console.log("pointsTextEnc"),console.log(a);return}const t={title:a};try{await navigator.share(t)}catch(u){alert(JSON.stringify(i(u),null,"  "))}}async function H(e){const a=new TextDecoder().decode(K(Q(e))),t=JSON.parse(a);console.log(t);for(const u of t)await A(u.timestamp,i(u.coords),d);await n()}globalThis.importPoints=H;const _=h(localStorage.getItem("gps-pattern-url")||"");U(_,e=>{localStorage.setItem("gps-pattern-url",e)});const P=h(!1),N=V(()=>{if(!o.value)return P.value=!1,"";const e=C(_.value,o.value.coords);return P.value=e.hasUndefined,e.value});return(e,a)=>(p(),f(y,null,[s("div",Z,[s("button",{onClick:g},"Update Point"),s("button",{onClick:Y,disabled:m.value},"Save Point",8,ee),s("button",{onClick:L},"Share"),o.value?(p(),f("table",te,[(p(!0),f(y,null,w(Object.entries(i(o.value.coords)).filter(([t,u])=>u),([t,u])=>(p(),f("tr",null,[s("td",null,v(t),1),x(": "),s("td",null,v(u),1)]))),256)),s("tr",ne,[se,x(": "),s("td",null,v(O(T)(o.value.timestamp,"YYYY.MM.DD HH:mm:SS",!1)),1)])])):S("",!0)]),s("div",oe,[ae,$(s("input",{type:"text","onUpdate:modelValue":a[0]||(a[0]=t=>_.value=t),name:"coord-pattern-url",spellcheck:"false",class:q({red:P.value})},null,2),[[F,_.value]]),_.value&&o.value?(p(),f("div",re,[s("a",{href:N.value,target:"_blank",rel:"noopener noreferrer"},v(N.value),9,le)])):S("",!0),l.value.length?(p(),f("div",ce,[ie,(p(!0),f(y,null,w(l.value,t=>(p(),f("div",ue,[s("div",de,v(O(T)(t.timestamp,"YYYY.MM.DD HH:mm:SS",!1)),1),(p(!0),f(y,null,w(Object.entries(t.coords).filter(([u,k])=>k),([u,k])=>(p(),f("div",null,[s("span",null,v(u),1),x(": "),s("span",null,v(k),1)]))),256)),_.value?(p(),f("div",pe,[s("a",{href:O(C)(_.value,t.coords).value,target:"_blank",rel:"noopener noreferrer"},"link",8,fe)])):S("",!0),_e]))),256))])):S("",!0)])],64))}});const M=(r,d)=>{const o=r.__vccOpts||r;for(const[l,n]of d)o[l]=n;return o},me=M(ve,[["__scopeId","data-v-9836fcf9"]]),he=r=>(D("data-v-2724c669"),r=r(),I(),r),ye=he(()=>s("a",{class:"readme",title:"Open Readme",href:"https://github.com/AlttiRi/gps-test",target:"_blank"},[s("i",null,"i")],-1)),ge=j({__name:"App",setup(r){return(d,o)=>(p(),f(y,null,[W(me),ye],64))}});const Se=M(ge,[["__scopeId","data-v-2724c669"]]);X(Se).mount("#app");
//# sourceMappingURL=index.js.map
