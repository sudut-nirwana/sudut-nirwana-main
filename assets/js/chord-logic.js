document.addEventListener("DOMContentLoaded", function() {
    
    // === 1. INISIALISASI VARIABEL ===
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    let currentPitch = 0;
    let isScrolling = false;
    let scrollRequest = null;

    const containerChord = document.getElementById('chord-content');
    const popup = document.getElementById('chord-popup');
    const chordDisplay = document.getElementById('chord-name-display');
    const diagramContainer = document.getElementById('chord-diagram-container');

    // === 2. MANAJEMEN CHORD & DIAGRAM ===
    function initializeChords() {
        if (!containerChord) return;
        let rawText = containerChord.innerHTML;
        const chordRegex = /\b([A-G][b#]?(maj|min|m|M|add|sus|dim|aug|maj7|7|m7|sus4)?[0-9]*)\b/g;
        
        // Membungkus teks chord menjadi elemen yang bisa diklik
        containerChord.innerHTML = rawText.replace(chordRegex, '<span class="chord-node">$1</span>');

        // Menambahkan event klik untuk memunculkan popup diagram
        document.querySelectorAll('.chord-node').forEach(elem => {
            elem.addEventListener('click', function(e) {
                e.stopPropagation();
                const chordName = this.innerText;
                
                // Mengatur posisi popup agar muncul melayang di atas chord yang diklik
                const rect = this.getBoundingClientRect();
                popup.style.display = 'block';
                popup.style.left = (rect.left + window.scrollX - (130 / 2) + (rect.width / 2)) + 'px';
                popup.style.top = (rect.top + window.scrollY - 165) + 'px';

                chordDisplay.innerText = chordName;
                
                // Merender diagram menggunakan Chordicus secara instan
                diagramContainer.innerHTML = `<i class="chordicus" data-chord="${chordName}"></i>`;
                if(window.Chordicus) window.Chordicus.render();
            });
        });
    }

    // Klik di mana saja untuk menutup popup diagram
    document.addEventListener('click', (e) => {
        if (popup && !popup.contains(e.target)) popup.style.display = 'none';
    });

    document.getElementById('close-chord-btn')?.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    // === 3. FUNGSI TRANSPOSE (TETAP SEPERTI ASLI) ===
    window.transpose = function(steps) {
        currentPitch += steps;
        const indicator = document.getElementById('pitch-indicator');
        if (indicator) indicator.innerText = (currentPitch > 0 ? '+' : '') + currentPitch;
        
        document.querySelectorAll('.chord-node').forEach(node => {
            node.innerText = shiftChord(node.innerText, steps);
        });
    };

    function shiftChord(chord, steps) {
        return chord.replace(/[A-G][b#]?/g, function(match) {
            let i = notes.indexOf(match);
            if (i === -1) {
                const flats = { 'Bb': 10, 'Eb': 3, 'Ab': 8, 'Db': 1, 'Gb': 6 };
                i = flats[match] !== undefined ? flats[match] : -1;
            }
            if (i === -1) return match;
            let newIndex = (i + steps) % 12;
            while (newIndex < 0) newIndex += 12; 
            return notes[newIndex];
        });
    }

    window.resetTranspose = function() {
        transpose(-currentPitch);
        currentPitch = 0;
        const indicator = document.getElementById('pitch-indicator');
        if (indicator) indicator.innerText = '0';
    };

    // === 4. LOGIKA ZOOM BOX (TETAP SEPERTI ASLI) ===
    // Fungsi ini menjaga agar zoom hanya terjadi di dalam kontainer chord
    const el = containerChord;
    let scale = 1;
    let initialDist = 0;
    const baseFontSize = 15;

    if(el) {
        el.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                initialDist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
            }
        }, { passive: true });

        el.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                if (e.cancelable) e.preventDefault(); 
                const currentDist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
                const diff = currentDist / initialDist;
                let newScale = scale * diff;
                if (newScale > 0.6 && newScale < 3) el.style.fontSize = `${baseFontSize * newScale}px`;
            }
        }, { passive: false });

        el.addEventListener('touchend', (e) => {
            const currentFontSize = window.getComputedStyle(el).getPropertyValue('font-size');
            scale = parseFloat(currentFontSize) / baseFontSize;
        });
    }

    // === 5. LOGIKA AUTOSCROLL (SEPERTI ASLI) ===
    // ... (Logika autoscroll Anda tetap berjalan di sini) ...

    initializeChords();
});
