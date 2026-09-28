/* Sardar Mohsin Mart — storefront logic (vanilla JS) */
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = n => 'Rs. ' + n.toLocaleString('en-US');
const CLOTH = ['S', 'M', 'L'], SHOE = [39, 40, 41, 42, 43, 44], FREE_ABOVE = 5000, FEE = 200;

/* ---------- PRODUCT DATA: add/edit rows here ----------
   [category, name, price, emoji, tint, rating, unit, description]
   Each product gets an `image` (generated artwork). To use real photos,
   set p.image = 'photos/rice.jpg' (or any URL) after the map below. */
const RAW = [
 ['Groceries','Basmati Rice',320,'🍚','#f3ead2',4.8,'1 kg','Premium long-grain aged basmati — fragrant, fluffy and perfect for biryani and pulao.'],
 ['Groceries','Super Rice',280,'🍚','#efe6cf',4.5,'1 kg','Everyday super rice for daily meals, clean and evenly polished.'],
 ['Groceries','Masoor Daal',360,'🫘','#f6d9b8',4.6,'1 kg','Quick-cooking split red lentils, rich in protein and flavour.'],
 ['Groceries','Moong Daal',390,'🫘','#f4efb5',4.7,'1 kg','Light, easy-to-digest yellow moong lentils for soups and daal.'],
 ['Groceries','Chana Daal',300,'🫘','#f1deb0',4.6,'1 kg','Golden split chickpeas — a kitchen staple for hearty daal and snacks.'],
 ['Groceries','Mash Daal',420,'🫘','#e8e6dc',4.4,'1 kg','Classic white mash daal, washed and cleaned for a creamy finish.'],
 ['Groceries','Sugar',180,'🍬','#f7f7f2',4.5,'1 kg','Fine white refined sugar for tea, desserts and daily use.'],
 ['Groceries','Cooking Oil',550,'🫒','#f5e7a3',4.7,'1 liter','Pure cooking oil, light on taste and ideal for frying and curries.'],
 ['Groceries','Tea',450,'🍵','#e7d3bd',4.9,'250 g','Strong, aromatic black tea leaves for the perfect doodh patti.'],
 ['Groceries','Salt',90,'🧂','#eef2f5',4.3,'1 kg','Iodized fine table salt, free-flowing and pure.'],
 ['Clothes',"Men's Casual T-Shirt",1499,'👕','#dcecf7',4.5,'Sizes S–L','Soft combed-cotton tee with a relaxed fit for everyday comfort.'],
 ['Clothes',"Men's Polo Shirt",1799,'👕','#dfeee2',4.6,'Sizes S–L','Smart polo with a breathable pique weave — casual yet sharp.'],
 ['Clothes',"Men's Shalwar Kameez",3499,'👘','#efe9dd',4.8,'Sizes S–L','Classic wash-and-wear shalwar kameez, tailored for all-day wear.'],
 ['Clothes',"Men's Casual Shirt",2199,'👔','#e4ebf6',4.5,'Sizes S–L','Crisp cotton casual shirt that goes from office to weekend.'],
 ['Clothes',"Women's Casual Suit",2999,'👗','#f7dfe8',4.6,'Sizes S–L','Comfortable printed lawn suit for everyday elegance.'],
 ['Clothes',"Women's Embroidered Suit",3999,'👗','#f4e3f7',4.9,'Sizes S–L','Beautifully embroidered suit, perfect for gatherings and festive days.'],
 ['Clothes',"Men's Hoodie",2499,'🧥','#dfe3ea',4.7,'Sizes S–L','Warm fleece hoodie with a kangaroo pocket and soft lining.'],
 ['Clothes','Cotton Trousers',1899,'👖','#e9e5da',4.4,'Sizes S–L','Versatile cotton trousers with a comfortable straight fit.'],
 ['Shoes',"Men's Casual Sneakers",3499,'👟','#e2eaf3',4.6,'Sizes 39–44','Lightweight everyday sneakers with cushioned soles.'],
 ['Shoes',"Men's Sports Shoes",4299,'👟','#f6e3d5',4.7,'Sizes 39–44','Sporty shoes built for grip, support and long days on your feet.'],
 ['Shoes',"Men's Formal Shoes",3999,'👞','#e6dccf',4.5,'Sizes 39–44','Polished formal shoes for the office, weddings and events.'],
 ['Shoes','Running Shoes',4499,'👟','#dcf1e6',4.8,'Sizes 39–44','Breathable, responsive running shoes for daily miles.'],
 ['Shoes','Casual Slip-On Shoes',2999,'🥿','#ebe4f3',4.4,'Sizes 39–44','Easy slip-on comfort for quick errands and relaxed days.'],
 ['Shoes',"Women's Casual Sneakers",3499,'👟','#f7e2ea',4.6,'Sizes 39–44','Stylish women\'s sneakers with a cushioned, flexible sole.']
];
// Generated product artwork (works offline). Swap for real photos anytime.
const art = p => 'data:image/svg+xml;utf8,' + encodeURIComponent(
 `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><radialGradient id="g" cx=".5" cy=".4" r=".85"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="${p.tint}"/></radialGradient></defs><rect width="400" height="400" fill="url(#g)"/><ellipse cx="200" cy="330" rx="110" ry="13" fill="#0002"/><text x="200" y="255" font-size="180" text-anchor="middle">${p.emoji}</text>${p.category==='Groceries'?`<rect x="140" y="292" width="120" height="30" rx="15" fill="#0b3d2b"/><text x="200" y="313" font-size="17" font-family="sans-serif" fill="#e8b931" text-anchor="middle">${p.unit}</text>`:''}</svg>`);
