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

function generateChordSVG(name) {
    const data = chordDB[name];
    if (!data) return `<p style="font-size:12px;color:#999">Nantikan Update!</p>`;

    let dots = "";
    data.frets.forEach((fret, i) => {
        const x = 10 + (i * 16);
        if (fret === null) dots += `<text x="${x}" y="8" font-size="10" text-anchor="middle" fill="#999">×</text>`;
        else if (fret === 0) dots += `<circle cx="${x}" cy="8" r="3" fill="none" stroke="#666"/>`;
        else dots += `<circle cx="${x}" cy="${15+(fret*20)-10}" r="6" fill="#ee6c00"/>`;
    });

    return `<svg width="120" height="130" viewBox="0 0 100 120">
        <line x1="10" y1="15" x2="90" y2="15" stroke="#333" stroke-width="3"/>
        <rect x="10" y="15" width="80" height="100" fill="none" stroke="#ccc" />
        ${[35,55,75,95].map(y => `<line x1="10" y1="${y}" x2="90" y2="${y}" stroke="#ccc"/>`).join('')}
        ${[10,26,42,58,74,90].map(x => `<line x1="${x}" y1="15" x2="${x}" y2="115" stroke="#ccc"/>`).join('')}
        ${dots}
    </svg>`;
}

window.showChordPanel = function(name) {
    const p = document.getElementById('chord-panel');
    const titleDisplay = document.getElementById('chord-title-display');
    const renderArea = document.getElementById('chord-svg-render');

    if (p && titleDisplay && renderArea) {
        // Membersihkan teks dari kurung atau spasi agar cocok dengan chordDB
        // Contoh: "(Am)" menjadi "Am"
        const cleanName = name.replace(/[()]/g, '').trim();

        titleDisplay.innerText = "Chord " + cleanName;
        renderArea.innerHTML = generateChordSVG(cleanName);
        p.classList.add('show');
    }
};


window.hideChordPanel = () => document.getElementById('chord-panel').classList.remove('show');

function renderAllChords() {
    const g = document.getElementById('all-chords-grid');
    if (!g) return;
    g.innerHTML = Object.keys(chordDB).map(c => `
        <div class="chord-card"><div class="chord-card-name">${c}</div>${generateChordSVG(c)}</div>
    `).join('');
}

// Deteksi Klik pada .chord-node (Lirik)
document.addEventListener('click', function(e) {
    // Mencari elemen .chord-node terdekat dari lokasi klik
    const targetChord = e.target.closest('.chord-node');
    
    if (targetChord) {
        // Ambil teks chord-nya (misal: "G" atau "Am")
        const chordName = targetChord.innerText.trim();
        
        // Debugging: Muncul di console Eruda kamu jika berhasil diklik
        console.log("Membuka diagram untuk chord:", chordName); 
        
        // Panggil fungsi untuk menampilkan panel
        showChordPanel(chordName);
    }
});
