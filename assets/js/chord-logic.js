document.addEventListener("DOMContentLoaded", function() {
    
    // FUNGSI UTAMA UNTUK MENGGAMBAR
    function drawChordDiagrams() {
        const container = document.getElementById('chord-diagrams');
        
        // Cek data dan elemen wadah
        if (typeof songChords === 'undefined' || !songChords || !container) {
            console.warn("Data songChords atau wadah #chord-diagrams tidak ditemukan.");
            return;
        }

        // Cek apakah library ChordCanvas sudah siap
        if (!window.ChordCanvas) {
            console.error("Library ChordCanvas belum ter-load.");
            return;
        }

        // Bersihkan wadah jika sudah ada isinya (mencegah duplikat)
        container.innerHTML = '';

        // Looping data kunci dari Jekyll
        songChords.forEach(chordName => {
            const box = document.createElement('div');
            box.className = 'chord-box';
            box.style.width = "50px";
            box.style.textAlign = "center";
            box.style.display = "inline-block";
            box.style.marginRight = "5px";
            
            const label = document.createElement('div');
            label.innerText = chordName;
            label.style.fontSize = "12px";
            label.style.fontWeight = "bold";
            label.style.color = "#333";
            label.style.marginBottom = "3px";

            const canvas = document.createElement('canvas');
            canvas.width = 50;
            canvas.height = 60;

            box.appendChild(label);
            box.appendChild(canvas);
            container.appendChild(box);

            // Coba gambar
            try {
                window.ChordCanvas.draw(canvas, chordName, {
                    strokeColor: '#444',
                    dotColor: '#ff9800', // Warna titik jari oranye
                    stringColor: '#888',
                    fretColor: '#888',
                    textColor: '#fff'
                });
            } catch (e) {
                console.error("Gagal menggambar chord:", chordName, e);
            }
        });
    }

    // Eksekusi fungsi gambar setelah halaman & library siap
    // Kita tambahkan jeda kecil (setTimeout) sebagai pengaman load library
    setTimeout(drawChordDiagrams, 300); 

    // === LOGIKA TRANSPOSE & SCROLL (SAMA SEPERTI SEBELUMNYA) ===
    window.transpose = function(n) {
        const chords = document.querySelectorAll('.chord-content b');
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        chords.forEach(el => {
            let chord = el.innerText;
            let res = chord.match(/^([A-G][#b]?)(.*)/);
            if (!res) return;
            let note = res[1];
            let suffix = res[2];
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

    let scrollInterval;
    window.autoScroll = function() {
        if (scrollInterval) return;
        scrollInterval = setInterval(() => { window.scrollBy(0, 1); }, 40);
    };

    window.stopScroll = function() {
        clearInterval(scrollInterval);
        scrollInterval = null;
    };
});
