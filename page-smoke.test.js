const {JSDOM}=require('jsdom');const fs=require('fs');
const html=fs.readFileSync('new.html','utf8');
const errs=[];
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'http://localhost/',
 beforeParse(w){w.addEventListener('error',e=>errs.push(e.message));
  w.Element.prototype.getBoundingClientRect=function(){return {left:0,top:0,width:520,height:520,right:520,bottom:520};};
  w.HTMLElement.prototype.focus=function(){};}});
const w=dom.window,d=w.document;
function ev(type,x,y,id){const e=new w.Event(type,{bubbles:true,cancelable:true});e.clientX=x;e.clientY=y;e.pointerId=id||1;return e;}
function tap(x,y){const c=d.getElementById('canvas');c.dispatchEvent(ev('pointerdown',x,y));c.dispatchEvent(ev('pointerup',x,y));}
function drag(x1,y1,x2,y2){const c=d.getElementById('canvas');c.dispatchEvent(ev('pointerdown',x1,y1));c.dispatchEvent(ev('pointermove',x2,y2));c.dispatchEvent(ev('pointerup',x2,y2));}
d.getElementById('swCustom').click();
// view fit: scale ~0.97, offset; read transform to convert world->screen
function view(){const m=/translate\(([-\d.]+) ([-\d.]+)\) scale\(([-\d.]+)\)/.exec(d.getElementById('world').getAttribute('transform'));return {x:+m[1],y:+m[2],s:+m[3]};}
function S(wx,wy){const v=view();return [v.x+wx*v.s,v.y+wy*v.s];}
function tool(n){d.querySelector('[data-tool="'+n+'"]').click();}
tool('line');
[[60,40,340,40],[340,40,340,260],[340,260,60,260],[60,260,60,40]].forEach(l=>{const a=S(l[0],l[1]),b=S(l[2],l[3]);drag(a[0],a[1],b[0],b[1]);});
console.log('lines drawn:', d.querySelectorAll('#cLines line').length);
tool('suggest');
console.log('sugbar hidden:',d.getElementById('sugbar').hidden,'| msg:',d.getElementById('sugMsg').textContent);
const g=d.querySelector('#cSug g[data-ax]');console.log('prompt chip at',g.getAttribute('data-ax'),g.getAttribute('data-ay'),'text:',g.textContent);
// tap "Indoor" chip: local x -40, y 4 -> world
const v=view(),ax=+g.getAttribute('data-ax'),ay=+g.getAttribute('data-ay');
tap(v.x+ax*v.s-40,v.y+ay*v.s+4);
console.log('after Indoor tap:',d.getElementById('sugMsg').textContent);
console.log('ghosts:',d.querySelectorAll('#cSug circle').length,'| Place btn:',d.getElementById('sugPlace').textContent);
// mark the outside as outdoor: tap empty outside spot then Outdoor chip
let o=S(20,20);tap(o[0],o[1]);
console.log('pending msg:',d.getElementById('sugMsg').textContent);
let pg=[...d.querySelectorAll('#cSug g[data-ax]')].find(e=>/Mark this open/.test(e.textContent));
tap(v.x+(+pg.getAttribute('data-ax'))*v.s+40,v.y+(+pg.getAttribute('data-ay'))*v.s+4);
console.log('after outdoor mark:',d.getElementById('sugMsg').textContent);
console.log('ghosts:',d.querySelectorAll('#cSug circle').length,'| Place btn:',d.getElementById('sugPlace').textContent);
d.getElementById('sugPlace').click();
console.log('pins in #cPins circles:',d.querySelectorAll('#cPins circle').length);
d.getElementById('btnUndo').click();
console.log('after undo pins:',d.querySelectorAll('#cPins circle').length,'| zones persisted key:',JSON.parse(w.localStorage.getItem('flatCameraPlan.v1')||'{}').version);
console.log('errors:',errs);
setTimeout(()=>{const sv=JSON.parse(w.localStorage.getItem('flatCameraPlan.v1')||'{}');console.log('saved version',sv.version,'zones',JSON.stringify(sv.zones),'cams',(sv.cams||[]).length);},400);
