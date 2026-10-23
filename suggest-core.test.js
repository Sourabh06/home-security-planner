var assert=require('assert'),Sug=(function(){var h=require('fs').readFileSync(process.argv[2]||'flat_camera_coverage_floor_plan.html','utf8');var m=/\/\* SUG-CORE-START \*\/([\s\S]*?)\/\* SUG-CORE-END \*\//.exec(h);return new Function(m[1]+';return Sug;')();})();
function L(a,b,c,d){return {x1:a,y1:b,x2:c,y2:d};}
var rect=[L(60,40,340,40),L(340,40,340,250),L(340,250,60,250),L(60,250,60,40)];
var ok=0;function t(n,f){f();ok++;console.log('ok  '+n);}

t('closed rectangle: 1 enclosed area, outside is open',function(){
  var A=Sug.analyze(rect,[]);
  assert.strictEqual(A.areas.length,1);assert.strictEqual(A.unmarked,1);
  assert(A.lab.regions.some(function(r){return r.open;}));
});
t('prompt anchor is inside the room',function(){
  var a=Sug.analyze(rect,[]).areas[0];
  assert(a.x>60&&a.x<340&&a.y>40&&a.y<250,JSON.stringify(a));
});
t('doorway gap: no enclosed area, zone flagged open (leak)',function(){
  var g=[L(60,40,140,40),L(200,40,340,40)].concat(rect.slice(1));
  var A=Sug.analyze(g,[{x:200,y:150,t:'in'}]);
  assert.strictEqual(A.areas.length,0);assert.strictEqual(A.zoneInfo[0].open,true);
});
t('diamond (diagonal walls) does not leak',function(){
  var d=[L(200,100,300,200),L(300,200,200,300),L(200,300,100,200),L(100,200,200,100)];
  assert.strictEqual(Sug.analyze(d,[]).areas.length,1);
});
t('indoor zone: 4 inner-corner cameras, aimed inward',function(){
  var s=Sug.suggest(rect,[{x:200,y:150,t:'in'}]);
  assert.strictEqual(s.cams.length,4);
  s.cams.forEach(function(c){assert(c.x>60&&c.x<340&&c.y>40&&c.y<250,JSON.stringify(c));});
  var tl=s.cams.filter(function(c){return c.x<100&&c.y<100;})[0];assert.strictEqual(tl.a,45);
});
t('outdoor zone outside: 4 outer-corner cameras',function(){
  var s=Sug.suggest(rect,[{x:20,y:20,t:'out'}]);
  assert.strictEqual(s.cams.length,4);
  s.cams.forEach(function(c){assert(c.x<60||c.x>340||c.y<40||c.y>250);});
});
t('unmarked areas give no cameras',function(){
  var s=Sug.suggest(rect,[]);assert.strictEqual(s.cams.length,0);assert.strictEqual(s.unmarked,1);
});
t('T-junction: divider adds 2 corners per end (8 total, none at straight wall)',function(){
  var h=rect.concat([L(200,40,200,250)]);
  var s=Sug.suggest(h,[{x:130,y:150,t:'in'},{x:270,y:150,t:'in'}]);
  assert.strictEqual(s.cams.length,8);
});
t('crossing walls (X, no shared endpoint) produce corners',function(){
  var x=[L(100,200,300,200),L(200,100,200,300)];
  assert.strictEqual(Sug.corners(x).length,4);
});
t('cap limits indoor cameras',function(){
  var s=Sug.suggest(rect,[{x:200,y:150,t:'in'}],{cap:{in:2}});
  assert.strictEqual(s.cams.length,2);
});
t('stale zone (seed on a wall) is flagged',function(){
  var A=Sug.analyze(rect,[{x:60,y:100,t:'in'}]);assert.strictEqual(A.zoneInfo[0].stale,true);
});
t('tintPath is non-empty for the room',function(){
  var A=Sug.analyze(rect,[]);assert(Sug.tintPath(A.lab,A.areas[0].id).length>10);
});
// perf: 2000 grid-snapped random lines
var lines=[],i;for(i=0;i<2000;i++){var x=Math.floor(Math.random()*26)*20,y=Math.floor(Math.random()*26)*20;
  lines.push(Math.random()<.5?L(x,y,Math.min(520,x+20*(1+Math.floor(Math.random()*5))),y):L(x,y,x,Math.min(520,y+20*(1+Math.floor(Math.random()*5)))));}
var t0=Date.now();Sug.analyze(lines,[]);var t1=Date.now();Sug.corners(lines);var t2=Date.now();
console.log('perf 2000 lines (desktop node): analyze '+(t1-t0)+' ms, corners '+(t2-t1)+' ms');
console.log(ok+' tests passed');
