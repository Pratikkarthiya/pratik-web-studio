const form=document.getElementById('enquiry'),dialog=document.getElementById('messageDialog'),prepared=document.getElementById('prepared');form.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form);prepared.value=`Hello Pratik, I would like to discuss a website.\n\nName: ${d.get('name')}\nBusiness: ${d.get('business')}\nService: ${d.get('service')}\nProject details: ${d.get('message')||'To be discussed'}`;document.getElementById('status').textContent='';const emailUrl='mailto:query@pratikwebstudio.com?subject='+encodeURIComponent('Website enquiry - '+d.get('business'))+'&body='+encodeURIComponent(prepared.value);document.getElementById('emailRetry').href=emailUrl;dialog.showModal();window.location.href=emailUrl});document.getElementById('close').onclick=()=>dialog.close();document.getElementById('copy').onclick=async()=>{try{await navigator.clipboard.writeText(prepared.value);document.getElementById('status').textContent='Message copied.'}catch{prepared.focus();prepared.select();document.getElementById('status').textContent='Select the message and copy it manually.'}};
const menuButton=document.getElementById('menuButton'),mobileNav=document.getElementById('mobileNav'),menuBackdrop=document.getElementById('menuBackdrop'),siteHeader=menuButton.closest('header');
function closeMenu(returnFocus=false){mobileNav.hidden=true;menuBackdrop.hidden=true;document.body.classList.remove('menu-open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open menu');if(returnFocus)menuButton.focus()}
function openMenu(){if(innerWidth>760)return;mobileNav.hidden=false;menuBackdrop.hidden=false;document.body.classList.add('menu-open');menuButton.setAttribute('aria-expanded','true');menuButton.setAttribute('aria-label','Close menu');mobileNav.querySelector('a')?.focus()}
menuButton.addEventListener('click',()=>{if(mobileNav.hidden)openMenu();else closeMenu(true)});
mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeMenu()));
menuBackdrop.addEventListener('click',()=>closeMenu(true));
document.addEventListener('pointerdown',e=>{if(!mobileNav.hidden&&!siteHeader.contains(e.target))closeMenu()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mobileNav.hidden){e.preventDefault();closeMenu(true)}});
siteHeader.addEventListener('focusout',e=>{if(!mobileNav.hidden&&e.relatedTarget&&!siteHeader.contains(e.relatedTarget))closeMenu()});
addEventListener('resize',()=>{if(innerWidth>760)closeMenu()},{passive:true});
addEventListener('hashchange',()=>closeMenu());
closeMenu();
let ticking=false;addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.progress').style.width=(max>0?scrollY/max*100:0)+'%';ticking=false});ticking=true}},{passive:true});

const packageDetails={Starter:'Starter package — ₹5,999, one-page static website',Business:'Business package — custom quotation, up to five pages',Premium:'Premium package — custom quotation, up to seven pages','Free offer':'Free first static website offer — please confirm eligibility and scope'};
function packageEnquiry(plan){return 'Hi Pratik, I’m interested in the '+packageDetails[plan]+'. Please share the next steps. I understand domain, hosting, and extras are separate.'}
document.querySelectorAll('[data-plan]').forEach(a=>{a.href='mailto:query@pratikwebstudio.com?subject='+encodeURIComponent(a.dataset.plan+' website enquiry')+'&body='+encodeURIComponent(packageEnquiry(a.dataset.plan))});
const motionMedia=matchMedia('(prefers-reduced-motion: reduce)'),motionButton=document.getElementById('motionToggle');
let motionAllowed=!motionMedia.matches,frameId=0,depthVisible=true,lastFrame=0;
const canvas=document.getElementById('depthBackdrop'),ctx=canvas.getContext('2d');let cw=0,ch=0;
const stars=Array.from({length:42},(_,i)=>({x:Math.sin(i*17.7)*650,y:Math.cos(i*9.2)*900,z:120+(i*43)%800}));
function sizeDepth(){cw=innerWidth;ch=innerHeight;const ratio=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(cw*ratio);canvas.height=Math.round(ch*ratio);ctx?.setTransform(ratio,0,0,ratio,0,0);paintDepth(0)}
function paintDepth(time){if(!ctx)return;ctx.clearRect(0,0,cw,ch);for(const p of stars){const angle=time*.000045,c=Math.cos(angle),sn=Math.sin(angle),x=p.x*c-p.z*sn,z=p.x*sn+p.z+1250,scale=600/Math.max(z,300),px=cw*.5+x*scale,py=ch*.5+p.y*scale;ctx.fillStyle='rgba(171,139,229,'+(0.12+scale*.3)+')';ctx.beginPath();ctx.arc(px,py,Math.max(.6,1.7*scale),0,Math.PI*2);ctx.fill()}}
function runDepth(time){frameId=0;if(!motionAllowed||innerWidth<=760||document.hidden||!depthVisible)return;if(time-lastFrame>32){paintDepth(time);lastFrame=time}frameId=requestAnimationFrame(runDepth)}
function startDepth(){if(motionAllowed&&innerWidth>760&&!document.hidden&&depthVisible&&!frameId)frameId=requestAnimationFrame(runDepth)}
function setMotion(enabled){motionAllowed=enabled;document.body.classList.toggle('no-motion',!enabled);motionButton.textContent=enabled?'Pause motion':'Enable motion';motionButton.setAttribute('aria-pressed',String(!enabled));if(!enabled){cancelAnimationFrame(frameId);frameId=0;document.querySelectorAll('[data-tilt]').forEach(el=>el.style.transform='');document.querySelector('.screen-stage').style.transform='';paintDepth(0)}else startDepth()}
motionButton.addEventListener('click',()=>setMotion(!motionAllowed));motionMedia.addEventListener('change',e=>setMotion(!e.matches));
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frameId);frameId=0}else startDepth()});
if('IntersectionObserver' in window){new IntersectionObserver(entries=>{depthVisible=entries[0].isIntersecting;document.body.classList.toggle('hero-out-of-view',!depthVisible);if(depthVisible)startDepth()}).observe(document.querySelector('.hero'))}
addEventListener('resize',()=>{sizeDepth();startDepth()},{passive:true});sizeDepth();setMotion(motionAllowed);
if(matchMedia('(pointer:fine) and (min-width: 761px)').matches){document.querySelectorAll('.card,.project,.portfolio-card,.price-card,.step,.portrait').forEach(el=>{el.dataset.tilt='';el.addEventListener('pointermove',e=>{if(!motionAllowed)return;const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(1000px) rotateX(${-y*9}deg) rotateY(${x*10}deg) translateY(-5px)`});el.addEventListener('pointerleave',()=>el.style.transform='')});const scene=document.querySelector('.scene'),stage=document.querySelector('.screen-stage');scene.addEventListener('pointermove',e=>{if(!motionAllowed)return;const r=scene.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;stage.style.transform=`rotateX(${10-y*10}deg) rotateY(${-17+x*14}deg) rotateZ(-5deg)`});scene.addEventListener('pointerleave',()=>stage.style.transform='')}

/* Reveal one section at a time without a continuous scroll animation loop. */
if('IntersectionObserver' in window){
 const revealTargets=[...document.querySelectorAll('.sectionhead,.card,.portfolio-card,.price-card,.step,.about,.contact,.faq')];
 const revealObserver=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target)}}},{threshold:0.06,rootMargin:'0px 0px 25px 0px'});
 for(const [index,target] of revealTargets.entries()){target.classList.add('reveal-item');target.style.setProperty('--reveal-delay',((index%3)*60)+'ms');revealObserver.observe(target)}
 document.body.classList.add('motion-ready');
}