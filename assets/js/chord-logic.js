document.addEventListener("DOMContentLoaded", function () {
    const scale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const sheet = document.getElementById("chord-sheet");
    const rawText = sheet.innerText;
    let offset = 0;

    // 1. Fungsi Mewarnai Chord Otomatis
    function applyStyle(text) {
        const chordRegex = /\b([A-G][#b]?)(m|7|maj7|sus\d|dim|add\d)?\b/g;
        return text.replace(chordRegex, '<span class="c-h">$1$2</span>');
    }

    // Inisialisasi Tampilan
    sheet.innerHTML = applyStyle(rawText);

    // 2. Video Toggle Logic
    const vToggle = document.getElementById("video-toggle");
    const vContent = document.getElementById("video-content");
    const vClose = document.getElementById("close-video");

    vToggle.onclick = () => {
        vContent.classList.toggle("show");
        vToggle.querySelector(".icon").innerText = vContent.classList.contains("show") ? "▲" : "▼";
    };

    vClose.onclick = () => {
        vContent.classList.remove("show");
        vToggle.querySelector(".icon").innerText = "▼";
        // Stop video saat ditutup
        const iframe = document.getElementById("yt-iframe");
        const src = iframe.src;
        iframe.src = src;
    };

    // 3. Transpose Logic
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
        
        // Update Key Label di Box Biru
        const currentKeyEl = document.getElementById("current-key");
        let currentIdx = (scale.indexOf(currentKeyEl.innerText) + delta + 12) % 12;
        currentKeyEl.innerText = scale[currentIdx];
        generateDiagrams();
    }

    document.getElementById("inc-ch").onclick = () => transpose(1);
    document.getElementById("dec-ch").onclick = () => transpose(-1);

    // 4. Inisialisasi Nada Dasar
    const firstChord = rawText.match(/\b([A-G][#b]?m?7?|maj7?|sus\d?|dim?)\b/);
    if (firstChord) {
        let base = firstChord[1].match(/[A-G][#b]?/)[0];
        document.getElementById("current-key").innerText = base.replace('b', '#'); 
    }

    // Tab Panel System
    const tabs = document.querySelectorAll(".tab-item");
    tabs.forEach(t => {
        t.onclick = () => {
            document.querySelectorAll(".tab-item, .tab-pane").forEach(el => el.classList.remove("active"));
            t.classList.add("active");
            document.querySelector(".panel-content").classList.add("show");
            document.getElementById("pane-" + t.dataset.target).classList.add("active");
        };
    });

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
