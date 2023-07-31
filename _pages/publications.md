---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
---
<h6><i>Note: Full-text was added where applicable. For paywall bypass, just message me for access.</i><br></h6>

{% if author.googlescholar %}
  You can also find my articles on <u><a href="{{author.googlescholar}}">my Google Scholar profile</a>.</u>
{% endif %}

{% include base_path %}

{% for post in site.publications reversed %}
  {% include archive-single.html %}
{% endfor %}
