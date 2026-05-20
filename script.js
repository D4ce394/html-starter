// 1. Taruh fungsi copy di paling atas (Global Scope) agar bisa dipanggil onclick HTML
function copyToClipboard(text, tooltipId) {
    navigator.clipboard.writeText(text).then(() => {
        const tooltip = document.getElementById(tooltipId);
        if (!tooltip) return; // Guard clause jika ID salah

        // Munculkan notifikasi
        tooltip.classList.remove('opacity-0');
        tooltip.classList.add('opacity-100');
        
        // Hilangkan kembali setelah 2 detik
        setTimeout(() => {
            tooltip.classList.remove('opacity-100');
            tooltip.classList.add('opacity-0');
        }, 2000);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi Ikon Lucide
    lucide.createIcons();

    // --- HANDLE SCROLL NAVBAR ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('nav-scrolled');
            navbar.classList.remove('bg-transparent');
        } else {
            navbar.classList.remove('nav-scrolled');
            navbar.classList.add('bg-transparent');
        }
    });

    // --- GENERATE GALLERY ITEMS ---
    const galleryGrid = document.getElementById('gallery-grid');
    if (galleryGrid) { // Pastikan element ada agar tidak error
        const images = [
            { id: 1, src: "assets/kegiatan1.jpeg", alt: "Aktivitas Bersama" },
            { id: 2, src: "assets/kegiatan5.jpeg", alt: "Aktivitas Bersama" },
            { id: 3, src: "assets/kegiatan4.jpeg", alt: "Aktivitas Bersama" },
            { id: 4, src: "assets/kegiatan3.jpeg", alt: "Aktivitas Bersama" },
            { id: 5, src: "assets/kegiatan6.jpeg", alt: "Aktivitas Bersama" },
            { id: 6, src: "assets/kegiatan2.jpeg", alt: "Aktivitas Bersama" },
        ];

        images.forEach(image => {
            const item = document.createElement('div');
            item.className = 'gallery-item group';
            item.innerHTML = `
                <img src="${image.src}" alt="${image.alt}">
            `;
            galleryGrid.appendChild(item);
        });
    }

    // Jalankan ulang untuk element yang baru di-generate (opsional jika ada icon di galeri)
    lucide.createIcons();
});