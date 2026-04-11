/**
 * Chord Logic & Transpose System
 * Deskripsi: Mendeteksi chord secara otomatis dan mengubah nada (transpose).
 */

// 1. Variabel Global (Wajib di luar agar bisa diakses tombol HTML)
let currentPitch = 0;
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// 2. Fungsi Transpose (Dipanggil oleh onclick="transpose(1)" di HTML)
function transpose(steps) {
    currentPitch += steps;
    
    // Update angka indikator nada di layar
    const indicator = document.getElementById('pitch-indicator');
    if (indicator) {
        indicator.innerText = (currentPitch > 0 ? '+' : '') + currentPitch;
    }

    // Ambil semua elemen chord yang sudah dibungkus span
    const chordNodes = document.querySelectorAll('.chord-node');
    chordNodes.forEach(node => {
        node.innerText = shiftChord(node.innerText, steps);
    });
}

// 3. Logika Perubahan Nada
function shiftChord(chord, steps) {
    return chord.replace(/([A-G][b#]?)/g, function(match) {
        let i = notes.indexOf(match.replace('bb', 'A').replace('Eb', 'D#').replace('Ab', 'G#').replace('Db', 'C#').replace('Bb', 'A#'));
        
        // Handle jika chord menggunakan Flat (b) yang tidak ada di array notes
        if (match === 'Gb') i = 6;
        if (match === 'Eb') i = 3;
        if (match === 'Ab') i = 8;
        if (match === 'Db') i = 1;
        if (match === 'Bb') i = 10;

        if (i === -1) return match;
        
        let newIndex = (i + steps) % 12;
        while (newIndex < 0) newIndex += 12;
        return notes[newIndex];
    });
}

// 4. Fungsi Reset Nada
function resetTranspose() {
    transpose(-currentPitch);
    currentPitch = 0;
    const indicator = document.getElementById('pitch-indicator');
    if (indicator) indicator.innerText = '0';
}

// 5. Inisialisasi Otomatis saat Halaman Dimuat
function initializeChords() {
    const container = document.getElementById('chord-content');
    if (!container) return;

    let rawText = container.innerHTML;
    
    // Regex untuk mendeteksi chord (A, Am, C#m7, dll)
    const chordRegex = /\b([A-G][b#]?(m|maj|dim|aug|sus|add)?(2|4|5|6|7|9|11|13)?)\b/g;

    // Bungkus chord dengan span agar bisa dimanipulasi
    container.innerHTML = rawText.replace(chordRegex, '<span class="chord-node">$1</span>');
}

// 6. Jalankan fungsi saat browser selesai memuat HTML
    document.addEventListener('DOMContentLoaded', function() {
    
    // --- KODE LAMA KAMU (Misal: inisialisasi chord, dll) ---
    initializeChords(); 
    // ... kode lama lainnya ...


    // --- TAMBAHKAN KODE AUTOSCROLL DI SINI ---
    const scrollTrigger = document.getElementById('scroll-trigger');
    const textSpan = document.getElementById('trigger-text');
    const container = document.getElementById('autoscroll-container');
    const slider = document.getElementById('speed-slider');
    const btnPlus = document.getElementById('btn-plus');
    const btnMinus = document.getElementById('btn-minus');

    let isScrolling = false;
    let scrollRequest;

    const speeds = { 1: 0.3, 2: 0.7, 3: 1.2, 4: 2.0, 5: 3.5 };

    function updateScroll() {
        if (!isScrolling) return;
        const speed = speeds[parseInt(slider.value)] || 1;
        window.scrollBy(0, speed);
        scrollRequest = requestAnimationFrame(updateScroll);
    }

    // Event Klik Gear
    if (scrollTrigger) {
        scrollTrigger.addEventListener('click', function() {
            if (!isScrolling) {
                isScrolling = true;
                if(container) container.classList.add('active');
                if(textSpan) textSpan.innerHTML = '<i class="fas fa-stop"></i>';
                updateScroll();
            } else {
                isScrolling = false;
                if(container) container.classList.remove('active');
                if(textSpan) textSpan.innerHTML = '<i class="fas fa-gear"></i>';
                cancelAnimationFrame(scrollRequest);
            }
        });
    }

    // Event Plus/Minus
    if (btnPlus) {
        btnPlus.addEventListener('click', (e) => {
            e.stopPropagation();
            if (parseInt(slider.value) < 5) slider.value = parseInt(slider.value) + 1;
        });
    }
    
    if (btnMinus) {
        btnMinus.addEventListener('click', (e) => {
            e.stopPropagation();
            if (parseInt(slider.value) > 1) slider.value = parseInt(slider.value) - 1;
        });
    }

}); // Tutup DOMContentLoaded
    

 
    
    
});
