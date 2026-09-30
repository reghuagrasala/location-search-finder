const categories = [
  ["✈️","Airport"],["🛩️","Amusement park"],["🐠","Aquarium"],["🎖️","Art gallery"],
  ["🏧","ATM"],["🥖","Bakery"],["🏦","Bank"],["🍺","Bar"],["💇","Beauty salon"],
  ["🚲","Bicycle store"],["📚","Book store"],["🎳","Bowling alley"],["🚗","Car dealer"],
  ["🚘","Car rental"],["🔧","Car repair"],["🚿","Car wash"],["🎰","Casino"],
  ["🏛️","Cemetery"],["⛪","Church"],["🏙️","City hall"],["👕","Clothing store"],
  ["🏢","Convenience store"],["👨‍⚕️","Doctor"],["💊","Drugstore"],["⚡","Electrician"],
  ["🛒","Electronics store"],["💍","Embassy"],["🚒","Fire station"],["🌸","Florist"],
  ["⚱️","Funeral home"],["🛋️","Furniture store"],["⛽","Gas station"],["🏥","Hospital"],
  ["🧾","Insurance agency"],["💎","Jewelry store"],["🧺","Laundry"],["⚖️","Lawyer"],
  ["📖","Library"],["🚉","Light rail station"],["🍷","Liquor store"],["🏛️","Local government office"],
  ["🔑","Locksmith"],["🍴","Meal delivery"],["🍱","Meal takeaway"],["🕌","Mosque"],
  ["🎭","Movie theater"],["🚚","Moving company"],["🏛️","Museum"],["🌙","Night club"],
  ["🎨","Painter"],["🌳","Park"],["🅿️","Parking"],["🔧","Plumber"],["🚓","Police"],
  ["📮","Post office"],["🏫","Primary school"],["🏠","Real estate agency"],["🍽️","Restaurant"],
  ["🏗️","Roofing contractor"],["🌲","RV park"],["🎓","School"],["🛍️","Shopping mall"],
  ["🛒","Supermarket"],["🛕","Synagogue"],["🚕","Taxi stand"],["🚆","Train station"],
  ["🚉","Transit station"],["🧳","Travel agency"],["🎓","University"],["🐾","Veterinary care"],
  ["🏛️","Zoo"]
];

const list = document.getElementById("categoryList");
const placeDisplay = document.getElementById("placeDisplay");
const placeEditor = document.getElementById("placeEditor");
const placeInput = document.getElementById("placeInput");
const poiInput = document.getElementById("poiInput");

let savedPlace = localStorage.getItem("lsf-place");
const savedGps = localStorage.getItem("lsf-gps");
let placeMode = savedPlace ? "custom" : (savedGps ? "gps" : "my");

function renderPlace(){
  if(placeMode === "custom"){
    placeDisplay.textContent = savedPlace || "Custom place";
  }else if(placeMode === "gps" && savedGps){
    placeDisplay.textContent = "GPS location";
  }else{
    placeDisplay.textContent = "My location";
  }
}
renderPlace();

categories.forEach(([icon,label])=>{
  const b=document.createElement("button");
  b.type="button";
  b.className="category";
  b.innerHTML=`<span class="icon">${icon}</span><span class="label">${label}</span>`;
  b.addEventListener("click",()=>searchMaps(label));
  list.appendChild(b);
});

document.getElementById("changePlace").addEventListener("click",()=>{
  placeEditor.hidden=!placeEditor.hidden;
  if(!placeEditor.hidden){
    placeInput.value=savedPlace || "";
    requestAnimationFrame(()=>placeInput.focus());
  }
});

document.getElementById("savePlace").addEventListener("click",savePlace);
placeInput.addEventListener("keydown",e=>{if(e.key==="Enter") savePlace();});

function savePlace(){
  const value=placeInput.value.trim();
  if(!value) return;
  localStorage.setItem("lsf-place",value);
  localStorage.removeItem("lsf-gps");
  savedPlace=value;
  placeMode="custom";
  renderPlace();
  placeEditor.hidden=true;
}

document.getElementById("clearPlace").addEventListener("click",()=>{
  localStorage.removeItem("lsf-place");
  localStorage.removeItem("lsf-gps");
  placeMode="my";
  renderPlace();
  placeEditor.hidden=true;
});

document.getElementById("useGps").addEventListener("click",()=>{
  if(!navigator.geolocation){
    alert("GPS is not available in this browser.");
    return;
  }
  navigator.geolocation.getCurrentPosition(pos=>{
    const value=`${pos.coords.latitude.toFixed(6)},${pos.coords.longitude.toFixed(6)}`;
    localStorage.setItem("lsf-gps",value);
    localStorage.removeItem("lsf-place");
    placeMode="gps";
    renderPlace();
    placeEditor.hidden=true;
  },()=>{
    alert("Could not read GPS location. You can enter a place manually.");
  },{enableHighAccuracy:true,timeout:10000,maximumAge:30000});
});

document.getElementById("poiSearch").addEventListener("click",()=>customSearch());
poiInput.addEventListener("keydown",e=>{if(e.key==="Enter") customSearch();});

function customSearch(){
  const q=poiInput.value.trim();
  if(q) searchMaps(q);
}

function searchMaps(term){
  let query=term;
  if(placeMode==="custom" && savedPlace){
    query=`${term} near ${savedPlace}`;
  }else if(placeMode==="gps" && savedGps){
    query=`${term} near ${savedGps}`;
  }else{
    query=`${term} near me`;
  }
  const url="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(query);
  window.location.href=url;
}

// iPhone/Safari: when returning from Google Maps, restore the app to its top.
function resetToTop(){
  requestAnimationFrame(()=>window.scrollTo(0,0));
}
window.addEventListener("pageshow",resetToTop);
window.addEventListener("focus",resetToTop);
document.addEventListener("visibilitychange",()=>{
  if(document.visibilityState==="visible") resetToTop();
});
document.getElementById("topBtn").addEventListener("click",resetToTop);

if("serviceWorker" in navigator){
  window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
}


// Keep pinch zoom disabled for this app while preserving normal one-finger vertical scrolling.
document.addEventListener("gesturestart", e => e.preventDefault(), {passive:false});
document.addEventListener("gesturechange", e => e.preventDefault(), {passive:false});
document.addEventListener("gestureend", e => e.preventDefault(), {passive:false});
document.addEventListener("touchmove", e => {
  if (e.touches.length > 1) e.preventDefault();
}, {passive:false});

// Offline status: the cached PWA remains available, while network-dependent
// Google Maps searches are clearly identified as unavailable.
const offlineNotice = document.getElementById("offlineNotice");
function updateNetworkStatus(){
  offlineNotice.hidden = navigator.onLine;
}
window.addEventListener("online", updateNetworkStatus);
window.addEventListener("offline", updateNetworkStatus);
updateNetworkStatus();
