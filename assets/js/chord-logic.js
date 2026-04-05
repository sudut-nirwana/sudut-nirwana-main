const scale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
let isScrolling = false;
let scrollInterval;

// 1. Transpose
function transpose(steps) {
    document.querySelectorAll('.c').forEach(el => {
        el.innerText = el.innerText.replace(/[CDEFGAB][#b]?/g, (match) => {
            let note = match.replace('b', (m) => scale[scale.indexOf(m[0]) - 1] || 'B');
            let i = scale.indexOf(note);
            if (i === -1) return match;
            let next = (i + steps) % 12;
            return scale[next < 0 ? next + 12 : next];
        });
    });
}

// 2. Auto Scroll
function toggleScroll() {
    const btn = document.getElementById('scrollBtn');
    const speed = document.getElementById('scrollSpeed').value;
    if (!isScrolling) {
        scrollInterval = setInterval(() => window.scrollBy(0, 1), 100 / speed);
        btn.innerText = "Stop"; btn.style.background = "#ff4d4d"; btn.style.color = "#fff";
        isScrolling = true;
    } else {
        clearInterval(scrollInterval);
        btn.innerText = "Auto Scroll"; btn.style.background = "#fff"; btn.style.color = "#000";
        isScrolling = false;
    }
}

// 3. Handle Sticky Header Sinkronisasi
function adjustPanel() {
    const panel = document.getElementById('chord-controls');
    if (!panel) return;
    const isMobile = window.innerWidth < 768;
    const headerH = isMobile ? 60 : 70;
    
    // Jika scroll sudah melewati 100px (saat header utama kamu muncul fixed)
    if (window.scrollY > 100) {
        panel.style.top = headerH + "px";
    } else {
        panel.style.top = "0px";
    }
}
window.addEventListener('scroll', adjustPanel);

// 4. Modal Chord Click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('c')) {
        const chord = e.target.innerText;
        document.getElementById('modalTitle').innerText = "Kunci: " + chord;
        document.getElementById('chordImg').src = `/assets/chord-img/${chord.replace('#', 'sharp')}.png`;
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('chordModal').style.display = 'block';
    }
});

function closeModal() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('chordModal').style.display = 'none';
}
