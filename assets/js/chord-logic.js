document.addEventListener("DOMContentLoaded", function() {
    // 1. Gambar Diagram Kunci
    const container = document.getElementById('chord-diagrams');
    if (typeof songChords !== 'undefined' && container && window.ChordCanvas) {
        songChords.forEach(chord => {
            const box = document.createElement('div');
            box.style.textAlign = "center";
            box.innerHTML = `<div style="font-size:11px;font-weight:bold;margin-bottom:2px">${chord}</div><canvas width="50" height="60"></canvas>`;
            container.appendChild(box);
            const canvas = box.querySelector('canvas');
            window.ChordCanvas.draw(canvas, chord, { strokeColor: '#444', dotColor: '#ff9800' });
        });
    }

    // 2. Transpose Nada
    window.transpose = function(n) {
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        document.querySelectorAll('.chord-content b').forEach(el => {
            let chord = el.innerText;
            let res = chord.match(/^([A-G][#b]?)(.*)/);
            if (!res) return;
            let note = res[1].replace('Db','C#').replace('Eb','D#').replace('Gb','F#').replace('Ab','G#').replace('Bb','A#');
            let index = notes.indexOf(note);
            if (index !== -1) el.innerText = notes[(index + n + 12) % 12] + res[2];
        });
    };

    // 3. Auto Scroll
    let scrollInt;
    window.autoScroll = () => { if(!scrollInt) scrollInt = setInterval(() => window.scrollBy(0,1), 40); };
    window.stopScroll = () => { clearInterval(scrollInt); scrollInt = null; };
});
