document.addEventListener("DOMContentLoaded", function() {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    let currentPitch = 0;
    let isScrolling = false;
    let scrollRequest = null;

    const containerChord = document.getElementById('chord-content');
    const popup = document.getElementById('chord-popup');
    const chordDisplay = document.getElementById('chord-name-display');
    const diagramContainer = document.getElementById('chord-diagram-container');
    const autoscrollContainer = document.getElementById('autoscroll-container');
    const textScroll = document.getElementById('trigger-text');
    const slider = document.getElementById('speed-slider');

    // === FUNGSI DIAGRAM CHORD ===
    function showDiagram(elem) {
        const chordName = elem.innerText.trim();
        const rect = elem.getBoundingClientRect();
        
        popup.style.display = 'block';
        popup.style.left = (rect.left + window.scrollX - 65 + (rect.width / 2)) + 'px';
        popup.style.top = (rect.top + window.scrollY - 175) + 'px';
        
        chordDisplay.innerText = chordName;
        // Menggunakan API Gambar (Paling Stabil)
        const apiName = chordName.replace('#', 's');
        diagramContainer.innerHTML = `<img src="https://chordgenerator.net/${apiName}.png?size=2" alt="${chordName}">`;
    }

    function initializeChords() {
        if (!containerChord) return;
        let rawText = containerChord.innerHTML;
        const chordRegex = /\b([A-G][b#]?(maj|min|m|M|add|sus|dim|aug|maj7|7|m7|sus4)?[0-9]*)\b/g;
        containerChord.innerHTML = rawText.replace(chordRegex, '<span class="chord-node">$1</span>');

        document.querySelectorAll('.chord-node').forEach(node => {
            node.addEventListener('click', (e) => {
                e.stopPropagation();
                showDiagram(node);
            });
        });
    }

    // Tutup popup jika klik luar
    document.addEventListener('click', (e) => {
        if (popup && !popup.contains(e.target)) popup.style.display = 'none';
    });

    // === FUNGSI AUTOSCROLL (FIXED Tanpa jQuery Conflict) ===
    function updateScroll() {
        if (!isScrolling) return;
        const speeds = { 1: 0.3, 2: 0.7, 3: 1.2, 4: 2.0, 5: 3.5 };
        window.scrollBy(0, speeds[slider.value] || 1);
        scrollRequest = requestAnimationFrame(updateScroll);
    }

    window.toggleScroll = function() {
        const isOpen = autoscrollContainer.classList.toggle('open');
        if (isOpen) {
            isScrolling = true;
            autoscrollContainer.classList.add('active');
            textScroll.innerHTML = '<i class="fas fa-stop"></i>';
            updateScroll();
        } else {
            isScrolling = false;
            autoscrollContainer.classList.remove('active');
            textScroll.innerHTML = '<i class="fas fa-gear"></i>';
            cancelAnimationFrame(scrollRequest);
        }
    };

    document.getElementById('scroll-trigger').addEventListener('click', window.toggleScroll);

    // Tetapkan fungsi transpose Anda
    window.transpose = function(steps) {
        currentPitch += steps;
        document.getElementById('pitch-indicator').innerText = (currentPitch > 0 ? '+' : '') + currentPitch;
        document.querySelectorAll('.chord-node').forEach(node => {
            node.innerText = shiftChord(node.innerText, steps);
        });
    };

    function shiftChord(chord, steps) {
        return chord.replace(/[A-G][b#]?/g, (match) => {
            let i = notes.indexOf(match);
            if (i === -1) {
                const flats = { 'Bb': 10, 'Eb': 3, 'Ab': 8, 'Db': 1, 'Gb': 6 };
                i = flats[match] !== undefined ? flats[match] : -1;
            }
            if (i === -1) return match;
            let newI = (i + steps) % 12;
            while (newI < 0) newI += 12;
            return notes[newI];
        });
    }

    window.resetTranspose = function() {
        transpose(-currentPitch);
        currentPitch = 0;
        document.getElementById('pitch-indicator').innerText = '0';
    };

    // Eksekusi
    initializeChords();
});
