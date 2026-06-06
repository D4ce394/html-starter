// ============================================================
//  LKSA Insan Harapan — Interaksi & Animasi
// ============================================================

// Fungsi copy nomor rekening (dipanggil via onclick di HTML)
function copyToClipboard(text, tooltipId) {
    const show = (id) => {
        const tip = document.getElementById(id);
        if (!tip) return;
        tip.classList.remove('opacity-0');
        tip.classList.add('opacity-100');
        setTimeout(() => {
            tip.classList.remove('opacity-100');
            tip.classList.add('opacity-0');
        }, 2000);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => show(tooltipId)).catch(() => fallbackCopy(text, () => show(tooltipId)));
    } else {
        fallbackCopy(text, () => show(tooltipId));
    }
}

function fallbackCopy(text, done) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    done && done();
}

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // --- NAVBAR: ubah gaya saat scroll + tampilkan tombol "ke atas" ---
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('back-to-top');

    const onScroll = () => {
        const y = window.scrollY;
        if (y > 50) {
            navbar.classList.add('nav-scrolled');
            navbar.classList.remove('bg-transparent');
        } else {
            navbar.classList.remove('nav-scrolled');
            navbar.classList.add('bg-transparent');
        }
        if (backToTop) {
            if (y > 600) {
                backToTop.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
            } else {
                backToTop.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
            }
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (backToTop) {
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // --- MENU MOBILE ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const openIcon = document.getElementById('menu-open-icon');
    const closeIcon = document.getElementById('menu-close-icon');
    let menuOpen = false;

    const setMenu = (open) => {
        menuOpen = open;
        menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) {
            mobileMenu.classList.remove('max-h-0', 'opacity-0');
            mobileMenu.classList.add('max-h-[420px]', 'opacity-100');
            openIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
        } else {
            mobileMenu.classList.add('max-h-0', 'opacity-0');
            mobileMenu.classList.remove('max-h-[420px]', 'opacity-100');
            openIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        }
    };

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => setMenu(!menuOpen));
        document.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => setMenu(false));
        });
    }

    // --- GALERI + LIGHTBOX ---
    const galleryGrid = document.getElementById('gallery-grid');
    const images = [
        { src: "assets/kegiatan1.jpeg", alt: "Kegiatan bersama anak asuh" },
        { src: "assets/kegiatan5.jpeg", alt: "Kegiatan belajar" },
        { src: "assets/kegiatan4.jpeg", alt: "Aktivitas keseharian" },
        { src: "assets/kegiatan3.jpeg", alt: "Kebersamaan di panti" },
        { src: "assets/kegiatan6.jpeg", alt: "Kegiatan rutin" },
        { src: "assets/kegiatan2.jpeg", alt: "Momen kebersamaan" },
    ];

    if (galleryGrid) {
        images.forEach((image, i) => {
            const item = document.createElement('div');
            item.className = 'gallery-item group reveal';
            item.style.transitionDelay = (i * 60) + 'ms';
            item.setAttribute('data-index', i);
            item.innerHTML = `
                <img src="${image.src}" alt="${image.alt}" loading="lazy">
                <div class="gallery-overlay">
                    <span class="gallery-btn flex items-center gap-2">
                        <i data-lucide="zoom-in" class="w-4 h-4"></i> Lihat
                    </span>
                </div>
            `;
            item.addEventListener('click', () => openLightbox(i));
            galleryGrid.appendChild(item);
        });
    }

    // Lightbox logic
    const lightbox = document.getElementById('lightbox');
    const lbImage = document.getElementById('lb-image');
    const lbCounter = document.getElementById('lb-counter');
    let currentIndex = 0;

    function renderLightbox() {
        lbImage.src = images[currentIndex].src;
        lbImage.alt = images[currentIndex].alt;
        lbCounter.textContent = `${currentIndex + 1} / ${images.length}`;
    }
    function openLightbox(i) {
        currentIndex = i;
        renderLightbox();
        lightbox.classList.remove('opacity-0', 'pointer-events-none');
        document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
        lightbox.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = '';
    }
    function nav(dir) {
        currentIndex = (currentIndex + dir + images.length) % images.length;
        renderLightbox();
    }

    if (lightbox) {
        document.getElementById('lb-close').addEventListener('click', closeLightbox);
        document.getElementById('lb-prev').addEventListener('click', () => nav(-1));
        document.getElementById('lb-next').addEventListener('click', () => nav(1));
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('pointer-events-none')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') nav(-1);
            if (e.key === 'ArrowRight') nav(1);
        });
    }

    // --- SCROLL REVEAL (IntersectionObserver) ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // --- ANIMASI ANGKA (COUNTER) ---
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1600;
        const start = performance.now();
        const step = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
            el.textContent = Math.round(eased * target) + suffix;
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }

    document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

    // --- SCROLLSPY: sorot link nav sesuai section aktif ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const spy = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(l => {
                    l.classList.toggle('nav-active', l.getAttribute('href') === '#' + id);
                });
            }
        });
    }, { threshold: 0.5 });
    sections.forEach(s => spy.observe(s));

    // ============================================================
    //  BLOG / BERITA dari GOOGLE SHEET
    //  Cara setup ada di bawah (lihat komentar PANDUAN).
    // ============================================================
    const BLOG_SHEET_ID = '1vR5L3VeUHdCf5gmHguzLuJ-PVL941YOko5DRAke-ZV4';
    const BLOG_SHEET_NAME = 'Blog'; // nama tab/sheet di dalam file

    // Data contoh — tampil bila Sheet belum dikonfigurasi atau kosong,
    // jadi situs tidak pernah terlihat kosong.
    const BLOG_FALLBACK = [{
        judul: 'Persiapan Pelaksanaan Ibadah Kurban 1447H di LKSA Insan Harapan',
        tanggal: '27 Mei 2026',
        kategori: 'Kurban 2026',
        gambar: 'https://images.unsplash.com/photo-1586459226458-409b7248148a?q=80&w=1074&auto=format&fit=crop',
        ringkasan: 'Menjelang Idul Adha, panti asuhan kami mulai membuka penerimaan dan penyaluran hewan kurban.',
        isi: 'Menjelang Idul Adha, panti asuhan kami mulai membuka penerimaan dan penyaluran hewan kurban.\nSeluruh proses akan dilakukan dengan standar kebersihan yang ketat untuk memastikan amanah para donatur tersampaikan kepada yang berhak.\nDengan dukungan para donatur, insya Allah kebahagiaan Idul Adha dapat dirasakan seluruh anak asuh kami.'
    }];

    let BLOG_POSTS = [];

    const blogIsConfigured = () => BLOG_SHEET_ID && !BLOG_SHEET_ID.startsWith('GANTI');

    const escapeHtml = (s) => {
        const d = document.createElement('div');
        d.textContent = s == null ? '' : String(s);
        return d.innerHTML;
    };

    async function fetchBlogFromSheet() {
        const url = `https://docs.google.com/spreadsheets/d/${BLOG_SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(BLOG_SHEET_NAME)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const text = await res.text();
        const json = JSON.parse(text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1));
        const cols = (json.table.cols || []).map(c => (c.label || '').toString().toLowerCase().trim());
        let rows = json.table.rows || [];

        // Bila label kolom kosong, pakai baris pertama sebagai header
        let offset = 0;
        if (cols.every(c => c === '') && rows[0]) {
            rows[0].c.forEach((cell, i) => { cols[i] = cell && cell.v != null ? cell.v.toString().toLowerCase().trim() : ''; });
            offset = 1;
        }

        return rows.slice(offset).map(r => {
            const o = {};
            (r.c || []).forEach((cell, i) => {
                const key = cols[i];
                if (!key) return;
                o[key] = cell ? (cell.f != null ? cell.f : (cell.v != null ? cell.v : '')) : '';
            });
            return o;
        });
    }

    function normalizeBlog(rows) {
        const hidden = ['tidak', 'no', 'draft', 'sembunyikan', 'false', '0'];
        return rows
            .map(r => ({
                judul: (r.judul || '').toString().trim(),
                tanggal: (r.tanggal || '').toString().trim(),
                kategori: (r.kategori || '').toString().trim(),
                gambar: (r.gambar || '').toString().trim(),
                ringkasan: (r.ringkasan || '').toString().trim(),
                isi: (r.isi || '').toString().trim(),
                tampilkan: (r.tampilkan || '').toString().trim().toLowerCase()
            }))
            .filter(p => p.judul && !hidden.includes(p.tampilkan))
            .reverse(); // baris terbaru (paling bawah di Sheet) tampil paling atas
    }

    function renderBlog(posts) {
        const feed = document.getElementById('blog-feed');
        if (!feed) return;

        if (!posts.length) {
            feed.innerHTML = '<div class="text-center text-slate-500 py-12 bg-white rounded-2xl border border-[#E2F5FE]">Belum ada berita. Nantikan kabar terbaru dari kami.</div>';
            return;
        }

        const [featured, ...rest] = posts;

        const featuredHtml = `
            <article class="blog-open cursor-pointer reveal bg-white rounded-[2rem] overflow-hidden shadow-lg border border-[#E2F5FE] flex flex-col md:flex-row hover:shadow-xl transition-all mb-8 group" data-idx="0">
                ${featured.gambar ? `<div class="md:w-2/5 h-52 md:h-auto overflow-hidden">
                    <img src="${escapeHtml(featured.gambar)}" alt="${escapeHtml(featured.judul)}" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                </div>` : ''}
                <div class="md:w-3/5 p-8 md:p-10 flex flex-col justify-center">
                    <div class="flex flex-wrap items-center gap-3 text-slate-500 text-sm mb-3">
                        ${featured.kategori ? `<span class="px-3 py-0.5 bg-[#0A7BBF]/10 text-[#0A7BBF] rounded-full text-xs font-semibold">${escapeHtml(featured.kategori)}</span>` : ''}
                        ${featured.tanggal ? `<span class="flex items-center gap-1.5"><i data-lucide="calendar" class="w-4 h-4"></i>${escapeHtml(featured.tanggal)}</span>` : ''}
                    </div>
                    <h3 class="text-2xl font-bold text-[#132539] mb-3 leading-snug">${escapeHtml(featured.judul)}</h3>
                    <p class="text-slate-600 leading-relaxed mb-5 line-clamp-3">${escapeHtml(featured.ringkasan || featured.isi)}</p>
                    <span class="inline-flex items-center gap-2 text-[#0A7BBF] font-semibold text-sm">Baca selengkapnya <i data-lucide="arrow-right" class="w-4 h-4"></i></span>
                </div>
            </article>`;

        const gridHtml = rest.length ? `
            <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                ${rest.map((p, i) => `
                    <article class="blog-open cursor-pointer reveal bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1.5 transition-all flex flex-col group" data-idx="${i + 1}" style="transition-delay:${i * 60}ms">
                        ${p.gambar
                            ? `<div class="h-44 overflow-hidden"><img src="${escapeHtml(p.gambar)}" alt="${escapeHtml(p.judul)}" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"></div>`
                            : `<div class="h-44 bg-gradient-to-br from-[#0A7BBF] to-[#0d8cd9] flex items-center justify-center"><i data-lucide="newspaper" class="w-10 h-10 text-white/40"></i></div>`}
                        <div class="p-6 flex flex-col flex-1">
                            <div class="flex items-center gap-2 text-slate-400 text-xs mb-2">
                                ${p.kategori ? `<span class="text-[#0A7BBF] font-semibold">${escapeHtml(p.kategori)}</span><span>•</span>` : ''}
                                <span>${escapeHtml(p.tanggal)}</span>
                            </div>
                            <h3 class="text-lg font-bold text-[#132539] mb-2 line-clamp-2 leading-snug">${escapeHtml(p.judul)}</h3>
                            <p class="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-4">${escapeHtml(p.ringkasan || p.isi)}</p>
                            <span class="mt-auto inline-flex items-center gap-1.5 text-[#0A7BBF] font-semibold text-sm">Baca <i data-lucide="arrow-right" class="w-4 h-4"></i></span>
                        </div>
                    </article>`).join('')}
            </div>` : '';

        feed.innerHTML = featuredHtml + gridHtml;

        feed.querySelectorAll('.blog-open').forEach(el => {
            el.addEventListener('click', () => openBlogModal(parseInt(el.getAttribute('data-idx'), 10)));
            revealObserver.observe(el);
        });
        lucide.createIcons();
    }

    // --- Modal pembaca ---
    function openBlogModal(idx) {
        const p = BLOG_POSTS[idx];
        if (!p) return;
        const modal = document.getElementById('blog-modal');
        const imgWrap = document.getElementById('bm-image-wrap');
        const img = document.getElementById('bm-image');
        const cat = document.getElementById('bm-cat');

        if (p.gambar) { imgWrap.style.display = ''; img.src = p.gambar; img.alt = p.judul; }
        else { imgWrap.style.display = 'none'; }

        if (p.kategori) { cat.style.display = ''; cat.textContent = p.kategori; }
        else { cat.style.display = 'none'; }

        document.getElementById('bm-date').textContent = p.tanggal || '';
        document.getElementById('bm-title').textContent = p.judul;

        const paras = (p.isi || p.ringkasan || '').split(/\n+/).map(t => t.trim()).filter(Boolean);
        document.getElementById('bm-body').innerHTML = paras.map(t => `<p>${escapeHtml(t)}</p>`).join('');

        modal.classList.remove('opacity-0', 'pointer-events-none');
        document.body.style.overflow = 'hidden';
        lucide.createIcons();
    }

    function closeBlogModal() {
        const modal = document.getElementById('blog-modal');
        modal.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = '';
    }

    const blogModal = document.getElementById('blog-modal');
    if (blogModal) {
        document.getElementById('bm-close').addEventListener('click', closeBlogModal);
        blogModal.addEventListener('click', (e) => { if (e.target === blogModal) closeBlogModal(); });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !blogModal.classList.contains('pointer-events-none')) closeBlogModal();
        });
    }

    // --- Inisialisasi blog ---
    (async () => {
        if (!document.getElementById('blog-feed')) return;
        let posts = [];
        try {
            if (blogIsConfigured()) {
                posts = normalizeBlog(await fetchBlogFromSheet());
            }
        } catch (err) {
            console.warn('Blog: gagal memuat dari Google Sheet —', err.message, '| Menampilkan data contoh.');
        }
        if (!posts.length) posts = normalizeBlog(BLOG_FALLBACK);
        BLOG_POSTS = posts;
        renderBlog(posts);
    })();

    // Render ulang ikon (untuk elemen yang baru dibuat: galeri, lightbox)
    lucide.createIcons();
});