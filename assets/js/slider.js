/*
	Screenshot slider.
	Markup: [data-slider] > .slides (images) + .slider-prev + .slider-next + .slider-dots + .slider-count
	Works by touch swipe and trackpad scroll even without this script; this adds arrows, dots,
	a counter, and left/right arrow keys. Images that fail to load are skipped automatically.
*/
(function () {
	var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	document.querySelectorAll('[data-slider]').forEach(function (root) {
		var track = root.querySelector('.slides');
		var prev = root.querySelector('.slider-prev');
		var next = root.querySelector('.slider-next');
		var dots = root.querySelector('.slider-dots');
		var count = root.querySelector('.slider-count');
		var index = 0;

		function slides() {
			return [].slice.call(track.querySelectorAll('img:not([hidden])'));
		}

		function go(i) {
			var n = slides().length;
			if (!n) return;
			index = Math.max(0, Math.min(n - 1, i));
			track.scrollTo({ left: index * track.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
		}

		function mark() {
			var n = slides().length;
			index = Math.max(0, Math.min(n - 1, Math.round(track.scrollLeft / (track.clientWidth || 1))));
			[].forEach.call(dots.children, function (d, i) {
				d.classList.toggle('is-active', i === index);
				d.setAttribute('aria-current', i === index ? 'true' : 'false');
			});
			count.textContent = (index + 1) + ' / ' + n;
			prev.disabled = index === 0;
			next.disabled = index >= n - 1;
		}

		function render() {
			var n = slides().length;
			var show = n > 1;
			prev.hidden = next.hidden = dots.hidden = count.hidden = !show;
			dots.innerHTML = '';
			slides().forEach(function (_, i) {
				var b = document.createElement('button');
				b.type = 'button';
				b.className = 'slider-dot';
				b.setAttribute('aria-label', 'Go to screenshot ' + (i + 1));
				b.addEventListener('click', function () { go(i); });
				dots.appendChild(b);
			});
			mark();
		}

		prev.addEventListener('click', function () { go(index - 1); });
		next.addEventListener('click', function () { go(index + 1); });
		track.addEventListener('scroll', function () { window.requestAnimationFrame(mark); }, { passive: true });
		window.addEventListener('resize', function () { go(index); });
		root.addEventListener('keydown', function (e) {
			if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
			else if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
		});
		track.querySelectorAll('img').forEach(function (im) { im.addEventListener('error', render); });

		render();
	});
})();
