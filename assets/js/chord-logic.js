document.addEventListener("DOMContentLoaded", function() {
    
    // 1. LOGIKA DIAGRAM KUNCI
    const container = document.getElementById('chord-diagrams');
    // Cek apakah songChords ada (dikirim dari Jekyll)
    if (typeof songChords !== 'undefined' && container) {
        songChords.forEach(chord => {
            const box = document.createElement('div');
            box.className = 'chord-box';
            box.style.width = "50px";
            box.style.textAlign = "center";
            
            const label = document.createElement('div');
            label.innerText = chord;
            label.style.fontSize = "11px";
            label.style.fontWeight = "bold";
            label.style.color = "#333";

            const canvas = document.createElement('canvas');
            canvas.width = 50;
            canvas.height = 60;

            box.appendChild(label);
            box.appendChild(canvas);
            container.appendChild(box);

            // Gambar diagram menggunakan library ChordCanvas
            if (window.ChordCanvas) {
                ChordCanvas.draw(canvas, chord, {
                    strokeColor: '#444',
                    dotColor: '#ff9800',
                    stringColor: '#888',
                    fretColor: '#888'
                });
            }
        });
    }

    // 2. LOGIKA TRANSPOSE
    window.transpose = function(n) {
        const chords = document.querySelectorAll('.chord-content b');
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        
        chords.forEach(el => {
            let chord = el.innerText;
            let res = chord.match(/^([A-G][#b]?)(.*)/);
            if (!res) return;
            
            let note = res[1];
            let suffix = res[2];
            
            // Konversi flat (b) ke sharp (#) agar terbaca di array notes
            if (note.endsWith('b')) {
                const flatMap = { 'Db':'C#', 'Eb':'D#', 'Gb':'F#', 'Ab':'G#', 'Bb':'A#' };
                note = flatMap[note] || note;
            }

            let index = notes.indexOf(note);
            if (index !== -1) {
                let newIndex = (index + n + 12) % 12;
                el.innerText = notes[newIndex] + suffix;
            }
        });
    };

    // 3. LOGIKA AUTO SCROLL
    let scrollInterval;
    window.autoScroll = function() {
        if (scrollInterval) return;
        scrollInterval = setInterval(() => {
            window.scrollBy(0, 1);
        }, 40); // Kecepatan scroll
    };

    window.stopScroll = function() {
        clearInterval(scrollInterval);
        scrollInterval = null;
    };
});
