document.addEventListener("DOMContentLoaded", function () {
    const scale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const sheet = document.getElementById("chord-sheet");
    const rawContent = sheet.innerText.trim();
    let offset = 0;

    // 1. Fungsi Mewarnai Chord Otomatis
    function colorize(text) {
        const chordRegex = /\b([A-G][#b]?)(m|7|maj7|sus\d|dim|add\d)?\b/g;
        return text.replace(chordRegex, '<span class="c-h">$1$2</span>');
    }

    // Tampilkan awal
    sheet.innerHTML = colorize(rawContent);

    // 2. Video Toggle
    const vToggle = document.getElementById("video-toggle");
    const vContent = document.getElementById("video-content");
    vToggle.onclick = () => {
        const show = vContent.classList.toggle("show");
        vToggle.querySelector(".v-arrow").innerText = show ? "▲" : "▼";
    };

    // 3. Tab Panel
    const tabs = document.querySelectorAll(".tab-item");
    tabs.forEach(t => {
        t.onclick = () => {
            tabs.forEach(item => item.classList.remove("active"));
            document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
            t.classList.add("active");
            document.querySelector(".panel-content").classList.add("show");
            document.getElementById("pane-" + t.dataset.target).classList.add("active");
        };
    });

    // 4. Transpose
    function transpose(delta) {
        offset = (offset + delta + 12) % 12;
        const chordRegex = /\b([A-G][#b]?)(m|7|maj7|sus\d|dim|add\d)?\b/g;

        const transposed = rawContent.replace(chordRegex, (match, note, suffix) => {
            const flatMap = {'Db':'C#', 'Eb':'D#', 'Gb':'F#', 'Ab':'G#', 'Bb':'A#'};
            if (note.endsWith('b')) note = flatMap[note] || note;
            let idx = scale.indexOf(note);
            if (idx === -1) return match;
            return scale[(idx + offset + 12) % 12] + (suffix || "");
        });

        sheet.innerHTML = colorize(transposed);
        
        // Update Label Key
        const keyEl = document.getElementById("current-key");
        let newIdx = (scale.indexOf(keyEl.innerText) + delta + 12) % 12;
        keyEl.innerText = scale[newIdx];
        generateDiagrams();
    }

    document.getElementById("inc-ch").onclick = () => transpose(1);
    document.getElementById("dec-ch").onclick = () => transpose(-1);

    // Inisialisasi Key Awal
    const firstChord = rawContent.match(/\b([A-G][#b]?m?7?|maj7?|sus\d?|dim?)\b/);
    if (firstChord) {
        document.getElementById("current-key").innerText = firstChord[1].replace('b', '#');
    }

    generateDiagrams();
});

function generateDiagrams() {
    const container = document.getElementById("chord-images-container");
    const chords = [...new Set(document.getElementById("chord-sheet").innerText.match(/\b([A-G][#b]?m?7?|maj7?|sus\d?|dim?)\b/g))];
    container.innerHTML = "";
    if(chords) {
        chords.forEach(c => {
            const name = c.replace("#", "sharp");
            container.innerHTML += `<div class="chord-box-img"><img src="/assets/img/chords/${name}.webp" onerror="this.parentElement.remove()"><p>${c}</p></div>`;
        });
    }
}
