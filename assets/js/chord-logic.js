document.addEventListener("DOMContentLoaded", function() {
    
    // === 1. VARIABEL GLOBAL ===
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    let currentPitch = 0;
    let isScrolling = false;
    let scrollRequest = null;

    // Elemen UI
    const containerChord = document.getElementById('chord-content');
    const widgetElement = document.getElementById('bt-element');
    const wrapper = document.getElementById('bt-widget-wrapper');
    const pitchIndicator = document.getElementById('pitch-indicator');
    
    // Elemen Kontrol Scroll
    const autoscrollContainer = document.getElementById('autoscroll-container');
    const slider = document.getElementById('speed-slider');
    const triggerScroll = document.getElementById('scroll-trigger');
    const textScroll = document.getElementById('trigger-text');
    const btnPlus = document.getElementById('btn-plus');
    const btnMinus = document.getElementById('btn-minus');

    // === 2. FUNGSI TRANSPOSE & PEMBUNGKUS ===
    window.transpose = function(n) {
        if (!containerChord) return;
        currentPitch += n;
        
        let text = containerChord.innerText;
        const chordRegex = /\b([A-G][b#]?(m|maj|7|sus|dim|add)?\d?)\b/g;

        let processed = text.replace(chordRegex, function(match) {
            let baseMatch = match.match(/[A-G][b#]?/);
            if (!baseMatch) return match;
            
            let baseNote = baseMatch[0];
            let suffix = match.replace(baseNote, '');
            let index = notes.indexOf(baseNote);
            
            if (index === -1) return match;

            let newIndex = (index + n + 12) % 12;
            let newNote = notes[newIndex] + suffix;

            return `<span class="chord-node">${newNote}</span>`;
        });

        containerChord.innerHTML = processed;
        if (pitchIndicator) pitchIndicator.innerText = (currentPitch > 0 ? "+" : "") + currentPitch;
    };

    // === 3. EKSEKUSI AWAL ===
    if (widgetElement && wrapper) {
        const artist = widgetElement.getAttribute('data-artist-name');
        wrapper.style.display = (!artist || artist.includes("{{")) ? 'none' : 'block';
    }

    // Jalankan transpose(0) agar chord langsung aktif
    transpose(0);

    // === 4. FITUR ZOOM AREA (TOUCH) ===
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
            if (newScale > 0.6 && newScale < 3) {
                containerChord.style.fontSize = `${baseFontSize * newScale}px`;
            }
        }
    }, { passive: false });

    containerChord.addEventListener('touchend', () => {
        const fs = window.getComputedStyle(containerChord).fontSize;
        scale = parseFloat(fs) / baseFontSize;
    });

    // === 5. LOGIKA AUTOSCROLL (DIPERBAIKI) ===
    function autoScroll() {
        if (!isScrolling) return;
        let speed = parseFloat(slider.value) || 1;
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

    // Kontrol tombol Plus/Minus untuk Slider
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

window.resetTranspose = () => location.reload();
                    
