document.addEventListener("DOMContentLoaded", function() {
    
    // === 1. LOGIKA MENGGAMBAR DIAGRAM KUNCI ===
    const diagramContainer = document.getElementById('chord-diagrams');
    
    // songChords diambil dari variabel yang kita lempar di layout tadi
    if (typeof songChords !== 'undefined' && songChords && diagramContainer) {
        songChords.forEach(chordName => {
            const box = document.createElement('div');
            box.className = 'chord-box';
            
            // Tambahkan Label Nama Chord
            const label = document.createElement('span');
            label.innerText = chordName;
            box.appendChild(label);
            
            // Buat Canvas untuk menggambar
            const canvas = document.createElement('canvas');
            canvas.width = 50;  // Ukuran sesuai request kamu
            canvas.height = 60;
            box.appendChild(canvas);
            
            diagramContainer.appendChild(box);
            
            // Gambar diagram menggunakan ChordCanvas
            // Warna oranye #ff9800 agar senada
            ChordCanvas.draw(canvas, chordName, {
                strokeColor: '#444',
                stringColor: '#888',
                fretColor: '#888',
                labelColor: '#ff9800',
                dotColor: '#ff9800',
                textColor: '#fff'
            });
        });
    }

    // === 2. LOGIKA AUTO SCROLL ===
    let scrollInterval;
    window.autoScroll = function() {
        if (scrollInterval) return; // Cegah double klik
        scrollInterval = setInterval(() => {
            window.scrollBy(0, 1);
        }, 50); // Kecepatan scroll (makin kecil makin cepat)
    };

    window.stopScroll = function() {
        clearInterval(scrollInterval);
        scrollInterval = null;
    };

    // === 3. LOGIKA TRANSPOSE (SEDERHANA) ===
    // Ini fungsi dasar untuk menaikkan/menurunkan nada
    window.transpose = function(n) {
        const chords = document.querySelectorAll('.chord-content b');
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        
        chords.forEach(el => {
            let chord = el.innerText;
            // Ambil nada dasar (misal Am -> A)
            let res = chord.match(/^([A-G][#b]?)(.*)/);
            if (!res) return;
            
            let note = res[1];
            let suffix = res[2];
            
            let index = notes.indexOf(note);
            if (index !== -1) {
                let newIndex = (index + n + 12) % 12;
                el.innerText = notes[newIndex] + suffix;
            }
        });
    };
});
