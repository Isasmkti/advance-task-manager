<?php

// Angka keseimbangan game. Ubah di sini tanpa menyentuh logika.
return [
    // HP hero per hari (dipulihkan penuh tiap pergantian hari menurut zona waktu user).
    'hp_max' => 100,

    // HP yang hilang untuk setiap quest yang lewat deadline.
    'hp_penalty' => 10,

    // Harga satu streak freeze (koin) dan jumlah maksimal yang boleh disimpan.
    'freeze_price' => 50,
    'freeze_max' => 3,
];
