/* --- SUDUT NIRWANA: LOGIC JAVASCRIPT --- */

document.addEventListener("DOMContentLoaded", function () {
    
    // === 1. LOGIKA TAB (ACCORDION PUSH) ===
    const tabs = document.querySelectorAll(".tab-btn");
    const panes = document.querySelectorAll(".tab-pane");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const target = tab.getAttribute("data-tab");

            // Update status aktif tombol
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            // Tampilkan konten yang sesuai
            panes.forEach(p => p.classList.remove("active"));
            document.getElementById("tab-" + target).classList.add("active");
        });
    });

    // === 2. LOGIKA VIDEO YOUTUBE (ON-CLICK) ===
    const placeholder = document.getElementById("video-placeholder");
    if (placeholder) {
        placeholder.addEventListener("click", function() {
            const videoId = this.getAttribute("data-video-id");
            const playerContainer = document.getElementById("video-player-container");
            
            // Render Iframe
            playerContainer.innerHTML = `
                <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
                    <iframe style="position:absolute;top:0;left:0;width:100%;height:100%;" 
                        src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
                        frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
                    </iframe>
                </div>`;
            this.style.display = "none"; // Sembunyikan tombol placeholder
        });
    }

    // === 3. LOGIKA TRANSPOSE (REAL-TIME) ===
    const chordList = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const chordSheet = document.getElementById("chord-sheet");
    const keyDisplay = document.getElementById("current-key");

    function doTranspose(steps) {
        // Regex untuk mencari chord (huruf A-G di awal kata)
        const chordRegex = /\b([A-G][#b]?m?7?|maj7?|dim?|sus\d?)\b/g;
        
        const content = chordSheet.innerHTML;
        const newContent = content.replace(chordRegex, (match) => {
            return match.replace(/^[A-G][#b]?/, (root) => {
                // Normalisasi b (flat) ke # (sharp) agar sesuai array
                if (root.endsWith('b')) {
                    const notes = { 'Db':'C#', 'Eb':'D#', 'Gb':'F#', 'Ab':'G#', 'Bb':'A#' };
                    root = notes[root] || root;
                }
                
                let index = chordList.indexOf(root);
                if (index === -1) return root;
                
                let newIndex = (index + steps + 12) % 12;
                return chordList[newIndex];
            });
        });

        chordSheet.innerHTML = newContent;
        
        // Update tampilan Kunci Dasar di panel
        let currentIdx = chordList.indexOf(keyDisplay.innerText);
        if (currentIdx !== -1) {
            keyDisplay.innerText = chordList[(currentIdx + steps + 12) % 12];
        }
    }

    document.getElementById("inc-ch")?.addEventListener("click", () => doTranspose(1));
    document.getElementById("dec-ch")?.addEventListener("click", () => doTranspose(-1));

    // === 4. LOGIKA AUTO SCROLL ===
    let isScrolling = false;
    let scrollInterval;
    const scrollBtn = document.getElementById("start-scroll");

    if (scrollBtn) {
        scrollBtn.addEventListener("click", function() {
            if (!isScrolling) {
                isScrolling = true;
                this.innerText = "Berhenti Scroll";
                this.style.background = "#333";
                
                scrollInterval = setInterval(() => {
                    window.scrollBy(0, 1); // Scroll turun 1 pixel
                }, 50); // Kecepatan (makin kecil makin cepat)
            } else {
                isScrolling = false;
                this.innerText = "Mulai Auto Scroll";
                this.style.background = "#ee6c00";
                clearInterval(scrollInterval);
            }
        });
    }
});
