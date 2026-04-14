const chordDB = {
    "C": { frets: [null, 3, 2, 0, 1, 0] },
    "C#": { frets: [null, 4, 3, 1, 2, 1] },
    "D": { frets: [null, null, 0, 2, 3, 2] },
    "Dm": { frets: [null, null, 0, 2, 3, 1] },
    "E": { frets: [0, 2, 2, 1, 0, 0] },
    "Em": { frets: [0, 2, 2, 0, 0, 0] },
    "F": { frets: [1, 3, 3, 2, 1, 1] },
    "G": { frets: [3, 2, 0, 0, 0, 3] },
    "A": { frets: [null, 0, 2, 2, 2, 0] },
    "Am": { frets: [null, 0, 2, 2, 1, 0] },
    "B": { frets: [null, 2, 4, 4, 4, 2] },
    "Bm": { frets: [null, 2, 4, 4, 3, 2] }
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
    document.getElementById('chord-title-display').innerText = "Chord " + name;
    document.getElementById('chord-svg-render').innerHTML = generateChordSVG(name);
    p.classList.add('show');
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
document.addEventListener('click', e => {
    const t = e.target.closest('.chord-node');
    if (t) showChordPanel(t.innerText.trim());
});

