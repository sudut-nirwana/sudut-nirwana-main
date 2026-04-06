const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function transposeChord(steps) {
    const chordElements = document.querySelectorAll('.chord-content b, .chord-content strong');
    
    chordElements.forEach(el => {
        let currentText = el.innerText;
        // Regex untuk menangkap kunci dasar (misal: Am7, C#m, G)
        el.innerText = currentText.replace(/[A-G][#b]?/g, (match) => {
            let index = notes.indexOf(match.replace('b', (m) => {
                // Konversi flat ke sharp agar sesuai array notes
                const flats = {'Bb':'A#', 'Eb':'D#', 'Ab':'G#', 'Db':'C#', 'Gb':'F#'};
                return flats[match] || match;
            }));
            
            if (index === -1) return match;
            
            let newIndex = (index + steps + 12) % 12;
            return notes[newIndex];
        });
    });
}

// Auto Scroll Logic
let scrollActive = false;
let scrollInterval;

function handleScroll(btn) {
    if (!scrollActive) {
        scrollInterval = setInterval(() => window.scrollBy(0, 1), 50);
        btn.innerText = "Stop";
        btn.style.background = "#e74c3c";
        scrollActive = true;
    } else {
        clearInterval(scrollInterval);
        btn.innerText = "Auto Scroll";
        btn.style.background = "#2c3e50";
        scrollActive = false;
    }
}
