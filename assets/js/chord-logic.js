document.addEventListener("DOMContentLoaded", function() {
    
    // === 1. VARIABEL GLOBAL ===
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    let currentPitch = 0;
    let isScrolling = false;
    let scrollRequest = null;

    const containerChord = document.getElementById('chord-content');
    const popup = document.getElementById('chord-popup');
    const chordDisplay = document.getElementById('chord-name-display');
    const diagramContainer = document.getElementById('chord-diagram-container');

    // === 2. FUNGSI DIAGRAM CHORD (SMART TOOLTIP) ===
    function initializeChords() {
        if (!containerChord) return;
        let rawText = containerChord.innerHTML;
        // Regex untuk mendeteksi kunci gitar
        const chordRegex = /\b([A-G][b#]?(maj|min|m|M|add|sus|dim|aug|maj7|7|m7|sus4)?[0-9]*)\b/g;
        
        // Membungkus chord dengan span agar bisa diklik
        containerChord.innerHTML = rawText.replace(chordRegex, '<span class="chord-node">$1</span>');

        // Menambahkan event klik pada setiap chord
        document.querySelectorAll('.chord-node').forEach(elem => {
            elem.addEventListener('click', function(e) {
                e.stopPropagation();
                const chordName = this.innerText;
                
                // Menghitung posisi koordinat chord yang diklik
                const rect = this.getBoundingClientRect();
                popup.style.display = 'block';
                
                // Set posisi popup tepat di atas chord (Horizontal Center)
                popup.style.left = (rect.left + window.scrollX - (130 / 2) + (rect.width / 2)) + 'px';
                popup.style.top = (rect.top + window.scrollY - 165) + 'px';

                chordDisplay.innerText = chordName;
                
                // Menyuntikkan elemen untuk library Chordicus
                diagramContainer.innerHTML = `<i class="chordicus" data-chord="${chordName}"></i>`;
                
                // Menjalankan perintah gambar diagram
                if(window.Chordicus) window.Chordicus.render();
            });
        });
    }

    // Menutup popup jika klik di area lain
    document.addEventListener('click', function(e) {
        if (popup && !popup.contains(e.target)) {
            popup.style.display = 'none';
        }
    });

    // === 3. FUNGSI TRANSPOSE (Nada Dasar) ===
    window.transpose = function(steps) {
        currentPitch += steps;
        document.getElementById('pitch-indicator').innerText = currentPitch;
        
        document.querySelectorAll('.chord-node').forEach(el => {
            let currentName = el.innerText;
            el.innerText = shiftChord(currentName, steps);
        });
    };

    function shiftChord(chord, steps) {
        return chord.replace(/[A-G][#b]?/g, function(match) {
            let i = notes.indexOf(match);
            if (i === -1) i = notes.indexOf(match.charAt(0) + (match.length > 1 ? (match.charAt(1) === 'b' ? '#' : 'b') : ''));
            if (i === -1) return match;
            let newI = (i + steps) % 12;
            while (newI < 0) newI += 12;
            return notes[newI];
        });
    }

    window.resetTranspose = function() {
        transpose(-currentPitch);
        currentPitch = 0;
        document.getElementById('pitch-indicator').innerText = "0";
    };

    // === 4. LOGIKA ZOOM DUA JARI (TETAP ASLI) ===
    // Saya tidak mengubah bagian ini agar fitur zoom box Anda tetap bekerja sempurna
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
                if (newScale > 0.6 && newScale < 3) {
                    el.style.fontSize = `${baseFontSize * newScale}px`;
                }
            }
        }, { passive: false });

        el.addEventListener('touchend', (e) => {
            const currentFontSize = parseFloat(window.getComputedStyle(el).fontSize);
            scale = currentFontSize / baseFontSize;
        });
    }

    // === 5. LOGIKA AUTOSCROLL (TETAP ASLI) ===
    // ... (Masukkan sisa kode autoscroll Anda di sini) ...

    // Jalankan inisialisasi chord saat halaman siap
    initializeChords();
});
    
