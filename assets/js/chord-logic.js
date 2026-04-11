document.addEventListener("DOMContentLoaded", function() {
    
    // === 1. INISIALISASI VARIABEL GLOBAL ===
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    let currentPitch = 0;
    let isScrolling = false;
    let scrollRequest = null;

    // Elemen UI
    const widgetElement = document.getElementById('bt-element');
    const wrapper = document.getElementById('bt-widget-wrapper');
    const containerChord = document.getElementById('chord-content');
    const autoscrollContainer = document.getElementById('autoscroll-container');
    const triggerScroll = document.getElementById('scroll-trigger');
    const textScroll = document.getElementById('trigger-text');
    const slider = document.getElementById('speed-slider');
    const btnPlus = document.getElementById('btn-plus');
    const btnMinus = document.getElementById('btn-minus');
    const pitchIndicator = document.getElementById('pitch-indicator');

    // === 2. FUNGSI WIDGET CHECKER ===
    // Mengecek apakah widget artis harus ditampilkan atau disembunyikan
    function checkArtistWidget() {
        if (widgetElement && wrapper) {
            const artistName = widgetElement.getAttribute('data-artist-name');
            if (!artistName || artistName.trim() === "" || artistName.includes("{{")) {
                wrapper.style.display = 'none';
            } else {
                wrapper.style.display = 'block';
            }
        }
    }

    // === 3. FUNGSI MANAJEMEN CHORD & TRANSPOSE ===

    /**
     * Mendeteksi teks chord di dalam kontainer lirik dan membungkusnya dengan span
     */
    function initializeChords() {
        if (!containerChord) return;
        let rawText = containerChord.innerHTML;
        // Regex untuk mendeteksi chord (A-G) dengan variasi minor, mayor, angka, dll.
        const chordRegex = /\b([A-G][b#]?(maj|min|m|M|add|sus|dim|aug|maj7|7|m7|sus4)?[0-9]*)\b/g;
        
        // Membungkus chord agar bisa dimanipulasi oleh fungsi transpose
        containerChord.innerHTML = rawText.replace(chordRegex, '<span class="chord-node">$1</span>');
    }

    /**
     * Menggeser nada berdasarkan langkah (steps) yang ditentukan
     */
    window.transpose = function(steps) {
        currentPitch += steps;
        if (pitchIndicator) {
            pitchIndicator.innerText = (currentPitch > 0 ? '+' : '') + currentPitch;
        }
        
        const chordNodes = document.querySelectorAll('.chord-node');
        chordNodes.forEach(node => {
            node.innerText = shiftChord(node.innerText, steps);
        });
    };

    /**
     * Logika matematika untuk mengubah string chord ke nada baru
     */
    function shiftChord(chord, steps) {
        return chord.replace(/[A-G][b#]?/g, function(match) {
            let i = notes.indexOf(match);
            // Penanganan khusus untuk nada Flat (b) yang tidak ada di array Sharp (#)
            if (i === -1) {
                const flats = { 'Bb': 10, 'Eb': 3, 'Ab': 8, 'Db': 1, 'Gb': 6 };
                i = flats[match] !== undefined ? flats[match] : -1;
            }
            if (i === -1) return match; // Jika tidak ketemu, biarkan tetap

            // Rumus modulo 12 untuk rotasi nada musik
            let newIndex = (i + steps) % 12;
            while (newIndex < 0) newIndex += 12; 
            return notes[newIndex];
        });
    }

    /**
     * Mengembalikan nada ke posisi awal (0)
     */
    window.resetTranspose = function() {
        transpose(-currentPitch);
        currentPitch = 0;
        if (pitchIndicator) pitchIndicator.innerText = '0';
    };

    // === 4. FUNGSI AUTOSCROLL ===

    /**
     * Menjalankan animasi scroll halus menggunakan requestAnimationFrame
     */
    function updateScroll() {
        if (!isScrolling) return;

        const speeds = {
            1: 0.3, 2: 0.7, 3: 1.2, 4: 2.0, 5: 3.5 
        };
        
        const speed = speeds[parseInt(slider.value)] || 1;
        window.scrollBy(0, speed);
        scrollRequest = requestAnimationFrame(updateScroll);
    }

    /**
     * Mulai proses scroll
     */
    function startScroll() {
        isScrolling = true;
        if (autoscrollContainer) autoscrollContainer.classList.add('active');
        if (textScroll) {
            $(textScroll).html('<i class="fas fa-stop"></i>').css({ fontSize: "1.2rem" });
        }
        updateScroll();
    }

    /**
     * Berhenti dari proses scroll
     */
    function stopScroll() {
        isScrolling = false;
        if (autoscrollContainer) autoscrollContainer.classList.remove('active');
        if (textScroll) {
            $(textScroll).html('<i class="fas fa-cog"></i>').css({ fontSize: "1.2rem" });
        }
        cancelAnimationFrame(scrollRequest);
    }

    // === 5. EVENT LISTENERS ===

    // Tombol Toggle Auto Scroll
    if (triggerScroll) {
        triggerScroll.addEventListener('click', () => {
            const isOpen = autoscrollContainer.classList.toggle('open');
            if (isOpen) startScroll(); else stopScroll();
        });
    }

    // Tombol Kecepatan (+)
    if (btnPlus) {
        btnPlus.addEventListener('click', (e) => {
            e.stopPropagation();
            let val = parseInt(slider.value);
            if (val < 5) slider.value = val + 1;
        });
    }

    // Tombol Kecepatan (-)
    if (btnMinus) {
        btnMinus.addEventListener('click', (e) => {
            e.stopPropagation();
            let val = parseInt(slider.value);
            if (val > 1) slider.value = val - 1;
        });
    }

    // === 6. EKSEKUSI AWAL ===
    checkArtistWidget();
    initializeChords();

});
