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

    // 2. VIDEO LOADER
    const vPlace = document.getElementById("video-placeholder");
    if (vPlace) {
        vPlace.addEventListener("click", function() {
            const id = this.dataset.videoId;
            document.getElementById("video-player-container").innerHTML = `<div style="position:relative;padding-bottom:56.25%;height:0;"><iframe style="position:absolute;top:0;left:0;width:100%;height:100%;" src="https://www.youtube.com/embed/${id}?autoplay=1" frameborder="0" allowfullscreen></iframe></div>`;
            this.style.display = "none";
        });
    }

    // 3. TRANSPOSE LOGIC
    const scale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const sheet = document.getElementById("chord-sheet");
    
    function transpose(steps) {
        const chordRegex = /\b([A-G][#b]?m?7?|maj7?|sus\d?|dim?)\b/g;
        sheet.innerHTML = sheet.innerHTML.replace(chordRegex, (chord) => {
            return chord.replace(/^[A-G][#b]?/, (note) => {
                if (note.endsWith('b')) {
                    const f2s = {'Db':'C#', 'Eb':'D#', 'Gb':'F#', 'Ab':'G#', 'Bb':'A#'};
                    note = f2s[note] || note;
                }
                let index = scale.indexOf(note);
                return index === -1 ? note : scale[(index + steps + 12) % 12];
            });
        });
        let curKey = document.getElementById("current-key");
        curKey.innerText = scale[(scale.indexOf(curKey.innerText) + steps + 12) % 12];
    }
    document.getElementById("inc-ch").onclick = () => transpose(1);
    document.getElementById("dec-ch").onclick = () => transpose(-1);

    // 4. AUTO SCROLL WITH SPEED CONTROL
    let scroller;
    let isScrolling = false;
    let scrollSpeed = 2; 
    const speedVal = document.getElementById("speed-val");

    function startScrolling() {
        clearInterval(scroller);
        scroller = setInterval(() => window.scrollBy(0, 1), 100 / scrollSpeed);
    }

    document.getElementById("start-scroll").onclick = function() {
        if (!isScrolling) {
            isScrolling = true;
            this.innerText = "⏸ Berhenti";
            startScrolling();
        } else {
            isScrolling = false;
            this.innerText = "▶️ Mulai";
            clearInterval(scroller);
        }
    };

    document.getElementById("speed-up").onclick = () => { if (scrollSpeed < 10) { scrollSpeed++; speedVal.innerText = scrollSpeed + "x"; if(isScrolling) startScrolling(); } };
    document.getElementById("speed-down").onclick = () => { if (scrollSpeed > 1) { scrollSpeed--; speedVal.innerText = scrollSpeed + "x"; if(isScrolling) startScrolling(); } };

    // 5. AUTO DIAGRAM DETECTOR
    const imgContainer = document.getElementById("chord-images-container");
    if (sheet && imgContainer) {
        const chordsFound = [...new Set(sheet.innerText.match(/\b([A-G][#b]?m?7?|maj7?|sus\d?|dim?)\b/g))];
        chordsFound.forEach(chord => {
            const img = document.createElement("img");
            img.src = `/assets/img/chords/${chord}.webp`;
            img.onerror = function() { this.remove(); };
            imgContainer.appendChild(img);
        });
    }
});
