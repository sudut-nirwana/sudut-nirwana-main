document.addEventListener("DOMContentLoaded", function() {
    
    // Fungsi untuk menggambar (diisolasi agar bisa dipanggil nanti)
    function initializeChordDiagrams() {
        const container = document.getElementById('chord-diagrams');
        
        // Cek data dan elemen wadah
        if (typeof songChords === 'undefined' || !songChords || songChords.length === 0 || !container) {
            console.log("Data kunci tidak ada atau wadah #chord-diagrams tidak ditemukan.");
            return;
        }

        // Cek apakah library ChordCanvas sudah siap (krusial!)
        if (!window.ChordCanvas) {
            console.error("Library ChordCanvas belum siap.");
            return;
        }

        // Bersihkan wadah agar tidak double saat hard refresh
        container.innerHTML = '';

        // Looping untuk membuat elemen canvas dan menggambar
        songChords.forEach(chord => {
            const box = document.createElement('div');
            box.className = 'chord-box';
            box.style.width = "50px";
            box.style.textAlign = "center";
            box.style.display = "inline-block"; // Membuatnya berbaris ke samping
            box.style.marginRight = "8px"; // Memberi jarak antar kotak

            const label = document.createElement('div');
            label.innerText = chord;
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

            // Coba menggambar dengan library
            try {
                // Kita tambahkan jeda lagi di sini untuk memastikan library siap
                requestAnimationFrame(() => {
                    window.ChordCanvas.draw(canvas, chord, {
                        strokeColor: '#444',
                        dotColor: '#ff9800' // Titik jari oranye khas Sudut Nirwana
                    });
                });
            } catch (error) {
                console.error("Gagal menggambar kunci:", chord, error);
            }
        });
    }

    // Eksekusi fungsi gambar dengan jeda 200ms (safety time)
    // Trik ini sering berhasil mengatasi masalah load di mobile
    setTimeout(initializeChordDiagrams, 200);

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
