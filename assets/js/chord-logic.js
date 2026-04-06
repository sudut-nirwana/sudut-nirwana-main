const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function transposeChord(steps) {
    // Ambil semua tag strong atau b di dalam wrapper
    const chords = document.querySelectorAll('.chord-content-wrapper strong, .chord-content-wrapper b');
    
    chords.forEach(el => {
        let text = el.innerText;
        // Ganti notasi kunci (C, Am, G7, D#m dll)
        el.innerText = text.replace(/[A-G][#b]?/g, (match) => {
            // Normalisasi Bb ke A#, dsb
            let note = match;
            if (note === 'Bb') note = 'A#';
            if (note === 'Eb') note = 'D#';
            if (note === 'Ab') note = 'G#';
            if (note === 'Db') note = 'C#';
            if (note === 'Gb') note = 'F#';

            let index = notes.indexOf(note);
            if (index === -1) return match;
            
            let newIndex = (index + steps + 12) % 12;
            return notes[newIndex];
        });
    });
}

let isScrolling = false;
let interval;

function toggleAutoScroll() {
    const btn = document.getElementById('scrollBtn');
    if (!isScrolling) {
        interval = setInterval(() => window.scrollBy(0, 1), 50);
        btn.innerText = "Stop";
        btn.style.background = "#e74c3c";
        isScrolling = true;
    } else {
        clearInterval(interval);
        btn.innerText = "Auto Scroll";
        btn.style.background = "#2c3e50";
        isScrolling = false;
    }
}
