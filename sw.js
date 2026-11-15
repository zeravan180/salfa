const C="salfa-v3",F=["./","index.html","manifest.json","icon-192.png","icon-512.png","apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// show the saved copy at once, refresh it in the background when online
const okUrl=u=>u.startsWith(self.location.origin)||u.startsWith("https://fonts.googleapis.com/")||u.startsWith("https://fonts.gstatic.com/");
self.addEventListener("fetch",e=>{if(e.request.method!=="GET"||!okUrl(e.request.url))return;
 e.respondWith(caches.open(C).then(c=>c.match(e.request,{ignoreSearch:true}).then(hit=>{
  const net=fetch(e.request).then(r=>{if(r&&(r.ok||r.type==="opaque"))c.put(e.request,r.clone());return r}).catch(()=>hit);
  return hit||net})))});