const PRODUCTS = RAW.map((r, i) => ({ id: i + 1, category: r[0], name: r[1], price: r[2], emoji: r[3], tint: r[4], rating: r[5], unit: r[6], description: r[7],
  sizes: r[0] === 'Clothes' ? CLOTH : [], shoeSizes: r[0] === 'Shoes' ? SHOE : [] }));
PRODUCTS.forEach(p => p.image = art(p));
const byId = id => PRODUCTS.find(p => p.id === id);
const needs = p => p.sizes.length ? p.sizes : p.shoeSizes;
const what = p => p.category === 'Shoes' ? 'shoe number' : 'size';

/* ---------- STATE ---------- */
const state = { cat: 'All', q: '', sort: 'popular' }, sel = {}, qty = {};
let cart = [];
try { cart = (JSON.parse(localStorage.getItem('smm-cart')) || []).filter(i => byId(i.id)); } catch (e) { cart = []; }
const save = () => { try { localStorage.setItem('smm-cart', JSON.stringify(cart)); } catch (e) {} };
let tt; const toast = m => { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2200); };

/* ---------- PRODUCT RENDERING ---------- */
const buyBox = p => {
  const o = needs(p);
  return `${o.length ? `<div class="sizes" role="group" aria-label="Select ${what(p)}">${o.map(s => `<button type="button" class="sz${sel[p.id] == s ? ' on' : ''}" data-act="size" data-id="${p.id}" data-v="${s}" aria-pressed="${sel[p.id] == s}">${s}</button>`).join('')}</div>` : ''}
  <div class="buy"><div class="qty"><button data-act="dec" data-id="${p.id}" aria-label="Decrease quantity">−</button><span data-qv="${p.id}">${qty[p.id] || 1}</span><button data-act="inc" data-id="${p.id}" aria-label="Increase quantity">+</button></div>
  <button class="btn" data-act="add" data-id="${p.id}">Add to Cart</button></div>`;
};
const card = (p, i) => `<article class="card" style="--d:${Math.min(i, 12) * 40}ms"><button class="cimg" data-act="open" data-id="${p.id}" aria-label="View details of ${p.name}"><img src="${p.image}" alt="${p.name} — ${p.category}" width="400" height="400" loading="lazy"></button>
  <div class="cb"><span class="tag">${p.category}</span><h3>${p.name}</h3><div class="meta"><span class="rate">★ ${p.rating}</span><span>${p.unit}</span></div><p class="price">${money(p.price)}</p>${buyBox(p)}</div></article>`;
const SORTS = { popular: (a, b) => b.rating - a.rating || a.id - b.id, low: (a, b) => a.price - b.price, high: (a, b) => b.price - a.price, newest: (a, b) => b.id - a.id };

