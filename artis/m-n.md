---
layout: default
title: "Chord Gitar Artis M - N"
permalink: /artis/m-n/
---
<link rel="stylesheet" href="{{ '/assets/css/chord-style.css' | relative_url }}">
<div class="container alphabet-page">
  <div class="section-header">
    <h2 class="reveal up">Daftar Artis <strong>Inisial M - N</strong></h2>
    <p class="reveal up">Menampilkan semua koleksi chord berdasarkan nama artis.</p>
  </div>
  
  <div class="chord-grid-container reveal up">
    {% assign sorted_chords = site.chord | sort: "artist" %}
    {% for item in sorted_chords %}
      {% assign initial = item.artist | slice: 0 | upcase %}
      {% if initial == "M" or initial == "N" %}
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
