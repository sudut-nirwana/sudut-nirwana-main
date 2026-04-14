// 1. DATABASE CHORD LENGKAP (Basic & Popular)
const chordDB = {
   // === KUNCI MAYOR ===
    "C": { frets: [null, 3, 2, 0, 1, 0] },
    "C#": { frets: [null, 4, 3, 1, 2, 1] },
    "D": { frets: [null, null, 0, 2, 3, 2] },
    "D#": { frets: [null, null, 1, 3, 4, 3] },
    "E": { frets: [0, 2, 2, 1, 0, 0] },
    "F": { frets: [1, 3, 3, 2, 1, 1] },
    "F#": { frets: [2, 4, 4, 3, 2, 2] },
    "G": { frets: [3, 2, 0, 0, 0, 3] },
    "G#": { frets: [4, 6, 6, 5, 4, 4] },
    "A": { frets: [null, 0, 2, 2, 2, 0] },
    "A#": { frets: [null, 1, 3, 3, 3, 1] },
    "B": { frets: [null, 2, 4, 4, 4, 2] },

    // === KUNCI MINOR ===
    "Cm": { frets: [null, 3, 5, 5, 4, 3] },
    "C#m": { frets: [null, 4, 6, 6, 5, 4] },
    "Dm": { frets: [null, null, 0, 2, 3, 1] },
    "D#m": { frets: [null, null, 1, 3, 4, 2] },
    "Em": { frets: [0, 2, 2, 0, 0, 0] },
    "Fm": { frets: [1, 3, 3, 1, 1, 1] },
    "F#m": { frets: [2, 4, 4, 2, 2, 2] },
    "Gm": { frets: [3, 5, 5, 3, 3, 3] },
    "G#m": { frets: [4, 6, 6, 4, 4, 4] },
    "Am": { frets: [null, 0, 2, 2, 1, 0] },
    "A#m": { frets: [null, 1, 3, 3, 2, 1] },
    "Bm": { frets: [null, 2, 4, 4, 3, 2] },

    // === KUNCI DOMINANT 7 ===
    "C7": { frets: [null, 3, 2, 3, 1, 0] },
    "D7": { frets: [null, null, 0, 2, 1, 2] },
    "E7": { frets: [0, 2, 0, 1, 0, 0] },
    "G7": { frets: [3, 2, 0, 0, 0, 1] },
    "A7": { frets: [null, 0, 2, 0, 2, 0] },
    "B7": { frets: [null, 2, 1, 2, 0, 2] },
    
    // === KUNCI FLAT (Alternatif Nama) ===
    "Bb": { frets: [null, 1, 3, 3, 3, 1] },
    "Eb": { frets: [null, null, 1, 3, 4, 3] },
    "Ab": { frets: [4, 6, 6, 5, 4, 4] },
    "Db": { frets: [null, 4, 3, 1, 2, 1] },
    "Gb": { frets: [2, 4, 4, 3, 2, 2] }

};

// 2. FUNGSI GAMBAR (Sama seperti sebelumnya)
function generateChordSVG(chordName) {
    const data = chordDB[chordName];
    if (!data) return `<p style="font-size:12px;color:#999;padding:10px;">Diagram segera hadir</p>`;

    let dots = "";
    data.frets.forEach((fret, i) => {
        const x = 10 + (i * 16);
        if (fret === null) {
            dots += `<text x="${x}" y="8" font-size="10" text-anchor="middle" fill="#888">×</text>`;
        } else if (fret === 0) {
            dots += `<circle cx="${x}" cy="8" r="3" fill="none" stroke="#444" stroke-width="1"/>`;
        } else {
            const y = 15 + (fret * 20) - 10;
            dots += `<circle cx="${x}" cy="${y}" r="6" fill="#ee6c00" />`;
        }
    });

    return `<svg width="100%" height="120" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
        <line x1="10" y1="15" x2="90" y2="15" stroke="#333" stroke-width="3"/>
        <rect x="10" y="15" width="80" height="100" fill="none" stroke="#aaa" />
        ${[35, 55, 75, 95].map(y => `<line x1="10" y1="${y}" x2="90" y2="${y}" stroke="#aaa" />`).join('')}
        ${[10, 26, 42, 58, 74, 90].map(x => `<line x1="${x}" y1="15" x2="${x}" y2="115" stroke="#aaa" />`).join('')}
        ${dots}
    </svg>`;
}

// 3. FUNGSI OTOMATIS UNTUK HALAMAN TUTORIAL (GRID)
/*function renderAllChords() {
    const gridContainer = document.getElementById('all-chords-grid');
    if (!gridContainer) return; // Hanya jalan jika elemen ini ada

    gridContainer.innerHTML = ""; // Bersihkan kontainer
    Object.keys(chordDB).forEach(chord => {
        const card = document.createElement('div');
        card.className = 'chord-card';
        card.innerHTML = `
            <div class="chord-card-name">${chord}</div>
            <div class="chord-card-svg">${generateChordSVG(chord)}</div>
        `;
        gridContainer.appendChild(card);
    });
}*/
function renderAllChords() {
    const gridContainer = document.getElementById('all-chords-grid');
    if (!gridContainer) return;

    gridContainer.innerHTML = ""; // Bersihkan kontainer

    const chords = Object.keys(chordDB);
    
    chords.forEach((chord, index) => {
        const card = document.createElement('div');
        card.className = 'chord-card';
        
        // Paksa opacity 0 sejak awal agar tidak berkedip
        card.style.opacity = "0";

        card.innerHTML = `
            <div class="chord-card-name">${chord}</div>
            <div class="chord-card-svg">${generateChordSVG(chord)}</div>
        `;

        gridContainer.appendChild(card);

        // Jalankan animasi menggunakan Web Animations API (Lebih stabil)
        setTimeout(() => {
            card.animate([
                // Keyframes
                { opacity: 0, transform: 'translateY(20px)' }, 
                { opacity: 1, transform: 'translateY(0)' }
            ], {
                // Timing options
                duration: 500,
                fill: 'forwards',
                easing: 'ease-out',
                delay: index * 50 // Jeda antar kartu
            });
        }, 10);
    });
}


// Jalankan fungsi grid saat halaman dimuat
document.addEventListener('DOMContentLoaded', renderAllChords);

// FUNGSI POPUP (Tetap sama)
window.showChordPanel = function(chordName) {
    const panel = document.getElementById('chord-panel');
    const title = document.getElementById('chord-title-display');
    const renderArea = document.getElementById('chord-svg-render');
    if (panel && title && renderArea) {
        title.innerText = "Chord :  " + chordName;
        renderArea.innerHTML = generateChordSVG(chordName);
        panel.classList.add('show');
    }
};

window.hideChordPanel = () => document.getElementById('chord-panel')?.classList.remove('show');

document.addEventListener('click', (e) => {
    const target = e.target.closest('.chord-node');
    if (target) showChordPanel(target.innerText.trim());
});
   
