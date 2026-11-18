const C="salfa-v4",F=["./","index.html","manifest.json","icon-192.png","icon-512.png","apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const okUrl=u=>u.startsWith(self.location.origin)||u.startsWith("https://fonts.googleapis.com/")||u.startsWith("https://fonts.gstatic.com/");
// the app page: always the newest from the internet, the saved copy only when offline
// other files (icons, fonts): the saved copy first, refreshed in the background
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET"||!okUrl(r.url))return;
 const page=r.mode==="navigate"||/\/(index\.html)?(\?.*)?$/.test(new URL(r.url).pathname);
 if(page){e.respondWith(fetch(r,{cache:"no-store"}).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r,{ignoreSearch:true}).then(h=>h||caches.match("index.html"))));return}
 e.respondWith(caches.open(C).then(c=>c.match(r,{ignoreSearch:true}).then(hit=>{
  const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==="opaque"))c.put(r,res.clone());return res}).catch(()=>hit);
  return hit||net})))});
