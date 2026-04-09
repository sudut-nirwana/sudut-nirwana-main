document.addEventListener("DOMContentLoaded", function () {

    // Tambahkan fungsi ini di dalam DOMContentLoaded
    function detectOriginalKey() {
        const sheet = document.getElementById("chord-sheet");
        // Regex mencari chord pertama
        const firstChordMatch = sheet.innerText.match(/\b([A-G][#b]?m?7?|maj7?|sus\d?|dim?)\b/);
        if (firstChordMatch) {
            let detected = firstChordMatch[1];
            // Bersihkan suffix minor/7 dsb hanya untuk display key utama
            let baseNote = detected.match(/[A-G][#b]?/)[0];
        
            // Update tampilan di box biru
            document.getElementById("current-key").innerText = baseNote;
            // Set offset transpose awal agar sinkron dengan 'C' di array scale
            // Jika nada dasar aslinya G, kita set offset awal ke posisi G
            const scale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
            offset = scale.indexOf(baseNote);
            if (offset === -1) offset = 0; // fallback ke C jika tidak ketemu
        }
    }
    
    // 1. Panel Tab System (Single Open)
    const tabs = document.querySelectorAll(".tab-item");
    const contentArea = document.querySelector(".panel-content");
    const panes = document.querySelectorAll(".tab-pane");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const target = tab.dataset.target;
            if (tab.classList.contains("active") && contentArea.classList.contains("show")) {
                contentArea.classList.remove("show");
                tab.classList.remove("active");
            } else {
                tabs.forEach(t => t.classList.remove("active"));
                panes.forEach(p => p.classList.remove("active"));
                tab.classList.add("active");
                contentArea.classList.add("show");
                document.getElementById("pane-" + target).classList.add("active");
            }
        });
    });

    // 2. Transpose Logic (SAFE METHOD)
    const scale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const sheet = document.getElementById("chord-sheet");
    const originalText = sheet.innerText; // Simpan teks asli
    let offset = 0;

    function transpose(delta) {
        offset = (offset + delta + 12) % 12;
        const chordRegex = /\b([A-G][#b]?)(m|7|maj7|sus\d|dim|add\d)?\b/g;

        // Selalu ambil dari teks asli agar tidak bertumpuk tanda #
        sheet.innerText = originalText.replace(chordRegex, (match, note, suffix) => {
            if (note.endsWith('b')) {
                const map = {'Db':'C#', 'Eb':'D#', 'Gb':'F#', 'Ab':'G#', 'Bb':'A#'};
                note = map[note] || note;
            }
            let idx = scale.indexOf(note);
            if (idx === -1) return match;
            let newIdx = (idx + offset + 12) % 12;
            return scale[newIdx] + (suffix || "");
        });

        document.getElementById("current-key").innerText = scale[(scale.indexOf("C") + offset) % 12];
        generateDiagrams();
    }

    document.getElementById("inc-ch").addEventListener("click", () => transpose(1));
    document.getElementById("dec-ch").addEventListener("click", () => transpose(-1));

    // 3. Auto Scroll & Speed
    let scrollInterval = null;
    let speed = 2;

    function startScrolling() {
        if (scrollInterval) clearInterval(scrollInterval);
        scrollInterval = setInterval(() => {
            window.scrollBy(0, 1);
        }, 100 / speed);
    }

    document.getElementById("start-scroll").onclick = function() {
        if (this.innerText.includes("Mulai")) {
            this.innerText = "⏸ Berhenti";
            startScrolling();
        } else {
            this.innerText = "▶️ Mulai";
            clearInterval(scrollInterval);
            scrollInterval = null;
        }
    };

    document.getElementById("speed-up").onclick = () => { if(speed < 10) { speed++; updateSpeedUI(); } };
    document.getElementById("speed-down").onclick = () => { if(speed > 1) { speed--; updateSpeedUI(); } };

    function updateSpeedUI() {
        document.getElementById("speed-val").innerText = speed + "x";
        if (scrollInterval) startScrolling();
    }

    // 4. Diagram Generator
    function generateDiagrams() {
        const container = document.getElementById("chord-images-container");
        const chords = [...new Set(sheet.innerText.match(/\b([A-G][#b]?m?7?|maj7?|sus\d?|dim?)\b/g))];
        container.innerHTML = "";
        chords.forEach(c => {
            const name = c.replace("#", "sharp");
            container.innerHTML += `<div class="chord-box-img"><img src="/assets/img/chords/${name}.webp" onerror="this.remove()"><p>${c}</p></div>`;
        });
    }

    // 5. Sticky Panel Scroll Logic
    window.addEventListener("scroll", () => {
        const panel = document.getElementById("control-panel");
        if (window.scrollY > 300) panel.classList.add("is-sticky");
        else panel.classList.remove("is-sticky");
    });

    generateDiagrams();
});
