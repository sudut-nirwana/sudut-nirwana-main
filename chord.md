---
layout: daftar-artis
title: "Semua Chord"
permalink: /chord/
---

<section class="content-section">
  <div class="container">
    <header class="entry-header">
      <h2 class="entry-title">Daftar Artis <span>Semua Chord</span></h2>
      <p>Temukan chord gitar berdasarkan nama artis favorit anda secara lengkap.</p>
    </header>
    <div class="artist-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; margin-top: 20px;">
      {% assign artists = site.posts | map: 'artist' | uniq | sort %}
      {% for artist in artists %}
        {% if artist %}
          <a href="{{ '/artis/' | append: artist | slugify | append: '/' | relative_url }}" class="artist-card" style="text-decoration: none; color: inherit;">
            <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; background: #fff; display: flex; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <i class="fa-solid fa-microphone-lines" style="margin-right: 10px; color: #888;"></i>
              <span style="font-weight: 500;">{{ artist }}</span>
            </div>
          </a>
        {% endif %}
      {% endfor %}
    </div>
  </div>
</section>

