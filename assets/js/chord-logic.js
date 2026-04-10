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

});
