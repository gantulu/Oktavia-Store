
// --- CONFIGURATION ---
const API_CONFIG = {
    banners: "https://opensheet.elk.sh/1pztiIdabsxJ_NyIuaHFFio0ppS1pTP9Fy8Hnxi5Rjws/Sheet1",
    products: "https://opensheet.elk.sh/1x2Rtyeyq3WR6yFybA8stGP0mdI2dlKvBz6fhx7FIjhQ/Sheet1"
};

// --- STATE MANAGEMENT ---
let state = {
    activeTab: 'home',
    banners: [],
    bannerIndex: 0,
    allProducts: [],
    currentUser: JSON.parse(localStorage.getItem('istore_user')) || null,
    activeCategory: 'All',
    cart: []
};

// --- INITIALIZATION ---
async function init() {
    renderApp();
    await Promise.all([fetchBanners(), fetchProducts()]);
    startBannerTimer();
}

async function fetchBanners() {
    try {
        const res = await fetch(API_CONFIG.banners);
        state.banners = await res.json();
        if (state.activeTab === 'home') renderHome();
    } catch (e) { console.error("Banner fetch failed", e); }
}

async function fetchProducts() {
    try {
        const res = await fetch(API_CONFIG.products);
        state.allProducts = await res.json();
        if (state.activeTab === 'home') renderHome();
        if (state.activeTab === 'catalog') renderCatalog();
    } catch (e) { console.error("Product fetch failed", e); }
}

function switchTab(tab) {
    state.activeTab = tab;
    // Update Nav UI
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');
    renderApp();
}

function renderApp() {
    const main = document.getElementById('main-content');
    main.scrollTo(0, 0);

    if (state.activeTab === 'home') renderHome();
    else if (state.activeTab === 'catalog') renderCatalog();
    else if (state.activeTab === 'profile') renderProfile();
}

