/*
	Project filter.
	Each card lists its categories in data-tags (space separated);
	each button picks one via data-filter. "all" shows everything.

	Grids marked data-filter-grid hide themselves when no card matches.
	If that grid's section also has data-collapse, the whole section hides.
*/
(function () {
	var bar = document.querySelector('.filter-bar');
	if (!bar) return;

	var buttons = bar.querySelectorAll('.filter-btn');
	var cards = document.querySelectorAll('.project-card[data-tags]');
	var grids = document.querySelectorAll('[data-filter-grid]');

	// The bar is hidden in the HTML so it never shows without JavaScript.
	bar.hidden = false;

	function applyFilter(filter) {
		cards.forEach(function (card) {
			var tags = card.getAttribute('data-tags').split(' ');
			card.hidden = !(filter === 'all' || tags.indexOf(filter) !== -1);
		});

		grids.forEach(function (grid) {
			var visible = grid.querySelectorAll('.project-card:not([hidden])').length;
			var empty = (visible === 0);
			grid.hidden = empty;

			var section = grid.closest('section');
			if (section && section.hasAttribute('data-collapse')) {
				section.hidden = empty;
			}
		});
	}

	buttons.forEach(function (btn) {
		btn.addEventListener('click', function () {
			buttons.forEach(function (b) {
				var active = (b === btn);
				b.classList.toggle('is-active', active);
				b.setAttribute('aria-pressed', active ? 'true' : 'false');
			});
			applyFilter(btn.getAttribute('data-filter'));
		});
	});
})();
