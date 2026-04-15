---
layout: daftar-artis
title: "Semua Chord"
permalink: /chord/
---

<div class="row">
  {% assign artists = site.posts | map: 'artist' | uniq | sort %}
  {% for artist in artists %}
    {% if artist %}
    <div class="col-md-4 col-sm-6 mb-3">
      <a href="{{ '/artis/' | append: artist | slugify | append: '/' | relative_url }}" class="btn btn-outline-secondary btn-block text-left p-3">
        <i class="fa-solid fa-microphone-lines mr-2"></i> {{ artist }}
      </a>
    </div>
    {% endif %}
  {% endfor %}
</div>
