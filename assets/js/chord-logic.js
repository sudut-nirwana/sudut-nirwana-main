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

    // === 3. FUNGSI TRANSPOSE & PEMBUNGKUS CHORD ===
    window.transpose = function(n) {
        if (!containerChord) return;
        
        // Update nilai pitch global
        currentPitch += n;
        
        // Ambil isi konten saat ini
        let content = containerChord.innerHTML;
        
        // Regex untuk mencari Chord (A-G, #, b, m, 7, maj, dsb)
        // Kita gunakan pengenalan pola yang tidak merusak tag span yang sudah ada
        const chordRegex = /\b([A-G][b#]?(m|maj|7|sus|dim|add)?\d?)\b/g;

        // Proses penggantian teks menjadi span yang bisa diklik
        let newContent = content.replace(chordRegex, function(match) {
            // Ekstrak nada dasar (misal dari Am7 ambil A)
            let baseMatch = match.match(/[A-G][b#]?/);
            if (!baseMatch) return match;
            
            let baseNote = baseMatch[0];
            let suffix = match.replace(baseNote, '');
            
            let index = notes.indexOf(baseNote);
            if (index === -1) return match;

            // Hitung nada baru
            let newIndex = (index + n + 12) % 12;
            let newNote = notes[newIndex] + suffix;

            // Bungkus dengan class chord-node untuk dideteksi chord-generator.js
            return `<span class="chord-node">${newNote}</span>`;
        });

        containerChord.innerHTML = newContent;
        
        if (pitchIndicator) {
            pitchIndicator.innerText = (currentPitch > 0 ? "+" : "") + currentPitch;
        }
    };

    // === 4. EKSEKUSI AWAL ===
    checkArtistWidget();
    
    // PENTING: Jalankan transpose(0) agar saat halaman dimuat, 
    // lirik langsung di-scan dan chord dibungkus span agar bisa diklik.
    transpose(0);

    // === 5. FITUR ZOOM AREA (TOUCH GESTURE) ===
    let initialDist = 0;
    let scale = 1;
    const baseFontSize = 15;

    containerChord.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            initialDist = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );
        }
    }, { passive: true });

    containerChord.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            if (e.cancelable) e.preventDefault(); 
            const currentDist = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );
            const diff = currentDist / initialDist;
            let newScale = scale * diff;
            
            // Batasan zoom minimal dan maksimal
            if (newScale > 0.6 && newScale < 3) {
                containerChord.style.fontSize = `${baseFontSize * newScale}px`;
            }
        }
    }, { passive: false });

    containerChord.addEventListener('touchend', (e) => {
        const style = window.getComputedStyle(containerChord).getPropertyValue('font-size');
        scale = parseFloat(style) / baseFontSize;
    });

    // === 6. FITUR AUTOSCROLL ===
    function autoScroll() {
        if (!isScrolling) return;
        let speed = parseInt(slider.value);
        window.scrollBy(0, speed);
        scrollRequest = requestAnimationFrame(autoScroll);
    }

    if (triggerScroll) {
        triggerScroll.addEventListener('click', () => {
            isScrolling = !isScrolling;
            if (isScrolling) {
                textScroll.innerHTML = '<i class="fas fa-pause"></i>';
                autoscrollContainer.classList.add('active');
                autoScroll();
            } else {
                textScroll.innerHTML = '<i class="fas fa-gear"></i>';
                autoscrollContainer.classList.remove('active');
                cancelAnimationFrame(scrollRequest);
            }
        });
    }

    if (btnPlus) {
        btnPlus.addEventListener('click', () => {
            let val = parseInt(slider.value);
            if (val < 5) slider.value = val + 1;
        });
    }

    if (btnMinus) {
        btnMinus.addEventListener('click', () => {
            let val = parseInt(slider.value);
            if (val > 1) slider.value = val - 1;
        });
    }
});

// Fungsi Reset Nada (Global)
window.resetTranspose = function() {
    location.reload();
};