function render() {
  const q = state.q.trim().toLowerCase();
  const list = PRODUCTS.filter(p => (state.cat === 'All' || p.category === state.cat) && (!q || [p.name, p.category, p.description, p.unit].join(' ').toLowerCase().includes(q))).sort(SORTS[state.sort]);
  $('#grid').innerHTML = list.map(card).join('');
  $('#none').hidden = list.length > 0;
  $('#count').textContent = `${list.length} product${list.length === 1 ? '' : 's'}`;
  $$('.chip').forEach(c => c.classList.toggle('on', c.dataset.cat === state.cat));
}

/* ---------- CART ---------- */
function totals() { const sub = cart.reduce((a, i) => a + byId(i.id).price * i.qty, 0); const fee = !sub ? 0 : sub > FREE_ABOVE ? 0 : FEE; return { sub, fee, total: sub + fee }; }
function renderCart() {
  const { sub, fee, total } = totals();
  $('#cartCount').textContent = cart.reduce((a, i) => a + i.qty, 0);
  $('#cartItems').innerHTML = cart.length ? cart.map((i, k) => { const p = byId(i.id); return `<li class="ci"><img src="${p.image}" alt="${p.name}"><div><h4>${p.name}</h4><small>${i.size ? (p.category === 'Shoes' ? 'Shoe size: ' : 'Size: ') + i.size : p.unit}</small><b>${money(p.price * i.qty)}</b><div class="qty"><button data-act="cdec" data-k="${k}" aria-label="Decrease quantity">−</button><span>${i.qty}</span><button data-act="cinc" data-k="${k}" aria-label="Increase quantity">+</button></div></div><button class="rm" data-act="crm" data-k="${k}" aria-label="Remove ${p.name}">✕</button></li>`; }).join('') : '<li class="empty">Your cart is empty.<br>Add something tasty or stylish!</li>';
  $('#sub').textContent = money(sub);
  $('#fee').textContent = !sub ? '—' : fee ? money(fee) : 'Free Delivery';
  $('#tot').textContent = money(total);
  $('#ship').textContent = !sub ? 'Free delivery on orders above Rs. 5,000' : fee ? `Add ${money(FREE_ABOVE - sub + 1)} more for free delivery` : '🎉 Free Delivery unlocked!';
  $('#checkoutBtn').disabled = !cart.length;
}
function addToCart(id) {
  const p = byId(id), s = sel[id] ? String(sel[id]) : '', n = qty[id] || 1, it = cart.find(i => i.id === id && i.size === s);
  it ? it.qty = Math.min(20, it.qty + n) : cart.push({ id, size: s, qty: n });
  save(); renderCart(); const c = $('#cartCount'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
  toast(`${p.name} added to cart`);
}

/* ---------- LAYERS (cart drawer, modals) ---------- */
function openLayer(sel_) { closeAll(); const l = $(sel_); l.classList.add('open'); l.setAttribute('aria-hidden', 'false'); $('#ov').classList.add('open'); document.body.classList.add('lock'); const f = $('button,input', l); f && f.focus({ preventScroll: true }); }
function closeAll() { $$('.layer.open').forEach(l => { l.classList.remove('open'); l.setAttribute('aria-hidden', 'true'); }); $('#ov').classList.remove('open'); document.body.classList.remove('lock'); }
function openProduct(id) {
  const p = byId(id);
  $('#pmBody').innerHTML = `<div class="pmg"><img src="${p.image}" alt="${p.name} — ${p.category}"><div><span class="tag">${p.category}</span><h2>${p.name}</h2><span class="rate">★ ${p.rating} / 5</span><p class="price">${money(p.price)}</p><p>${p.description}</p>${needs(p).length ? `<strong>Select ${what(p) === 'size' ? 'Size' : 'Shoe Size'}:</strong>` : ''}${buyBox(p)}</div></div>`;
  openLayer('#pm');
}
function openCheckout() {
  if (!cart.length) return;
  const t = totals(); $('#coSum').textContent = `${cart.reduce((a, i) => a + i.qty, 0)} items • ${t.fee ? 'Delivery ' + money(t.fee) : 'Free Delivery'} • Total ${money(t.total)}`;
  $('#coBody').hidden = false; $('#ok').hidden = true; $('#coForm').reset(); $$('[data-err]').forEach(e => e.textContent = ''); openLayer('#co');
}

/* ---------- EVENTS ---------- */
document.addEventListener('click', e => {
  const cat = e.target.closest('[data-cat]');
  if (cat) { state.cat = cat.dataset.cat; render(); $('#nav').classList.remove('open'); $('#burger').setAttribute('aria-expanded', 'false'); }
  const soon = e.target.closest('[data-soon]'); if (soon) toast(soon.dataset.soon);
  if (e.target.closest('#nav a')) { $('#nav').classList.remove('open'); $('#burger').setAttribute('aria-expanded', 'false'); }
  const b = e.target.closest('[data-act]'); if (!b) return;
  const a = b.dataset.act, id = +b.dataset.id, k = +b.dataset.k;
  if (a === 'size') { sel[id] = b.dataset.v; $$(`[data-act=size][data-id="${id}"]`).forEach(x => { const on = x.dataset.v === b.dataset.v; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); }); }
  else if (a === 'inc' || a === 'dec') { qty[id] = Math.max(1, Math.min(20, (qty[id] || 1) + (a === 'inc' ? 1 : -1))); $$(`[data-qv="${id}"]`).forEach(x => x.textContent = qty[id]); }
  else if (a === 'add') {
    const p = byId(id);
    if (needs(p).length && !sel[id]) { toast(`Please select a ${what(p)} first`); $$(`[data-act=size][data-id="${id}"]`).forEach(x => { const g = x.parentElement; g.classList.remove('shake'); void g.offsetWidth; g.classList.add('shake'); }); return; }
    addToCart(id);
  }
  else if (a === 'open') openProduct(id);
  else if (a === 'cinc') { cart[k].qty = Math.min(20, cart[k].qty + 1); save(); renderCart(); }
  else if (a === 'cdec') { cart[k].qty = Math.max(1, cart[k].qty - 1); save(); renderCart(); }
  else if (a === 'crm') { cart.splice(k, 1); save(); renderCart(); }
  else if (a === 'checkout') openCheckout();
  else if (a === 'close') closeAll();
});
$('#ov').addEventListener('click', closeAll);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
$('#cartBtn').addEventListener('click', () => openLayer('#cart'));
$('#burger').addEventListener('click', () => { const o = $('#nav').classList.toggle('open'); $('#burger').setAttribute('aria-expanded', o); });
$('#search').addEventListener('input', e => { state.q = e.target.value; render(); if (state.q && scrollY < $('#shop').offsetTop - 200) $('#shop').scrollIntoView({ behavior: 'smooth' }); });
$('#sort').addEventListener('change', e => { state.sort = e.target.value; render(); });

