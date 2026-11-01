/* Cart controls on index.html (+, trash, Clear cart) and the Back link on the 3D page.
   Needs jsdom: npm i jsdom. Run: node tests/cart-controls.test.js [path/to/index.html] */
const {JSDOM}=require('jsdom'),fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(process.argv[2]||path.join(root,'index.html'),'utf8');
const errs=[];let confirmAnswer=true,confirms=0;
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'http://localhost/',
  beforeParse(w){w.addEventListener('error',e=>errs.push(e.message));w.scrollTo=()=>{};w.Element.prototype.scrollIntoView=()=>{};
    w.confirm=()=>{confirms++;return confirmAnswer;};}});
const w=dom.window,d=w.document,$=id=>d.getElementById(id);
const click=el=>el.dispatchEvent(new w.Event('click',{bubbles:true,cancelable:true}));
const rows=()=>[...d.querySelectorAll('#cart .crow')];
const qty=r=>+r.querySelector('b').textContent;
const saved=()=>JSON.parse(w.localStorage.getItem('cameraPlanner.v3')).carts;
const addBtn=(box,id)=>d.querySelector('#'+box+' button[data-add="'+id+'"]');
const sys=v=>click(d.querySelector('.seg[data-k="sys"] button[data-v="'+v+'"]'));
let n=0;const ok=(name,f)=>{f();n++;console.log('ok  '+name);};

ok('empty cart: no Clear cart button',()=>{assert.strictEqual($('clearCart').hidden,true);assert.strictEqual(rows().length,0);});
click(addBtn('add','nv'));
ok('adding a camera shows -, +, trash and Clear cart',()=>{
  const r=rows()[0];assert.strictEqual(qty(r),1);
  ['dec','inc','del'].forEach(k=>assert(r.querySelector('[data-'+k+']'),k));
  assert.strictEqual($('clearCart').hidden,false);});
click(rows()[0].querySelector('[data-inc]'));
ok('+ increases the count and the saved cart',()=>{assert.strictEqual(qty(rows()[0]),2);assert.strictEqual(saved().dvr.nv,2);});
click(rows()[0].querySelector('[data-dec]'));
ok('- still removes one',()=>{assert.strictEqual(qty(rows()[0]),1);});
click(rows()[0].querySelector('[data-inc]'));click(rows()[0].querySelector('[data-inc]'));click(rows()[0].querySelector('[data-inc]'));
ok('+ stops at the DVR limit of 4 and says why',()=>{
  const p=rows()[0].querySelector('[data-inc]');assert.strictEqual(qty(rows()[0]),4);
  assert(p.disabled);assert(/Limit of 4/.test(p.title),p.title);
  click(p);assert.strictEqual(qty(rows()[0]),4);});
click(rows()[0].querySelector('[data-del]'));
ok('trash removes the whole entry (4 cameras at once)',()=>{assert.strictEqual(rows().length,0);assert.strictEqual(saved().dvr.nv,undefined);});
click(addBtn('add','nv'));click(addBtn('add','ir'));
ok('two different entries listed',()=>{assert.strictEqual(rows().length,2);});
const budget=$('budgetNum');budget.value='1';budget.dispatchEvent(new w.Event('input',{bubbles:true}));
ok('+ is disabled when it would exceed the budget',()=>{
  const p=rows()[0].querySelector('[data-inc]');assert(p.disabled);assert(/exceed budget/.test(p.title),p.title);});
budget.value='50000';budget.dispatchEvent(new w.Event('input',{bubbles:true}));
click(rows()[0].querySelector('[data-del]'));
ok('trash removes only its own row',()=>{assert.strictEqual(rows().length,1);});
click(addBtn('addW','do'));sys('nvr');click(addBtn('add','do'));
ok('Cart now spans WiFi and the NVR system',()=>{assert(saved().wl.do>=1&&saved().nvr.do>=1);});
sys('dvr');
confirmAnswer=false;click($('clearCart'));
ok('Clear cart: cancelling keeps everything',()=>{assert.strictEqual(confirms,1);assert(rows().length>=2);assert(saved().wl.do>=1);});
confirmAnswer=true;click($('clearCart'));
ok('Clear cart: confirming empties all three carts, including the hidden NVR cart',()=>{
  assert.strictEqual(rows().length,0);assert.strictEqual($('clearCart').hidden,true);
  const c=saved();assert.deepStrictEqual([Object.keys(c.dvr).length,Object.keys(c.nvr).length,Object.keys(c.wl).length],[0,0,0]);
  assert.strictEqual($('big').textContent,'₹0');});
ok('Clear cart keeps the budget and system',()=>{assert.strictEqual($('budgetNum').value,'50000');});
{const p=$('p_dvr_nv');p.value='0';p.dispatchEvent(new w.Event('input',{bubbles:true}));}
ok('a missing price gives a full, valid title (the quotes in the message no longer cut it off)',()=>{
  const t=addBtn('add','nv').title;assert.strictEqual(t,'Set a price in "Edit price list"');});
{const p=$('p_dvr_nv');p.value='2850';p.dispatchEvent(new w.Event('input',{bubbles:true}));}
click(addBtn('add','nv'));click(rows()[0].querySelector('[data-inc]'));
ok('keyboard focus stays on the + button after pressing it',()=>{assert.strictEqual(d.activeElement,rows()[0].querySelector('[data-inc]'));});
click(rows()[0].querySelector('[data-del]'));
ok('keyboard focus moves to the cart list after the trash button',()=>{assert.strictEqual(d.activeElement,$('cart'));});
ok('3D page start screen links back to the planner',()=>{
  const ar=new JSDOM(fs.readFileSync(path.join(root,'google-ar','wall-cameras-ar.html'),'utf8')).window.document;
  const a=ar.querySelector('#start a.back');assert(a);assert.strictEqual(a.getAttribute('href'),'../index.html');
  assert(fs.existsSync(path.join(root,'google-ar',a.getAttribute('href'))));});
console.log('errors:',errs);assert.strictEqual(errs.length,0);console.log(n+' checks passed');
