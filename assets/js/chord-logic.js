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
document.addEventListener("DOMContentLoaded", function() {
    initializeChords();
    
    // Sembunyikan widget Bandsintown jika artis kosong (Universal Check)
    const widgetElement = document.getElementById('bt-element');
    const wrapper = document.getElementById('bt-widget-wrapper');
    if (widgetElement && wrapper) {
        const artistName = widgetElement.getAttribute('data-artist-name');
        if (!artistName || artistName.includes('{{')) {
            wrapper.style.display = 'none';
        }


        function startScroll() {
    isScrolling = true;
    container.classList.add('active');
    $(text).html('<i class="fas fa-stop"></i>').css({
       fontSize: "1.2rem",
    });
    requestAnimationFrame(updateScroll); // Mulai animasi halus
}

function stopScroll() {
    isScrolling = false;
    container.classList.remove('active');
    $(text).html('<i class="fas fa-gear"></i>').css({
       fontSize: "1.2rem",
    });
    cancelAnimationFrame(scrollRequest); // Hentikan animasi
}

// FUNGSI RAHASIA AGAR HALUS: requestAnimationFrame
function updateScroll() {
    if (!isScrolling) return;

    // Kita gunakan angka desimal untuk kecepatan agar gerakan tidak "loncat" 1 pixel
    // Level 1: sangat pelan, Level 5: cukup cepat
    const speeds = {
        1: 0.3, 
        2: 0.7,
        3: 1.2,
        4: 2.0,
        5: 3.5 
    };
    
    const speed = speeds[parseInt(slider.value)] || 1;
    
    // Scroll dengan angka desimal didukung oleh browser modern untuk sub-pixel rendering
    window.scrollBy(0, speed);
    
    scrollRequest = requestAnimationFrame(updateScroll);
}

// Kontrol Tombol
btnPlus.addEventListener('click', (e) => {
    e.stopPropagation();
    if (parseInt(slider.value) < 5) {
        slider.value = parseInt(slider.value) + 1;
    }
});

btnMinus.addEventListener('click', (e) => {
    e.stopPropagation();
    if (parseInt(slider.value) > 1) {
        slider.value = parseInt(slider.value) - 1;
    }
});
    }


    
    
    
});