// --- HOME RENDERER ---
function renderHome() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div id="banner-section" class="px-4 mt-4 h-48 relative overflow-hidden rounded-3xl">
            ${renderBannerSlides()}
        </div>

        <div class="grid grid-cols-5 gap-2 px-4 mt-8">
            ${renderQuickActions()}
        </div>

        <div class="mt-10">
            <div class="px-4 flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                    <h2 class="text-lg font-extrabold text-gray-900">Flash Sale</h2>
                    <div class="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-lg shadow-red-200">02 : 45 : 12</div>
                </div>
                <button class="text-blue-600 text-xs font-bold">Lihat Semua</button>
            </div>
            <div class="flex gap-4 overflow-x-auto px-4 pb-4 hide-scrollbar">
                ${renderFlashSale()}
            </div>
        </div>

        <div class="mt-8 px-4 pb-10">
            <h2 class="text-lg font-extrabold text-gray-900 mb-4">Popular Produk</h2>
            <div class="grid grid-cols-2 gap-4">
                ${renderProductGrid(state.allProducts.slice(0, 8))}
            </div>
        </div>
    `;
}

function renderBannerSlides() {
    if (!state.banners.length) return `<div class="w-full h-full bg-gray-100 animate-pulse rounded-3xl"></div>`;
    return state.banners.map((b, i) => `
        <div class="banner-slide absolute inset-0 w-full h-full p-6 flex flex-col justify-between transition-opacity duration-700 ${i === state.bannerIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}" 
             style="background-color: ${b.backgroundColor || '#000'}; color: ${b.textColor || '#fff'}">
            <div class="flex justify-between items-start">
                <div class="max-w-[70%]">
                    <h3 class="text-xl font-black leading-tight">${b.title}</h3>
                    <p class="text-[10px] font-medium opacity-80 mt-1">${b.subtitle}</p>
                </div>
                <div class="w-12 h-12 opacity-40">${b.icon || '<i class="fab fa-apple text-4xl"></i>'}</div>
            </div>
            ${b.tombol_ambil === 'TRUE' ? `
                <div class="flex items-center justify-between">
                    <div class="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
                        <span class="text-[10px] font-mono font-black">${b.kode_voucher}</span>
                    </div>
                    <button class="bg-white text-black text-[9px] font-black px-5 py-2.5 rounded-full uppercase tracking-tighter shadow-xl">Ambil Voucher</button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

function renderQuickActions() {
    const actions = [
        { t: "iPhone", i: "fa-mobile-alt" },
        { t: "iWatch", i: "fa-stopwatch" },
        { t: "iMac", i: "fa-desktop" },
        { t: "iPad", i: "fa-tablet-alt" },
        { t: "AirPods", i: "fa-headphones" }
    ];
    return actions.map(a => `
        <div class="flex flex-col items-center gap-2 cursor-pointer active:scale-90 transition">
            <div class="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-800">
                <i class="fas ${a.i} text-lg"></i>
            </div>
            <span class="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">${a.t}</span>
        </div>
    `).join('');
}

function renderFlashSale() {
    const fs = state.allProducts.filter(p => p.event_tag === 'flashsale').slice(0, 6);
    if (!fs.length) return `<div class="text-xs text-gray-400">Memuat flash sale...</div>`;
    return fs.map(p => `
        <div onclick="openProductDetail('${p.item_group_id}')" class="flex-shrink-0 w-32 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm active:scale-95 transition">
            <div class="bg-gray-50 aspect-square p-4">
                <img src="${p.image_link}" class="w-full h-full object-contain">
            </div>
            <div class="p-3">
                <p class="text-[10px] font-bold text-gray-800 line-clamp-1">${p.title}</p>
                <p class="text-red-500 font-black text-xs mt-1">${formatIDR(p.sale_price || p.price)}</p>
                <div class="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div class="h-full bg-red-500 w-[80%]"></div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderProductGrid(items) {
    if (!items.length) return `<div class="col-span-2 text-center py-20 text-gray-300">Produk tidak ditemukan</div>`;
    return items.map(p => `
        <div onclick="openProductDetail('${p.item_group_id}')" class="bg-white rounded-3xl border border-gray-100 overflow-hidden flex flex-col group active:scale-[0.98] transition">
            <div class="bg-gray-50 aspect-square p-6 relative">
                <img src="${p.image_link}" class="w-full h-full object-contain group-hover:scale-105 transition-transform">
                ${p.discount_percentage > 0 ? `<span class="absolute top-3 left-3 bg-red-500 text-white text-[9px] font-black px-2 py-1 rounded-full shadow-lg">-${p.discount_percentage}%</span>` : ''}
            </div>
            <div class="p-4 flex-1 flex flex-col">
                <p class="text-[11px] font-semibold text-gray-900 line-clamp-2 mb-2 leading-snug">${p.title}</p>
                <div class="mt-auto">
                    <p class="font-black text-sm text-black">${formatIDR(p.sale_price || p.price)}</p>
                    <div class="flex items-center gap-2 mt-2 pt-2 border-t border-gray-50">
                        <i class="fas fa-star text-yellow-400 text-[10px]"></i>
                        <span class="text-[10px] text-gray-400 font-bold">${(p.rating/100).toFixed(1)} | Terjual ${p.sold}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// --- CATALOG RENDERER ---
function renderCatalog() {
    const main = document.getElementById('main-content');
    const categories = ['All', ...new Set(state.allProducts.map(p => p.category_name).filter(Boolean))];
    const filtered = state.activeCategory === 'All' ? state.allProducts : state.allProducts.filter(p => p.category_name === state.activeCategory);

    main.innerHTML = `
        <div class="p-5 bg-white sticky top-0 z-30 border-b border-gray-100">
            <h2 class="text-xl font-black mb-4">Catalog Produk</h2>
            <div class="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                ${categories.map(c => `
                    <button onclick="setCategory('${c}')" class="px-5 py-2.5 rounded-full text-xs font-black whitespace-nowrap transition ${state.activeCategory === c ? 'bg-black text-white shadow-xl shadow-black/20' : 'bg-gray-100 text-gray-400'}">
                        ${c}
                    </button>
                `).join('')}
            </div>
        </div>
        <div class="grid grid-cols-2 gap-4 p-4 pb-10">
            ${renderProductGrid(filtered)}
        </div>
    `;
}

function setCategory(cat) {
    state.activeCategory = cat;
    renderCatalog();
}

// --- PROFILE & AUTH RENDERER ---
function renderProfile() {
    const main = document.getElementById('main-content');
    if (!state.currentUser) {
        main.innerHTML = renderAuthForm();
    } else {
        main.innerHTML = `
            <div class="p-8 bg-white border-b border-gray-100 flex flex-col items-center">
                <div class="relative mb-4">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${state.currentUser.phone}" class="w-24 h-24 rounded-full bg-blue-50 border-4 border-white shadow-2xl">
                    <div class="absolute bottom-0 right-0 w-7 h-7 bg-green-500 border-4 border-white rounded-full"></div>
                </div>
                <h2 class="text-xl font-black text-gray-900">${state.currentUser.name}</h2>
                <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">${state.currentUser.phone}</p>
            </div>
            
            <div class="p-4 space-y-4">
                <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-sm font-black text-gray-900 uppercase">Status Pesanan</h3>
                        <i class="fas fa-chevron-right text-[10px] text-gray-300"></i>
                    </div>
                    <div class="flex justify-between px-2">
                        ${[
                            { l: 'Bayar', i: 'fa-wallet', c: 'blue' },
                            { l: 'Kemas', i: 'fa-box', c: 'orange' },
                            { l: 'Kirim', i: 'fa-truck', c: 'green' },
                            { l: 'Ulas', i: 'fa-star', c: 'yellow' }
                        ].map(s => `
                            <div class="flex flex-col items-center gap-2">
                                <div class="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                                    <i class="fas ${s.i}"></i>
                                </div>
                                <span class="text-[9px] font-black text-gray-400 uppercase">${s.l}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="bg-white rounded-3xl overflow-hidden border border-gray-100">
                    ${[
                        { l: 'Wishlist Saya', i: 'fa-heart', t: 'red' },
                        { l: 'Voucher Saya', i: 'fa-ticket-alt', t: 'blue' },
                        { l: 'Alamat Pengiriman', i: 'fa-map-marker-alt', t: 'green' },
                        { l: 'Pusat Bantuan', i: 'fa-headset', t: 'gray' }
                    ].map(m => `
                        <div class="p-5 flex items-center gap-4 border-b border-gray-50 active:bg-gray-50 cursor-pointer">
                            <div class="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-700">
                                <i class="fas ${m.i} text-xs"></i>
                            </div>
                            <span class="text-sm font-bold text-gray-800">${m.l}</span>
                            <i class="fas fa-chevron-right ml-auto text-gray-300 text-[10px]"></i>
                        </div>
                    `).join('')}
                </div>

                <button onclick="logout()" class="w-full py-5 bg-white text-red-500 font-black rounded-3xl border border-gray-100 shadow-sm active:bg-red-50 transition">
                    Keluar Sesi
                </button>
            </div>
        `;
    }
}

function renderAuthForm(isRegister = false) {
    return `
        <div class="min-h-[70vh] flex flex-col items-center justify-center p-8">
            <div class="w-20 h-20 bg-black rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
                <i class="fab fa-apple text-white text-4xl"></i>
            </div>
            <h2 class="text-2xl font-black mb-2">${isRegister ? 'Daftar iStore' : 'Selamat Datang'}</h2>
            <p class="text-gray-400 text-xs font-bold text-center mb-10 tracking-wide uppercase">Premium Apple Experience</p>
            
            <div id="auth-error" class="hidden w-full p-4 bg-red-50 text-red-500 text-[11px] font-bold rounded-2xl mb-6 text-center border border-red-100"></div>

            <form onsubmit="handleAuth(event, ${isRegister})" class="w-full space-y-4">
                ${isRegister ? `<div class="relative"><input type="text" id="auth-name" placeholder="Nama Lengkap" class="w-full p-5 bg-gray-50 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-black outline-none border border-transparent transition" required></div>` : ''}
                <div class="relative"><input type="tel" id="auth-phone" placeholder="Nomor Telepon" class="w-full p-5 bg-gray-50 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-black outline-none border border-transparent transition" required></div>
                <div class="relative"><input type="password" id="auth-pass" placeholder="Password" class="w-full p-5 bg-gray-50 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-black outline-none border border-transparent transition" required></div>
                <button class="w-full py-5 bg-black text-white font-black rounded-2xl shadow-2xl shadow-black/30 mt-6 active:scale-95 transition">
                    ${isRegister ? 'Buat Akun' : 'Masuk'}
                </button>
            </form>

            <button onclick="toggleAuth(${!isRegister})" class="mt-8 text-sm font-bold text-gray-400">
                ${isRegister ? 'Sudah punya akun? <span class="text-black font-black">Masuk</span>' : 'Belum punya akun? <span class="text-black font-black">Daftar</span>'}
            </button>
        </div>
    `;
}

function toggleAuth(isRegister) {
    document.getElementById('main-content').innerHTML = renderAuthForm(isRegister);
}

function handleAuth(e, isRegister) {
    e.preventDefault();
    const phone = document.getElementById('auth-phone').value;
    const pass = document.getElementById('auth-pass').value;
    const errorEl = document.getElementById('auth-error');
    
    let users = JSON.parse(localStorage.getItem('istore_users') || '[]');

    if (isRegister) {
        const name = document.getElementById('auth-name').value;
        if (users.find(u => u.phone === phone)) {
            showError("Nomor telepon sudah terdaftar");
            return;
        }
        const newUser = { name, phone, pass };
        users.push(newUser);
        localStorage.setItem('istore_users', JSON.stringify(users));
        loginUser(newUser);
    } else {
        const user = users.find(u => u.phone === phone && u.pass === pass);
        if (user) {
            loginUser(user);
        } else {
            showError("Nomor ponsel atau password yang anda masukkan salah");
        }
    }
}

function showError(msg) {
    const el = document.getElementById('auth-error');
    el.innerText = msg;
    el.classList.remove('hidden');
}

function loginUser(user) {
    state.currentUser = user;
    localStorage.setItem('istore_user', JSON.stringify(user));
    renderApp();
}

function logout() {
    localStorage.removeItem('istore_user');
    state.currentUser = null;
    renderApp();
}

// --- PRODUCT DETAIL DRAWER ---
function openProductDetail(groupId) {
    const groupItems = state.allProducts.filter(p => p.item_group_id === groupId);
    if (!groupItems.length) return;

    const currentItem = groupItems[0];
    const drawer = document.getElementById('product-drawer');
    const inner = document.getElementById('drawer-inner');

    // Extract variants
    const colors = [...new Set(groupItems.map(p => p.title.split(' - ')[1]?.split(',')[0]))].filter(Boolean);
    const storages = [...new Set(groupItems.map(p => p.title.split(', ')[1]))].filter(Boolean);

    inner.innerHTML = `
        <div class="sticky top-0 bg-white/80 backdrop-blur-xl p-4 flex items-center justify-between z-10 border-b border-gray-50">
            <button onclick="closeDrawer()" class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 active:scale-90 transition">
                <i class="fas fa-chevron-down"></i>
            </button>
            <span class="text-xs font-black uppercase tracking-widest text-gray-400">Detail Produk</span>
            <button class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-500">
                <i class="fas fa-share-alt"></i>
            </button>
        </div>

        <div class="px-6 pb-40">
            <div id="detail-image-container" class="bg-gray-50 rounded-[40px] aspect-square p-10 flex items-center justify-center my-6 relative overflow-hidden">
                <img id="detail-image" src="${currentItem.image_link}" class="w-full h-full object-contain drop-shadow-2xl">
            </div>

            <h2 id="detail-title" class="text-2xl font-black text-gray-900 leading-tight mb-3">${currentItem.title}</h2>
            
            <div class="flex items-center gap-3 mb-8">
                <span class="bg-blue-600 text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-blue-200">OFFICIAL STORE</span>
                <div class="flex items-center text-yellow-400 text-xs font-black">
                    <i class="fas fa-star mr-1.5"></i>
                    <span>${(currentItem.rating/100).toFixed(1)}</span>
                    <span class="text-gray-300 ml-2 font-bold">(${currentItem.sold} terjual)</span>
                </div>
            </div>

            <div class="p-6 bg-gray-50 rounded-[32px] border border-gray-100 mb-8">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Harga Special</p>
                <div class="flex items-baseline gap-3">
                    <span id="detail-price" class="text-3xl font-black text-black">${formatIDR(currentItem.sale_price || currentItem.price)}</span>
                    ${currentItem.discount_percentage > 0 ? `<span class="text-sm text-gray-300 line-through font-bold">${formatIDR(currentItem.price)}</span>` : ''}
                </div>
            </div>

            ${colors.length ? `
                <div class="mb-8">
                    <h4 class="text-sm font-black text-gray-900 mb-4 uppercase">Pilih Warna</h4>
                    <div class="flex flex-wrap gap-3">
                        ${colors.map(c => `
                            <button onclick="updateVariant('${groupId}', '${c}', null)" class="variant-btn-color px-5 py-3 rounded-2xl border-2 font-black text-xs transition-all ${currentItem.title.includes(c) ? 'border-black bg-black text-white shadow-xl shadow-black/20' : 'border-gray-100 bg-white text-gray-400'}">
                                ${c}
                            </button>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            ${storages.length ? `
                <div class="mb-8">
                    <h4 class="text-sm font-black text-gray-900 mb-4 uppercase">Kapasitas</h4>
                    <div class="flex flex-wrap gap-3">
                        ${storages.map(s => `
                            <button onclick="updateVariant('${groupId}', null, '${s}')" class="variant-btn-storage px-6 py-4 rounded-2xl border-2 font-black text-xs transition-all ${currentItem.title.includes(s) ? 'border-black bg-black text-white shadow-xl shadow-black/20' : 'border-gray-100 bg-white text-gray-400'}">
                                ${s}
                            </button>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <div class="mb-10">
                <h4 class="text-sm font-black text-gray-900 mb-4 uppercase">Tentang Produk</h4>
                <p class="text-sm text-gray-500 leading-relaxed font-medium">
                    Nikmati integrasi sempurna dan performa hardware terbaik dari Apple. Produk ini dijamin 100% Orisinal dengan garansi resmi. Desain elegan berpadu dengan teknologi tercanggih masa kini.
                </p>
            </div>
        </div>

        <div class="fixed bottom-0 inset-x-0 max-w-[500px] mx-auto p-5 bg-white/80 backdrop-blur-2xl border-t border-gray-100 flex gap-4 z-50">
            <button class="w-16 h-16 rounded-3xl border-2 border-gray-100 flex items-center justify-center text-gray-300 active:bg-gray-50 transition">
                <i class="far fa-heart text-2xl"></i>
            </button>
            <button onclick="addToCart()" class="flex-1 h-16 bg-black text-white rounded-3xl font-black active:scale-95 transition shadow-2xl shadow-black/30 flex items-center justify-center gap-3">
                <i class="fas fa-shopping-bag"></i>
                Tambah ke Keranjang
            </button>
        </div>
    `;

    drawer.classList.remove('hidden');
    setTimeout(() => inner.classList.add('open'), 10);
    document.body.style.overflow = 'hidden';
}

function updateVariant(groupId, color, storage) {
    const groupItems = state.allProducts.filter(p => p.item_group_id === groupId);
    const activeBtn = document.querySelector('.variant-btn-color.bg-black, .variant-btn-storage.bg-black');
    
    // Logic to find matching product based on existing selection and new selection
    const currentTitle = document.getElementById('detail-title').innerText;
    let targetColor = color || currentTitle.split(' - ')[1]?.split(',')[0];
    let targetStorage = storage || currentTitle.split(', ')[1];

    const match = groupItems.find(p => {
        const pColor = p.title.split(' - ')[1]?.split(',')[0];
        const pStorage = p.title.split(', ')[1];
        return (!targetColor || pColor === targetColor) && (!targetStorage || pStorage === targetStorage);
    });

    if (match) {
        // Update UI
        document.getElementById('detail-title').innerText = match.title;
        document.getElementById('detail-image').src = match.image_link;
        document.getElementById('detail-price').innerText = formatIDR(match.sale_price || match.price);
        
        // Re-render buttons (lazy way)
        openProductDetail(groupId);
    }
}

function closeDrawer() {
    const inner = document.getElementById('drawer-inner');
    inner.classList.remove('open');
    setTimeout(() => {
        document.getElementById('product-drawer').classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 400);
}

// --- UTILS ---
function formatIDR(val) {
    const n = parseInt(val.replace(/\D/g, ''));
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
}

function startBannerTimer() {
    setInterval(() => {
        if (state.activeTab === 'home' && state.banners.length) {
            state.bannerIndex = (state.bannerIndex + 1) % state.banners.length;
            const container = document.getElementById('banner-section');
            if (container) container.innerHTML = renderBannerSlides();
        }
    }, 4000);
}

function addToCart() {
    state.cart.push({});
    document.getElementById('cart-count').innerText = state.cart.length;
    closeDrawer();
}

// --- START APP ---
init();
