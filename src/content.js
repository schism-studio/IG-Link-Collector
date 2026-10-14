(() => {
  const key = 'ig_saved_link_collector_v1';
  const saved = new Set(JSON.parse(localStorage.getItem(key) || '[]'));
  const clean = href => {
    try {
      const u = new URL(href, location.origin);
      const p = u.pathname.split('/').filter(Boolean);
      if (['p','reel','tv'].includes(p[0]) && p[1])
        return `https://www.instagram.com/${p[0]}/${p[1]}/`;
    } catch {}
    return null;
  };
  const box = document.createElement('div');
  box.style.cssText = 'position:fixed;bottom:12px;right:12px;z-index:2147483647;background:#111;color:white;font:13px system-ui;padding:8px 10px;border-radius:8px;display:flex;gap:8px;align-items:center';
  box.innerHTML = '<span></span><button data-action="txt">TXT</button><button data-action="csv">CSV</button><button data-action="clear">Clear</button><button data-action="scroll">Auto-scroll</button>';
  document.body.appendChild(box);
  const show = () => { box.querySelector('span').textContent = `Saved: ${saved.size}`; };
  const scan = root => {
    const anchors = root.matches?.('a[href]') ? [root,...root.querySelectorAll('a[href]')] : root.querySelectorAll?.('a[href]') || [];
    let added = 0;
    for (const a of anchors) {
      const u = clean(a.href);
      if (u && !saved.has(u)) { saved.add(u); added++; }
    }
    if (added) { localStorage.setItem(key,JSON.stringify([...saved])); show(); }
  };
  scan(document.documentElement);
  const observer = new MutationObserver(records => {
    for (const r of records) for (const node of r.addedNodes)
      if (node.nodeType === Node.ELEMENT_NODE) scan(node);
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});
  const download = (name,text,type) => {
    const url = URL.createObjectURL(new Blob([text],{type}));
    const a = document.createElement('a');
    a.href=url; a.download=name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url),1000);
  };

  // Only schedule animation frames while auto-scroll is active.
  const SPEED = 500; // pixels per second
  let running = false, frame = null, previous = null, stalledSince = null;
  const scrollButton = box.querySelector('[data-action="scroll"]');
  const stop = () => {
    running = false;
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null; previous = null; stalledSince = null;
    scrollButton.textContent = 'Auto-scroll';
  };
  const step = timestamp => {
    if (!running) return;
    const elapsed = previous === null ? 0 : Math.min(timestamp - previous, 100);
    previous = timestamp;
    const before = window.scrollY;
    window.scrollBy({top: SPEED * elapsed / 1000, left: 0, behavior: 'instant'});
    if (elapsed > 0 && Math.abs(window.scrollY - before) < 0.5) {
      if (stalledSince === null) stalledSince = timestamp;
      if (timestamp - stalledSince >= 12000) { stop(); return; }
    } else stalledSince = null;
    frame = requestAnimationFrame(step);
  };
  box.addEventListener('click',e => {
    const action=e.target.dataset.action;
    if (action==='scroll') {
      if (running) stop();
      else { running=true; previous=null; stalledSince=null; scrollButton.textContent='Stop'; frame=requestAnimationFrame(step); }
      return;
    }
    if (action==='clear') {
      if (!confirm(`Clear all ${saved.size} collected links?`)) return;
      saved.clear(); localStorage.removeItem(key); show();
      return;
    }
    const links=[...saved].sort();
    if (action==='txt') download(`instagram-saved-links-${links.length}.txt`,links.join('\n')+'\n','text/plain;charset=utf-8');
    if (action==='csv') download(`instagram-saved-links-${links.length}.csv`,['number,url',...links.map((u,i)=>`${i+1},"${u}"`)].join('\n'),'text/csv;charset=utf-8');
  });
  document.addEventListener('visibilitychange',() => { if (document.hidden) stop(); });
  window.addEventListener('pagehide',stop);
  show();
})();