// Checkout validation + order confirmation
$('#coForm').addEventListener('submit', e => {
  e.preventDefault(); const f = e.target, v = n => f.elements[n].value.trim(); let ok = true;
  const chk = (n, good, msg) => { $(`[data-err="${n}"]`).textContent = good ? '' : msg; f.elements[n].classList.toggle('bad', !good); if (!good) ok = false; };
  chk('name', v('name').length >= 3, 'Please enter your full name.');
  chk('phone', /^\+?[\d\s-]{10,15}$/.test(v('phone')), 'Enter a valid phone number.');
  chk('address', v('address').length >= 8, 'Please enter your full address.');
  chk('city', v('city').length >= 2, 'Please enter your city.');
  if (!ok) return;
  const t = totals(), no = 'SMM-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 90 + 10);
  cart = []; save(); renderCart();
  $('#coBody').hidden = true; $('#ok').hidden = false; $('#orderNo').textContent = no; $('#okTotal').textContent = money(t.total);
});

// Sticky header shadow + scroll reveal
addEventListener('scroll', () => $('#top').classList.toggle('sc', scrollY > 10), { passive: true });
const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { threshold: .12 }) : null;
$$('.rv').forEach(el => io ? io.observe(el) : el.classList.add('in'));

render(); renderCart();
