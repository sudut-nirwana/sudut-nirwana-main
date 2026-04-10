document.addEventListener("DOMContentLoaded", function () {
    const scale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const sheetArea = document.getElementById("chord-sheet");
    const rawContent = sheetArea.innerText.trim();
    let offset = 0;

    // 1. Auto Color Chord
    function highlightChords(text) {
        const regex = /\b([A-G][#b]?)(m|7|maj7|sus\d|dim|add\d)?\b/g;
        return text.replace(regex, '<span class="c-h">$1$2</span>');
    }
    sheetArea.innerHTML = highlightChords(rawContent);

    // 2. Video Toggle Logic
    $("#video-toggle-bar").click(function() {
        $("#video-content-area").slideToggle();
        $("#v-icon").text($("#v-icon").text() == "▼" ? "▲" : "▼");
    });
    $("#close-v").click(function() { $("#video-content-area").slideUp(); $("#v-icon").text("▼"); });

    // 3. Tab System
    const tabs = document.querySelectorAll(".tab-item");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const target = tab.dataset.target;
            tabs.forEach(t => t.classList.remove("active"));
            document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
            tab.classList.add("active");
            document.querySelector(".panel-content").classList.add("show");
            document.getElementById("pane-" + target).classList.add("active");
        });
    });

    // 4. Transpose
    function transpose(delta) {
        offset = (offset + delta + 12) % 12;
        const regex = /\b([A-G][#b]?)(m|7|maj7|sus\d|dim|add\d)?\b/g;
        
        const newText = rawContent.replace(regex, (match, note, suffix) => {
            const map = {'Db':'C#', 'Eb':'D#', 'Gb':'F#', 'Ab':'G#', 'Bb':'A#'};
            if (note.endsWith('b')) note = map[note] || note;
            let idx = scale.indexOf(note);
            if (idx === -1) return match;
            return scale[(idx + offset + 12) % 12] + (suffix || "");
        });

        sheetArea.innerHTML = highlightChords(newText);
        
        // Update Key Display
        const keyDisplay = document.getElementById("current-key");
        let curIdx = (scale.indexOf(keyDisplay.innerText) + delta + 12) % 12;
        keyDisplay.innerText = scale[curIdx];
        generateDiagrams();
    }

    document.getElementById("inc-ch").onclick = () => transpose(1);
    document.getElementById("dec-ch").onclick = () => transpose(-1);

    // Initial Key
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
