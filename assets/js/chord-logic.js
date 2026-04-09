document.addEventListener("DOMContentLoaded", function () {
    // 1. TABS SYSTEM
    const tabs = document.querySelectorAll(".tab-btn");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const target = tab.getAttribute("data-tab");
            document.querySelectorAll(".tab-btn").forEach(t => t.classList.remove("active"));
            document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
            tab.classList.add("active");
            document.getElementById("tab-" + target).classList.add("active");
        });
    });

    // 2. TRANSPOSE LOGIC (Mencegah banjir tanda #)
    const scale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const sheet = document.getElementById("chord-sheet");
    let currentTranspose = 0;

    function transpose(steps) {
        const chordRegex = /\b([A-G][#b]?m?7?|maj7?|sus\d?|dim?)\b/g;
        // Gunakan innerText untuk mencegah duplikasi karakter HTML
        let content = sheet.innerText;

        const newContent = content.replace(chordRegex, (chord) => {
            return chord.replace(/^[A-G][#b]?/, (note) => {
                // Normalisasi flat ke sharp
                if (note.endsWith('b')) {
                    const map = {'Db':'C#', 'Eb':'D#', 'Gb':'F#', 'Ab':'G#', 'Bb':'A#'};
                    note = map[note] || note;
                }
                let index = scale.indexOf(note);
                if (index === -1) return note;
                return scale[(index + steps + 12) % 12];
            });
        });
        
        sheet.innerText = newContent;
        
        // Update display key di panel
        const keyDisplay = document.getElementById("current-key");
        let curIdx = scale.indexOf(keyDisplay.innerText);
        keyDisplay.innerText = scale[(curIdx + steps + 12) % 12];
    }

    document.getElementById("inc-ch").onclick = () => transpose(1);
    document.getElementById("dec-ch").onclick = () => transpose(-1);

    // 3. AUTO SCROLL (Speed 1-10)
    let scroller = null;
    let isScrolling = false;
    let scrollSpeed = 2;

    function doScroll() {
        if (scroller) clearInterval(scroller);
        // Interval: makin tinggi speed, makin kecil delay (makin cepat)
        let delay = 120 / scrollSpeed; 
        scroller = setInterval(() => {
            window.scrollBy(0, 1);
        }, delay);
    }

    document.getElementById("start-scroll").onclick = function() {
        if (!isScrolling) {
            isScrolling = true;
            this.innerText = "⏸ Berhenti";
            doScroll();
        } else {
            isScrolling = false;
            this.innerText = "▶️ Mulai";
            clearInterval(scroller);
        }
    };

    document.getElementById("speed-up").onclick = () => {
        if (scrollSpeed < 10) {
            scrollSpeed++;
            document.getElementById("speed-val").innerText = scrollSpeed + "x";
            if (isScrolling) doScroll();
        }
    };

    document.getElementById("speed-down").onclick = () => {
        if (scrollSpeed > 1) {
            scrollSpeed--;
            document.getElementById("speed-val").innerText = scrollSpeed + "x";
            if (isScrolling) doScroll();
        }
    };

    // 4. DIAGRAM DETECTOR (Otomatis panggil gambar)
    const imgContainer = document.getElementById("chord-images-container");
    if (sheet && imgContainer) {
        const found = [...new Set(sheet.innerText.match(/\b([A-G][#b]?m?7?|maj7?|sus\d?|dim?)\b/g))];
        found.forEach(chord => {
            const img = document.createElement("img");
            img.src = `/assets/img/chords/${chord.replace('#', 'sharp')}.webp`; // Opsional: ganti # jadi 'sharp' jika nama file error
            img.onerror = function() { this.remove(); };
            imgContainer.appendChild(img);
        });
    }
});
