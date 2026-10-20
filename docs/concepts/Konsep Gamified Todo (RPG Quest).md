# Konsep: Gamified Todo (RPG Quest)

Stack: Laravel (backend API) + Next.js (frontend) · Tema: cozy pixel

## 1. Ide Inti

Setiap tugas adalah **quest**, dan kamu adalah **hero** yang naik level lewat produktivitas. Tujuannya membuat menyelesaikan tugas terasa seperti progres di game.

**Core loop:** buat quest → kerjakan → selesaikan → dapat reward (XP, koin, loot) → naik level → buka fitur baru → termotivasi bikin quest lagi.

## 2. Sistem Karakter

- **Profil hero**: nama, avatar, title (misalnya "Pemula", "Petualang", "Ksatria")
- **Level dan XP**: kebutuhan XP naik tiap level, supaya level awal cepat dan level tinggi butuh usaha
- **HP/Energi** berkurang sedikit kalau quest lewat deadline dan pulih otomatis tiap hari (lihat bagian Sistem Penalti Ringan)
- **Koin**: mata uang untuk dibelanjakan di toko

## 3. Sistem Quest

| Tipe | Deskripsi |
| --- | --- |
| **Quest biasa** | Tugas sekali selesai |
| **Daily quest** | Tugas harian berulang |
| **Boss quest** | Tugas besar yang dipecah jadi subtugas, tiap subtugas selesai mengurangi "HP boss" |
| **Side quest** | Tugas opsional dengan bonus ekstra |

**Tingkat kesulitan** menentukan reward: Easy, Medium, Hard, Epic. Tiap quest punya judul, deskripsi, kategori (kerja, belajar, kesehatan, dll), due date, dan kesulitan.

**Rumus XP sederhana:** XP dasar sesuai kesulitan, ditambah bonus kalau selesai sebelum deadline, ditambah bonus streak.

## 4. Sistem Reward dan Progres

- **Streak harian**: selesaikan minimal 1 quest per hari. Multiplier XP naik seiring streak (misalnya 3 hari = x1.1, 7 hari = x1.25)
- **Achievement/badge**: "Quest pertama", "10 quest dalam sehari", "Streak 30 hari", "Boss Slayer"
- **Loot box** (opsional): drop acak saat menyelesaikan quest Hard/Epic
- **Toko**: tukar koin dengan avatar, tema warna, frame profil, atau power-up

## 5. Fitur Pelengkap

- **Dashboard**: level, bar XP, streak, quest hari ini, statistik mingguan
- **Kalender heatmap** aktivitas ala GitHub
- **Leaderboard**: ranking mingguan berbasis XP untuk teman atau grup (lihat bagian Leaderboard)
- **Animasi dan efek**: confetti saat quest selesai, animasi naik level, suara kecil (opsional)
- **Notifikasi**: pengingat deadline dan peringatan streak hampir putus

## 6. Pembagian Tugas Laravel dan Next.js

**Laravel (logika dan data):**

- Auth (Sanctum)
- Perhitungan XP, level, streak, dan koin, sebaiknya di server supaya tidak bisa dicurangi
- Aturan achievement dan reset daily quest (scheduler)
- API untuk quest, profil, toko, dan leaderboard

**Next.js (tampilan dan pengalaman):**

- Dashboard, daftar quest, halaman toko dan profil
- Animasi level up dan efek reward
- State UI dan optimistic update agar terasa responsif

## 7. Entitas Data Utama (Konseptual)

- **Users**: data akun plus level, total XP, koin, streak saat ini, streak terpanjang
- **Quests**: judul, deskripsi, kategori, kesulitan, due date, status, tipe, relasi ke parent (untuk boss quest)
- **Achievements** dan **user\_achievements**: daftar badge dan siapa yang sudah membukanya
- **Items** dan **user\_items**: barang toko dan kepemilikan
- **Activity logs**: riwayat XP dan quest selesai (untuk heatmap dan statistik)

## 8. Tema Visual: Cozy Pixel

Tampilan hangat dan tenang, dengan estetika pixel art yang tidak ramai.

- **Palet**: krem, cokelat, hijau sage, dan pastel lembut; hindari warna neon
- **Tipografi**: font pixel untuk judul dan label game, font bersih untuk teks panjang agar tetap nyaman dibaca
- **Ruang hero**: kamar kecil bergaya pixel yang bisa didekorasi dengan barang dari toko, dengan hero yang duduk santai di dalamnya
- **Animasi**: pelan dan menenangkan; confetti dan efek naik level tetap ada tapi lembut
- **Suara** (opsional): efek lembut, bukan yang mengagetkan

## 9. Sistem Penalti Ringan

Penalti berfungsi sebagai dorongan, bukan hukuman, agar tetap cocok dengan nuansa cozy.

| Kejadian | Efek | Pemulihan |
| --- | --- | --- |
| Quest lewat deadline | HP berkurang sedikit | HP pulih otomatis tiap hari |
| Absen sehari | Streak terjaga lewat hari istirahat atau streak freeze | Tidak perlu pemulihan |
| HP habis | Hero "tidur" dan bonus XP hilang sehari | Normal kembali keesokan harinya |
| Semua kasus di atas | XP dan level tidak pernah berkurang | Tidak ada |

## 10. Leaderboard

- **Ranking mingguan** berdasarkan XP, direset tiap minggu supaya pemain baru tetap punya peluang
- **Lingkup teman atau grup**, bukan global, agar terasa hangat dan tidak terlalu kompetitif
- **Dihitung di server** (Laravel) dari activity logs, sehingga tidak bisa dicurangi
- **Privasi**: setiap pemain bisa memilih ikut atau tidak tampil di leaderboard

## 11. Roadmap Bertahap

1. **Fase 1 (MVP):** auth, CRUD quest, kesulitan, XP, level
2. **Fase 2:** streak, daily quest, koin, achievement dasar
3. **Fase 3:** boss quest, toko, kustomisasi avatar
4. **Fase 4:** dashboard statistik, heatmap, animasi
5. **Fase 5:** leaderboard, notifikasi, PWA

## Pertanyaan Terbuka

- Berapa besar pengurangan HP per quest terlambat, dan berapa jumlah streak freeze per minggu?
- Bagaimana teman ditambahkan: lewat username atau kode undangan?
- Aset pixel art: dibuat sendiri atau memakai aset berlisensi?
