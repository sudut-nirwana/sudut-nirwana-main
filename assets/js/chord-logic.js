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

    // 2. TRANSPOSE LOGIC (KOREKSI TOTAL)
    const scale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const sheet = document.getElementById("chord-sheet");
    
    function transpose(steps) {
        // Regex ini mengunci Chord secara utuh agar tanda # tidak dianggap karakter terpisah
        const chordRegex = /([A-G][#b]?)(m?7?|maj7?|sus\d?|dim?)/g;
        
        // Gunakan textContent untuk stabilitas karakter di dalam tag <pre>
        let content = sheet.textContent;

        const newContent = content.replace(chordRegex, (match, note, suffix) => {
            // Normalisasi flat ke sharp
            if (note.endsWith('b')) {
                const map = {'Db':'C#', 'Eb':'D#', 'Gb':'F#', 'Ab':'G#', 'Bb':'A#'};
                note = map[note] || note;
            }
            
            let index = scale.indexOf(note);
            if (index === -1) return match;
            
            // Hitung nada baru
            let newNote = scale[(index + steps + 12) % 12];
            return newNote + suffix;
        });

        sheet.textContent = newContent;
        
        // Update display angka kunci di panel
        const keyDisplay = document.getElementById("current-key");
        let curIdx = scale.indexOf(keyDisplay.innerText);
        if (curIdx !== -1) {
            keyDisplay.innerText = scale[(curIdx + steps + 12) % 12];
        }
    }

    document.getElementById("inc-ch").onclick = () => transpose(1);
    document.getElementById("dec-ch").onclick = () => transpose(-1);

    // 3. AUTO SCROLL (KECEPATAN DIPERBAIKI)
    let scroller = null;
    let isScrolling = false;
    let scrollSpeed = 2;

    function doScroll() {
        if (scroller) clearInterval(scroller);
        // Logika delay: Semakin besar speed, delay semakin kecil
        let delay = Math.max(10, 150 / scrollSpeed); 
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

    // 4. DIAGRAM DETECTOR
    const imgContainer = document.getElementById("chord-images-container");
    if (sheet && imgContainer) {
        const found = [...new Set(sheet.textContent.match(/\b([A-G][#b]?m?7?|maj7?|sus\d?|dim?)\b/g))];
        imgContainer.innerHTML = ''; // Bersihkan container sebelum isi ulang
        found.forEach(chord => {
            const img = document.createElement("img");
            // Mengganti # menjadi kata 'sharp' jika hosting menolak karakter # di URL
            let fileName = chord.replace('#', 'sharp');
            img.src = `/assets/img/chords/${fileName}.webp`;
            img.onerror = function() { this.remove(); };
            imgContainer.appendChild(img);
        });
    }
});
