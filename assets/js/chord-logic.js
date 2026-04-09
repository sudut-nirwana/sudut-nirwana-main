document.addEventListener("DOMContentLoaded", function () {
    // 1. Tab System (Independent Panels)
    const tabs = document.querySelectorAll(".tab-btn");
    const panes = document.querySelectorAll(".panel-body");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            panes.forEach(p => p.classList.remove("active"));
            
            tab.classList.add("active");
            document.getElementById("pane-" + tab.dataset.target).classList.add("active");
        });
    });

    // 2. Transpose Logic (Anti-Looping)
    const scale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const sheet = document.getElementById("chord-sheet");
    const originalContent = sheet.innerText; // Simpan data asli

    let currentStep = 0;

    function doTranspose(delta) {
        currentStep = (currentStep + delta + 12) % 12;
        
        const chordRegex = /\b([A-G][#b]?)(m|7|maj7|sus\d|dim|add\d)?\b/g;
        
        // Selalu proses dari konten asli agar tanda # tidak bertumpuk
        sheet.innerText = originalContent.replace(chordRegex, (match, note, suffix) => {
            // Normalisasi b ke #
            if (note.endsWith('b')) {
                const bMap = {'Db':'C#', 'Eb':'D#', 'Gb':'F#', 'Ab':'G#', 'Bb':'A#'};
                note = bMap[note] || note;
            }
            
            let idx = scale.indexOf(note);
            if (idx === -1) return match;
            
            let newIdx = (idx + currentStep + 12) % 12;
            return scale[newIdx] + (suffix || "");
        });

        document.getElementById("current-key").innerText = scale[currentStep];
        updateDiagrams(); // Refresh diagram saat kunci berubah
    }

    document.getElementById("inc-ch").onclick = () => doTranspose(1);
    document.getElementById("dec-ch").onclick = () => doTranspose(-1);

    // 3. Modern Auto Scroll
    let scroller = null;
    let isScrolling = false;
    let scrollSpeed = 2;

    function startScrolling() {
        if (scroller) clearInterval(scroller);
        // Semakin tinggi speed, semakin kecil delay-nya
        let delay = 100 / (scrollSpeed * 0.5); 
        scroller = setInterval(() => {
            window.scrollBy(0, 1);
        }, delay);
    }

    document.getElementById("start-scroll").onclick = function() {
        isScrolling = !isScrolling;
        this.innerText = isScrolling ? "⏸ Berhenti" : "▶️ Mulai";
        if (isScrolling) startScrolling(); else clearInterval(scroller);
    };

    document.getElementById("speed-up").onclick = () => {
        if (scrollSpeed < 10) { scrollSpeed++; updateSpeedUI(); }
    };
    document.getElementById("speed-down").onclick = () => {
        if (scrollSpeed > 1) { scrollSpeed--; updateSpeedUI(); }
    };

    function updateSpeedUI() {
        document.getElementById("speed-val").innerText = scrollSpeed + "x";
        if (isScrolling) startScrolling();
    }

    // 4. Diagram Generator
    function updateDiagrams() {
        const container = document.getElementById("chord-images-container");
        const found = [...new Set(sheet.innerText.match(/\b([A-G][#b]?m?7?|maj7?|sus\d?|dim?)\b/g))];
        container.innerHTML = '';
        
        found.forEach(chord => {
            let fileName = chord.replace('#', 'sharp');
            const box = document.createElement("div");
            box.className = "chord-box";
            box.innerHTML = `<img src="/assets/img/chords/${fileName}.webp" onerror="this.parentElement.remove()">
                             <small style="display:block; font-weight:bold">${chord}</small>`;
            container.appendChild(box);
        });
    }

    // Run on Load
    updateDiagrams();
});
