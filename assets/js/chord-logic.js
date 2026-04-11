
document.addEventListener("DOMContentLoaded", function() {
   
    const widgetElement = document.getElementById('bt-element');
    const wrapper = document.getElementById('bt-widget-wrapper');
    
    if (widgetElement) {
        const artistName = widgetElement.getAttribute('data-artist-name');

        // Sembunyikan jika nama artis kosong atau masih berupa tag template
        if (!artistName || artistName.trim() === "" || artistName.includes("{{")) {
            wrapper.style.display = 'none';
        } else {
            wrapper.style.display = 'block';
        }
    }
    
    // Konfigurasi Nada
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
let currentPitch = 0;

// 1. Fungsi Mendeteksi Chord Otomatis (Jalankan saat awal load)
function initializeChords() {
    const container = document.getElementById('chord-content');
    let rawText = container.innerHTML;
    
    // Regex cerdas untuk mencari chord tanpa merusak lirik
    const chordRegex = /\b([A-G][b#]?(maj|min|m|M|add|sus|dim|aug|maj7|7|m7|sus4)?[0-9]*)\b/g;
    
    container.innerHTML = rawText.replace(chordRegex, '<span class="chord-node">$1</span>');
}

// 2. Fungsi Transpose
function transpose(steps) {
    currentPitch += steps;
    document.getElementById('pitch-indicator').innerText = (currentPitch > 0 ? '+' : '') + currentPitch;
    
    const chordNodes = document.querySelectorAll('.chord-node');
    
    chordNodes.forEach(node => {
        node.innerText = shiftChord(node.innerText, steps);
    });
}

// 3. Logika Perubahan Nada
function shiftChord(chord, steps) {
    return chord.replace(/[A-G][b#]?/g, function(match) {
        let i = notes.indexOf(match);
        if (i === -1) { // Jika flat (Bb), ubah dulu ke Sharp (A#)
            if (match === 'Bb') i = 10;
            if (match === 'Eb') i = 3;
            if (match === 'Ab') i = 8;
            if (match === 'Db') i = 1;
            if (match === 'Gb') i = 6;
        }
        i = (i + steps + 12) % 12;
        return notes[i];
    });
}

function resetTranspose() {
    transpose(-currentPitch);
    currentPitch = 0;
    document.getElementById('pitch-indicator').innerText = '0';
}

// Jalankan inisialisasi saat web siap
document.addEventListener("DOMContentLoaded", initializeChords);

const container = document.getElementById('autoscroll-container');
const trigger = document.getElementById('scroll-trigger');
const text = document.getElementById('trigger-text');
const slider = document.getElementById('speed-slider');
const btnPlus = document.getElementById('btn-plus');
const btnMinus = document.getElementById('btn-minus');

let scrollRequest = null;
let isScrolling = false;

// Fungsi utama untuk toggle
trigger.addEventListener('click', () => {
    const isOpen = container.classList.toggle('open');
    if (isOpen) {
        startScroll();
    } else {
        stopScroll();
    }
});

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

});
        
