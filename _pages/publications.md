---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
---
<div style="font-size: 0.75em;"><i><b>Note:</b> Full-text versions were included where applicable. For paywall bypass requests, feel free to message me.</i></div>
<hr class="solid" style="border-top: 1px solid gainsboro">

{% include base_path %}

{% for post in site.publications reversed %}
  {% include archive-single.html %}
{% endfor %}
