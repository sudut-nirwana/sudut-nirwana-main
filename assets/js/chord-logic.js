document.addEventListener("DOMContentLoaded", function () {
    const scale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const sheet = document.getElementById("chord-sheet");
    const rawText = sheet.innerText.trim();
    let offset = 0;

    // 1. Highlight Chord Otomatis
    function applyStyle(text) {
        const chordRegex = /\b([A-G][#b]?)(m|7|maj7|sus\d|dim|add\d)?\b/g;
        return text.replace(chordRegex, '<span class="c-h">$1$2</span>');
    }
    sheet.innerHTML = applyStyle(rawText);

    // 2. Video Toggle
    const vToggle = document.getElementById("video-toggle");
    const vContent = document.getElementById("video-content");
    vToggle.onclick = () => {
        const isShow = vContent.classList.toggle("show");
        vToggle.querySelector(".v-icon").innerText = isShow ? "▲" : "▼";
    };

    // 3. Tab System
    const tabs = document.querySelectorAll(".t-item");
    tabs.forEach(tab => {
        tab.onclick = () => {
            tabs.forEach(t => t.classList.remove("active"));
            document.querySelectorAll(".t-pane").forEach(p => p.classList.remove("active"));
            tab.classList.add("active");
            document.getElementById("pane-" + tab.dataset.target).classList.add("active");
        };
    });

    // 4. Transpose Logic
    function transpose(delta) {
        offset = (offset + delta + 12) % 12;
        const chordRegex = /\b([A-G][#b]?)(m|7|maj7|sus\d|dim|add\d)?\b/g;
        
        const newText = rawText.replace(chordRegex, (match, note, suffix) => {
            const map = {'Db':'C#', 'Eb':'D#', 'Gb':'F#', 'Ab':'G#', 'Bb':'A#'};
            if (note.endsWith('b')) note = map[note] || note;
            let idx = scale.indexOf(note);
            if (idx === -1) return match;
            return scale[(idx + offset + 12) % 12] + (suffix || "");
        });

        sheet.innerHTML = applyStyle(newText);
        
        // Update Key Display
        const curKeyEl = document.getElementById("current-key");
        let curIdx = (scale.indexOf(curKeyEl.innerText) + delta + 12) % 12;
        curKeyEl.innerText = scale[curIdx];
        generateDiagrams();
    }

    document.getElementById("inc-ch").onclick = () => transpose(1);
    document.getElementById("dec-ch").onclick = () => transpose(-1);

    // 5. Inisialisasi Key Pertama
    const firstChord = rawText.match(/\b([A-G][#b]?m?7?|maj7?|sus\d?|dim?)\b/);
    if (firstChord) {
        let base = firstChord[1].match(/[A-G][#b]?/)[0].replace('b', '#');
        document.getElementById("current-key").innerText = base;
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
