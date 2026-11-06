
(function () {
	var links = [].slice.call(document.querySelectorAll('#nav a'));
	var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });

	function update() {
		var y = window.scrollY + 120, idx = 0;
		sections.forEach(function (s, i) { if (s && !s.hidden && s.offsetTop <= y) idx = i; });
		if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) idx = links.length - 1;
		links.forEach(function (a, i) { a.classList.toggle('active', i === idx); });
	}

	window.addEventListener('scroll', update, { passive: true });
	update();
})();
