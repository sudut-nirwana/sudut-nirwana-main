document.addEventListener("DOMContentLoaded", function () {
    // 1. YouTube Loader
    const placeholder = document.getElementById("video-placeholder");
    if (placeholder) {
        placeholder.addEventListener("click", function() {
            const videoId = this.getAttribute("data-video-id");
            const container = document.getElementById("video-player-container");
            container.innerHTML = `<iframe width="100%" height="350" src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            this.style.display = "none";
        });
    }

    // 2. Dynamic Panel System (Accordion)
    const triggers = document.querySelectorAll(".tab-trigger");
    const contentWrapper = document.querySelector(".panel-content-wrapper");
    const panes = document.querySelectorAll(".tab-pane");

    triggers.forEach(trigger => {
        trigger.addEventListener("click", () => {
            const target = trigger.getAttribute("data-tab");
            
            if (trigger.classList.contains("active")) {
                // Jika klik tab yang sama, tutup
                trigger.classList.remove("active");
                contentWrapper.classList.remove("show");
            } else {
                // Buka tab baru
                triggers.forEach(t => t.classList.remove("active"));
                panes.forEach(p => p.classList.remove("active"));
                
                trigger.classList.add("active");
                contentWrapper.classList.add("show");
                document.getElementById("tab-" + target).classList.add("active");
            }
        });
    });

    // 3. Sticky Logic
    const panel = document.getElementById("control-panel");
    const anchor = document.getElementById("sticky-anchor");

    window.addEventListener("scroll", () => {
        if (window.scrollY > anchor.offsetTop) {
            panel.classList.add("is-sticky");
        } else {
            panel.classList.remove("is-sticky");
        }
    });

    // 4. Transpose Logic (Safe Regex)
    const scale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const sheet = document.getElementById("chord-sheet");
    
    function transpose(steps) {
        // Regex yang lebih ketat: Hanya menangkap huruf kapital A-G yang berdiri sendiri atau diikuti simbol chord
        const chordRegex = /\b([A-G][#b]?)(m|7|maj7|sus\d|dim|add\d)?\b/g;
        let content = sheet.innerText;

        const newContent = content.replace(chordRegex, (match, note, suffix) => {
            // Normalisasi flat
            if (note.endsWith('b')) {
                const map = {'Db':'C#', 'Eb':'D#', 'Gb':'F#', 'Ab':'G#', 'Bb':'A#'};
                note = map[note] || note;
            }
            let index = scale.indexOf(note);
            if (index === -1) return match;
            
            let newNote = scale[(index + steps + 12) % 12];
            return newNote + (suffix || "");
        });

        sheet.innerText = newContent;
        
        // Update Display
        const keyDisplay = document.getElementById("current-key");
        let curIdx = scale.indexOf(keyDisplay.innerText);
        if (curIdx !== -1) {
            keyDisplay.innerText = scale[(curIdx + steps + 12) % 12];
        }
    }

    document.getElementById("inc-ch").onclick = () => transpose(1);
    document.getElementById("dec-ch").onclick = () => transpose(-1);

    // 5. Auto Scroll Logic
    let scroller = null;
    let isScrolling = false;
    let scrollSpeed = 2;

    document.getElementById("start-scroll").onclick = function() {
        if (!isScrolling) {
            isScrolling = true;
            this.innerText = "⏸ Berhenti";
            const delay = 100 / scrollSpeed;
            scroller = setInterval(() => window.scrollBy(0, 1), delay);
        } else {
            isScrolling = false;
            this.innerText = "▶️ Mulai";
            clearInterval(scroller);
        }
    };
    
    // Logic speed up/down (tambahkan fungsi perubah delay jika perlu)
});
