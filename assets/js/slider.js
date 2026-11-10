
(function () {
	var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var box = null, boxImg = null, boxOwner = null;

	function lightbox() {
		if (box) return box;
		box = document.createElement('dialog');
		box.className = 'lightbox';
		box.setAttribute('aria-label', 'Screenshot preview');
		boxImg = document.createElement('img');
		box.appendChild(boxImg);
		box.addEventListener('click', function () { box.close(); });
		box.addEventListener('keydown', function (e) {
			if (!boxOwner) return;
			if (e.key === 'ArrowLeft') { e.preventDefault(); boxOwner.step(-1); }
			else if (e.key === 'ArrowRight') { e.preventDefault(); boxOwner.step(1); }
		});
		document.body.appendChild(box);
		return box;
	}

	document.querySelectorAll('[data-slider]').forEach(function (root) {
		var track = root.querySelector('.slides');
		var prev = root.querySelector('.slider-prev');
		var next = root.querySelector('.slider-next');
		var bar = root.querySelector('.slider-bar');
		var dots = root.querySelector('.slider-dots');
		var count = root.querySelector('.slider-count');
		var caption = root.querySelector('.slider-caption');
		var index = 0;

		function slides() {
			return [].slice.call(track.querySelectorAll('img:not([hidden])'));
		}

		function syncBox() {
			var im = slides()[index];
			if (im && box && box.open) { boxImg.src = im.currentSrc || im.src; boxImg.alt = im.alt; }
		}

		function go(i) {
			var n = slides().length;
			if (!n) return;
			index = Math.max(0, Math.min(n - 1, i));
			track.scrollTo({ left: index * track.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
			syncBox();
		}

		function mark() {
			var list = slides(), n = list.length;
			index = Math.max(0, Math.min(n - 1, Math.round(track.scrollLeft / (track.clientWidth || 1))));
			[].forEach.call(dots.children, function (d, i) {
				d.classList.toggle('is-active', i === index);
				d.setAttribute('aria-current', i === index ? 'true' : 'false');
			});
			count.textContent = (index + 1) + ' / ' + n;
			caption.textContent = (list[index] && list[index].getAttribute('data-caption')) || '';
			prev.disabled = index === 0;
			next.disabled = index >= n - 1;
		}

		function render() {
			var n = slides().length;
			prev.hidden = next.hidden = bar.hidden = n < 2;
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

		var api = { step: function (d) { go(index + d); } };

		prev.addEventListener('click', function () { go(index - 1); });
		next.addEventListener('click', function () { go(index + 1); });
		track.addEventListener('scroll', function () { window.requestAnimationFrame(mark); }, { passive: true });
		track.addEventListener('click', function (e) {
			var i = slides().indexOf(e.target);
			if (i < 0) return;
			index = i;
			var b = lightbox();
			if (!b.showModal) { window.open(e.target.src, '_blank'); return; }
			boxOwner = api;
			b.showModal();
			syncBox();
		});
		window.addEventListener('resize', function () { go(index); });
		root.addEventListener('keydown', function (e) {
			if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
			else if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
		});
		track.querySelectorAll('img').forEach(function (im) { im.addEventListener('error', render); });

		render();
	});
})();
