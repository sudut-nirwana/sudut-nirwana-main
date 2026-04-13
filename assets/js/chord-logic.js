document.addEventListener("DOMContentLoaded", function() {
    
    // === 1. VARIABEL GLOBAL ===
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    let currentPitch = 0;
    let isScrolling = false;
    let scrollRequest = null;

    // Elemen UI
    const containerChord = document.getElementById('chord-content');
    const autoscrollContainer = document.getElementById('autoscroll-container');
    const triggerScroll = document.getElementById('scroll-trigger');
    const textScroll = document.getElementById('trigger-text');
    const slider = document.getElementById('speed-slider');
    const btnPlus = document.getElementById('btn-plus');
    const btnMinus = document.getElementById('btn-minus');
    const pitchIndicator = document.getElementById('pitch-indicator');
    
    // Elemen Popup Diagram
    const popup = document.getElementById('chord-popup');
    const chordDisplay = document.getElementById('chord-name-display');
    const diagramContainer = document.getElementById('chord-diagram-container');

    // === 2. FUNGSI DIAGRAM & INITIALIZE ===
    /**
     * Membungkus teks chord agar bisa diklik dan di-transpose
     */
    function initializeChords() {
        if (!containerChord) return;
        let rawText = containerChord.innerHTML;
        const chordRegex = /\b([A-G][b#]?(maj|min|m|M|add|sus|dim|aug|maj7|7|m7|sus4)?[0-9]*)\b/g;
        
        containerChord.innerHTML = rawText.replace(chordRegex, '<span class="chord-node">$1</span>');

        // Event Klik untuk Diagram
        document.querySelectorAll('.chord-node').forEach(elem => {
            elem.addEventListener('click', function(e) {
                e.stopPropagation();
                const chordName = this.innerText;
                const rect = this.getBoundingClientRect();
                
                if (popup) {
                    popup.style.display = 'block';
                    popup.style.left = (rect.left + window.scrollX - 65 + (rect.width / 2)) + 'px';
                    popup.style.top = (rect.top + window.scrollY - 170) + 'px';
                    chordDisplay.innerText = chordName;
                    
                    // Render Diagram Chordicus
                    diagramContainer.innerHTML = `<i class="chordicus" data-chord="${chordName}"></i>`;
                    if(window.Chordicus) window.Chordicus.render();
                }
            });
        });
    }

    // Tutup popup jika klik di luar
    document.addEventListener('click', (e) => {
        if (popup && !popup.contains(e.target)) popup.style.display = 'none';
    });

    // === 3. FUNGSI TRANSPOSE ===
    window.transpose = function(steps) {
        currentPitch += steps;
        if (pitchIndicator) pitchIndicator.innerText = (currentPitch > 0 ? '+' : '') + currentPitch;
        
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
        if (pitchIndicator) pitchIndicator.innerText = '0';
    };

    // === 4. FUNGSI AUTOSCROLL (FIXED) ===
    function updateScroll() {
        if (!isScrolling) return;
        const speeds = { 1: 0.3, 2: 0.7, 3: 1.2, 4: 2.0, 5: 3.5 };
        const speed = speeds[parseInt(slider.value)] || 1;
        window.scrollBy(0, speed);
        scrollRequest = requestAnimationFrame(updateScroll);
    }

    function startScroll() {
        isScrolling = true;
        autoscrollContainer.classList.add('active');
        textScroll.innerHTML = '<i class="fas fa-stop"></i>';
        updateScroll();
    }

    function stopScroll() {
        isScrolling = false;
        autoscrollContainer.classList.remove('active');
        textScroll.innerHTML = '<i class="fas fa-gear"></i>';
        cancelAnimationFrame(scrollRequest);
    }

    if (triggerScroll) {
        triggerScroll.addEventListener('click', () => {
            const isOpen = autoscrollContainer.classList.toggle('open');
            if (isOpen) startScroll(); else stopScroll();
        });
    }

    // Tombol speed tetap bekerja
    if (btnPlus) btnPlus.addEventListener('click', (e) => { 
        e.stopPropagation(); 
        if (parseInt(slider.value) < 5) slider.value = parseInt(slider.value) + 1; 
    });
    if (btnMinus) btnMinus.addEventListener('click', (e) => { 
        e.stopPropagation(); 
        if (parseInt(slider.value) > 1) slider.value = parseInt(slider.value) - 1; 
    });

    // === 5. LOGIKA ZOOM DUA JARI ===
    const el = containerChord;
    let scale = 1, initialDist = 0;
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

        el.addEventListener('touchend', () => {
            scale = parseFloat(window.getComputedStyle(el).fontSize) / baseFontSize;
        });
    }

    // Jalankan inisialisasi
    initializeChords();
});
                    
