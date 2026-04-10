document.addEventListener("DOMContentLoaded", function () {

    const scale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const sheet = document.getElementById("chord-sheet");
    
    // Simpan teks asli tanpa HTML untuk proses transpose
    const originalRawText = sheet.innerText; 
    let offset = 0;

    // 1. FUNGSI MEWARNAI CHORD OTOMATIS (Tanpa <b> di MD)
    function highlightChords(text) {
        const chordRegex = /\b([A-G][#b]?)(m|7|maj7|sus\d|dim|add\d)?\b/g;
        return text.replace(chordRegex, '<span class="c-h">$1$2</span>');
    }

    // Tampilkan awal dengan warna
    sheet.innerHTML = highlightChords(originalRawText);

    // 2. YOUTUBE TOGGLE LOGIC
    const videoToggle = document.getElementById("video-toggle");
    const videoContent = document.getElementById("video-content");
    
    videoToggle.addEventListener("click", function() {
        videoContent.classList.toggle("show");
        const icon = this.querySelector(".toggle-icon");
        icon.innerText = videoContent.classList.contains("show") ? "▲" : "▼";
    });

    // 3. TRANSPOSE LOGIC (Disesuaikan agar tetap berwarna)
    function transpose(delta) {
        offset = (offset + delta + 12) % 12;
        const chordRegex = /\b([A-G][#b]?)(m|7|maj7|sus\d|dim|add\d)?\b/g;

        const transposedText = originalRawText.replace(chordRegex, (match, note, suffix) => {
            if (note.endsWith('b')) {
                const map = {'Db':'C#', 'Eb':'D#', 'Gb':'F#', 'Ab':'G#', 'Bb':'A#'};
                note = map[note] || note;
            }
            let idx = scale.indexOf(note);
            if (idx === -1) return match;
            let newIdx = (idx + offset + 12) % 12;
            return scale[newIdx] + (suffix || "");
        });

        sheet.innerHTML = highlightChords(transposedText);
        
        // Update Label Key
        const currentKeyDisplay = document.getElementById("current-key");
        let currentIdx = (scale.indexOf(currentKeyDisplay.innerText) + delta + 12) % 12;
        currentKeyDisplay.innerText = scale[currentIdx];
        
        generateDiagrams();
    }

    // 4. DETEKSI NADA DASAR (Initial)
    function initKey() {
        const firstChordMatch = originalRawText.match(/\b([A-G][#b]?m?7?|maj7?|sus\d?|dim?)\b/);
        if (firstChordMatch) {
            let baseNote = firstChordMatch[1].match(/[A-G][#b]?/)[0];
            const flatMap = {'Db':'C#', 'Eb':'D#', 'Gb':'F#', 'Ab':'G#', 'Bb':'A#'};
            if (baseNote.endsWith('b')) baseNote = flatMap[baseNote] || baseNote;
            document.getElementById("current-key").innerText = baseNote;
        }
    }

    // ... (Fungsi Scroll, Speed, dan Diagram tetap sama namun gunakan innerHTML untuk Diagram)
    
    document.getElementById("inc-ch").onclick = () => transpose(1);
    document.getElementById("dec-ch").onclick = () => transpose(-1);

    initKey();
    generateDiagrams(); // Panggil fungsi diagram (pastikan fungsi ini ada seperti code sebelumnya)
});

// Re-pasting generateDiagrams agar utuh
function generateDiagrams() {
    const container = document.getElementById("chord-images-container");
    const chords = [...new Set(document.getElementById("chord-sheet").innerText.match(/\b([A-G][#b]?m?7?|maj7?|sus\d?|dim?)\b/g))];
    container.innerHTML = "";
    if(chords) {
        chords.forEach(c => {
            const name = c.replace("#", "sharp");
            container.innerHTML += `<div class="chord-box-img"><img src="/assets/img/chords/${name}.webp" onerror="this.remove()"><p>${c}</p></div>`;
        });
    }
}
