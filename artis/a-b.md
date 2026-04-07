---
layout: default
title: "Chord Gitar Artis A - B"
permalink: /artis/a-b/
---
<div class="container alphabet-page">
  <div class="section-header">
    <h2 class="reveal up">Daftar Artis <strong>Inisial A - B</strong></h2>
    <p class="reveal up">Menampilkan semua koleksi chord berdasarkan nama artis.</p>
  </div>
  
  <div class="chord-grid-container reveal up">
    {% assign sorted_chords = site.chord | sort: "artist" %}
    {% for item in sorted_chords %}
      {% assign initial = item.artist | slice: 0 | upcase %}
      {% if initial == "A" or initial == "B" %}
        <div class="chord-item-card">
          <a href="{{ item.url | relative_url }}">
            <span class="artist-name">{{ item.artist }}</span>
            <span class="song-title">{{ item.title }}</span>
            <span class="view-chord">Lihat Chord →</span>
          </a>
        </div>
      {% endif %}
    {% endfor %}
  </div>
</div>
