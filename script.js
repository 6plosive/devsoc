function lerp(a,b,t){
  return Math.round(a + (b - a) * t);
}

function updateBackground(){
  const scrollTop = window.scrollY || window.pageYOffset;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const t = maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;
  
  // spread t across the color stops and interpolate between the two nearest colors
  const pos = t * (skyColors.length - 1);
  const i = Math.floor(pos);
  const j = Math.min(i + 1, skyColors.length - 1);
  const localT = pos - i;
  const start = skyColors[i];
  const end = skyColors[j];
  const r = lerp(start.r, end.r, localT);
  const g = lerp(start.g, end.g, localT);
  const b = lerp(start.b, end.b, localT);
  
  body.style.background = `rgb(${r}, ${g}, ${b})`;
  
  ticking = false;
}

function updateSky(){
  const clouds = document.querySelectorAll('.cloud');
  const scrollTop = window.scrollY || window.pageYOffset;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const t = maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;

  clouds.forEach(cloud => {
    const start = parseFloat(cloud.dataset.start);
    const end = parseFloat(cloud.dataset.end);
    const x = start + (end - start) * t;
    cloud.style.transform = `translate3d(${x}vw, 0, 0)`;
  });
  function easeInExpo(x) {
    return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
  }
  function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  }
  function easeInOutQuad(x) {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  }
  function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }
  function easeInQuart(x) {
    return x * x * x * x;
  }
  function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
  }
  function easeInOutQuart(x) {
    return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
  }

  // sun
  const sun = document.querySelector('.sun');
  if(sun){
    const start = 20;
    const end = -100;
    
    const y = start + (end - start) * easeInOutCubic(t);
    sun.style.top = `${y}%`;
  }

  // moon
  const moon = document.querySelector('.moon');
  if(moon){
    const start = 200;
    const end = 80;
    const y = start + (end - start) * easeInOutCubic(t);
    moon.style.top = `${y}%`;
  }
  ticking = false;
}

function updateCardScroll(){
  if(!card || !cardContent){
    return;
  }
  const scrollTop = window.scrollY || window.pageYOffset;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const t = maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;
  
  // Get active content section
  const activeSection = document.querySelector('.content-section.active');
  if(activeSection){
    const bottomNav = card.querySelector('.bottom-nav');
    // Calculate available height for content
    const availableHeight = cardContent.clientHeight;
    const maxContentScroll = Math.max(0, activeSection.scrollHeight - availableHeight);
    const offset = maxContentScroll * t;
    activeSection.style.transform = `translateY(${-offset}px)`;
  }
}

function updateTextColor(){
  if(!card){
    return;
  }

  // const textColors = [
  //   { r: 15,  g: 23,  b: 42 },   // #0f172a - dark slate (start)
  //   { r: 30,  g: 41,  b: 59 },   // #1e293b - slate
  //   { r: 71,  g: 85,  b: 105 },  // #475569 - medium slate
  //   { r: 148, g: 163, b: 184 },  // #94a3b8 - light slate
  //   { r: 226, g: 232, b: 240 },  // #e2e8f0 - very light
  //   { r: 248, g: 250, b: 252 }   // #f8fafc - near white (end)
  // ];
  const scrollTop = window.scrollY || window.pageYOffset;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const t = maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;
  
  const start = { r: 15,  g: 23,  b: 42 }; // #0f172a
  const end = { r: 226, g: 232, b: 240 }; // #e2e8f0
  // Only change color between 0.7 - 0.9
  const localT = (t - 0.7) / (0.9 - 0.7);
  const r = lerp(start.r, end.r, localT);
  const g = lerp(start.g, end.g, localT);
  const b = lerp(start.b, end.b, localT);
  
  const color = `rgb(${r}, ${g}, ${b})`;
  card.style.color = color;
  
  // Update SVG strokes
  const svgs = card.querySelectorAll('.home-social svg');
  svgs.forEach(svg => {
    svg.style.stroke = color;
  });
  
  // Update links
  const links = card.querySelectorAll('.nav-item, .home-social a, .post-card');
  links.forEach(link => {
    link.style.color = color;
  });

  // Update scroll tip
  if(scrollTip){
    scrollTip.style.color = color;
    const svg = scrollTip.querySelector('svg path');
    if(svg){
      svg.style.stroke = color;
    }
  }
}

function updateScrollTip(){
  if(!scrollTip){
    return;
  }
  const scrollTop = window.scrollY || window.pageYOffset;
  
  // Show tip only when at the top (scrolled less than 50px)
  if(scrollTop < 50){
    scrollTip.classList.add('visible');
  } else {
    scrollTip.classList.remove('visible');
  }
}

function onScroll(){
  if(!ticking){
    ticking = true;
    requestAnimationFrame(updateBackground);
    requestAnimationFrame(updateSky);
    requestAnimationFrame(updateCardScroll);
    requestAnimationFrame(updateTextColor);
    requestAnimationFrame(updateScrollTip);
  }
}

const skyColors = [
  { r: 116, g: 198, b: 229 },  // #74c6e5
  { r: 75,  g: 197, b: 255 },  // #4bc5ff
  { r: 48,  g: 87,  b: 195 },  // #3057c3
  { r: 49,  g: 36,  b: 201 },  // #3124c9
  { r: 11,  g: 1,   b: 77 },   // #0b014d
  { r: 3,   g: 1,   b: 28 }    // #03011c
];

const body = document.body;
const card = document.querySelector('.card');
const cardContent = document.querySelector('.card-content');
const scrollTip = document.querySelector('.scroll-tip');

let ticking = false;

window.addEventListener('scroll', onScroll);

updateBackground();
updateSky();
updateCardScroll();
updateTextColor();
updateScrollTip();

// Tab navigation
const navItems = document.querySelectorAll('.nav-item');
const contentSections = document.querySelectorAll('.content-section');

navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    
    const targetSection = item.getAttribute('data-section');
    
    navItems.forEach(nav => nav.classList.remove('active'));
    contentSections.forEach(section => section.classList.remove('active'));
    
    // Add active class to clicked nav item and corresponding section
    item.classList.add('active');
    document.getElementById(targetSection).classList.add('active');
    
    // Update scroll position for new active section
    updateCardScroll();
  });
});