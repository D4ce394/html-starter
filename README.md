# Website LKSA Insan Harapan

Website panti asuhan **LKSA Insan Harapan** — berisi profil lembaga, program, informasi donasi, dan **berita/kegiatan** yang dikelola **langsung dari Google Spreadsheet**.

Website ini dibuat sebagai **situs statis** (HTML, CSS, JavaScript) sehingga bisa di-hosting di mana saja, termasuk **hosting cPanel termurah seperti Biznet Gio** — tanpa Node.js, database, atau proses build.

> 📘 **Untuk admin/pengelola yang tidak berlatar teknis:** baca **[PANDUAN-NONTEKNIS.md](PANDUAN-NONTEKNIS.md)**. Berisi langkah demi langkah cara menambah berita lewat Google Spreadsheet.

---

## ✨ Cara Kerja Singkat

Berita di website dibaca **langsung dari Google Spreadsheet** secara otomatis.
Pengelola cukup mengedit spreadsheet — website langsung ikut berubah.
**Tidak ada file yang perlu di-upload ulang setiap menambah berita.**

```
   Edit Google Spreadsheet  →  Website otomatis update ✅
```

---

## 📁 Struktur Proyek

```
insan-harapan-web/
├── index.html              # Halaman utama (profil + daftar berita)
├── berita.html             # Halaman detail satu berita
├── style.css               # Tampilan / gaya website
├── app.js                  # "Mesin konten": membaca Google Spreadsheet & menampilkan berita
├── .htaccess               # Konfigurasi server (HTTPS, cache, keamanan)
├── middleware.js           # (Opsional) hanya dipakai bila hosting di Vercel
├── assets/                 # Tempat menyimpan gambar/logo (opsional)
├── README.md               # Dokumen ini
└── PANDUAN-NONTEKNIS.md    # Tutorial untuk pengelola (non-teknis)
```

---

## ⚙️ Konfigurasi Awal (sekali saja)

### 1. Siapkan Google Spreadsheet
- Unggah / buat spreadsheet di Google Sheets dengan **sheet bernama `Blog`** dan kolom:
  `judul, tanggal, kategori, gambar, ringkasan, isi, tampilan`
- Klik **Bagikan (Share)** → ubah akses menjadi
  **"Siapa saja yang memiliki link" → Pelihat (Viewer)**.

### 2. Masukkan ID Spreadsheet ke website
- Salin ID dari alamat spreadsheet. Contoh:
  `https://docs.google.com/spreadsheets/d/`**`1AbcDEFghIJklMNOpqR`**`/edit`
  → ID-nya adalah bagian di antara `/d/` dan `/edit`.
- Buka file **`app.js`**, ubah baris:
  ```js
  var ID_SPREADSHEET = "GANTI_DENGAN_ID_SPREADSHEET_ANDA";
  ```
  menjadi ID milik Anda, lalu simpan.

Selesai. Mulai sekarang, cukup edit spreadsheet untuk mengubah berita.

---

## 🧠 Detail Teknis Berita

1. `app.js` membaca spreadsheet melalui endpoint CSV bawaan Google:
   `https://docs.google.com/spreadsheets/d/{ID}/gviz/tq?tqx=out:csv&sheet=Blog`
2. CSV diuraikan dengan [PapaParse](https://www.papaparse.com/) di sisi browser.
3. Hanya baris dengan kolom **`tampilan`** bernilai **`ya`** yang ditampilkan.
4. Klik berita → membuka `berita.html?judul=...` berisi isi lengkap.

Karena dibaca langsung dari Google, perubahan di spreadsheet muncul di website
hampir seketika (kadang ada jeda cache beberapa menit).

---

## 🚀 Deploy ke Biznet (cPanel)

1. Login ke **cPanel** Biznet → buka **File Manager**.
2. Masuk ke folder **`public_html`**.
3. Unggah seluruh isi folder ini ke `public_html`
   (pastikan `index.html` berada langsung di dalam `public_html`, dan `.htaccess` ikut terunggah).
4. Aktifkan **SSL gratis (Let's Encrypt)** dari *Security → SSL/TLS Status*.

> **Tips:** kompres jadi `.zip`, unggah, lalu klik kanan → **Extract**.

Website hanya perlu di-upload **sekali**. Setelah itu pengelolaan berita
sepenuhnya lewat Google Spreadsheet.

---

## 🛠️ Pengembangan Lokal (untuk developer)

```bash
cd insan-harapan-web
python3 -m http.server 8000
```
Buka `http://localhost:8000` (jangan dibuka via klik dua kali, karena perlu HTTP).

---

## ⚙️ Teknologi

- HTML5, CSS3, JavaScript (vanilla)
- Google Sheets (sumber data berita, via endpoint CSV/gviz)
- [PapaParse](https://www.papaparse.com/) untuk membaca CSV
- Google Fonts: *Fraunces* & *Plus Jakarta Sans*
- Apache `.htaccess` (kompatibel cPanel)

---

## 📄 Lisensi

Hak cipta © LKSA Insan Harapan.