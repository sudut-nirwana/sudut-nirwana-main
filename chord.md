---
layout: daftar-artis
title: "Daftar Lengkap Artis"
permalink: /chord/
---

<div class="container">
  <div class="entry-header mb-4">
    <h2 class="entry-title">Daftar Lengkap <span>Semua Artis</span></h2>
    <p>Temukan kunci gitar dan lirik lagu berdasarkan nama artis favorit Anda secara lengkap dari A sampai Z.</p>
  </div>

  <div class="row">
    {% assign artists = site.chord | map: 'artist' | uniq | sort %}
    {% for artist in artists %}
      {% if artist %}
      <div class="col-md-4 col-sm-6 mb-3">
        <div class="artist-card">
          <a href="{{ '/artis/' | append: artist | slugify | append: '/' | relative_url }}" class="btn btn-outline-light btn-block text-left p-3 shadow-sm" style="color: #333; border: 1px solid #eee; background: #fff; border-radius: 8px; display: block;">
            <i class="fa-solid fa-microphone-lines mr-2 text-secondary"></i> {{ artist }}
          </a>
        </div>
      </div>
      {% endif %}
    {% endfor %}
  </div>
</div>
