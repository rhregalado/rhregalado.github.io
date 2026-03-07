---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
---
<h6><i>Note: Full-text versions were included where applicable. For paywall bypass requests, feel free to message me.</i><br></h6>
<hr class="solid" style="border-top: 1px solid gainsboro">

<div style="text-align: justify;">
{% include base_path %}

{% for post in site.publications reversed %}
  {% include archive-single.html %}
{% endfor %}
</div>
