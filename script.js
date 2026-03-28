document.querySelectorAll('[data-index]').forEach(el => {
    const i = Number(el.dataset.index);
    el.style.animationDelay = `${0.1 + i * 0.05}s`;
});

const ARROW_SVG = (stroke) => `
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 14L14 4M14 4H7M14 4V11" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;

function createNavItem({ label, href }) {
	const li = document.createElement("li");
	li.className = "nav-item";

	const a = document.createElement("a");
	a.className = "nav-link";
	a.href = href;

	const curtain = document.createElement("div");
	curtain.className = "nav-curtain";

	const text = document.createElement("span");
	text.className = "nav-text";
	text.textContent = label;

	const arrowWrap = document.createElement("div");
	arrowWrap.className = "nav-arrow";
	arrowWrap.style.cssText = "position:relative;width:18px;height:18px;";

	const arrowDark = document.createElement("span");
	arrowDark.className = "arrow-dark";
	arrowDark.innerHTML = ARROW_SVG("#111111");

	const arrowWhite = document.createElement("span");
	arrowWhite.className = "arrow-white";
	arrowWhite.innerHTML = ARROW_SVG("#ffffff");

	arrowWrap.append(arrowDark, arrowWhite);
	a.append(curtain, text, arrowWrap);
	li.appendChild(a);

	return li;
}

function initNav(selector) {
	const list = document.querySelector(selector);
	if (!list) return;
	NAV_ITEMS.forEach((item) => list.appendChild(createNavItem(item)));
}

initNav(".nav-list");

gsap.registerPlugin(ScrollTrigger);

var panels = gsap.utils.toArray(".section");
panels.pop();

panels.forEach((panel, i) => {
	// Get the element holding the content inside the panel
	let innerpanel = panel.querySelector(".section-inner");

	// Get the Height of the content inside the panel
	let panelHeight = innerpanel.offsetHeight;
	console.log(panelHeight);

	// Get the window height
	let windowHeight = window.innerHeight;

	let difference = panelHeight - windowHeight;

	// ratio (between 0 and 1) representing the portion of the overall animation that's for the fake-scrolling. We know that the scale & fade should happen over the course of 1 windowHeight, so we can figure out the ratio based on how far we must fake-scroll
	let fakeScrollRatio = difference > 0 ? difference / (difference + windowHeight) : 0;

	// if we need to fake scroll (because the panel is taller than the window), add the appropriate amount of margin to the bottom so that the next element comes in at the proper time.
	if (fakeScrollRatio) {
		panel.style.marginBottom = panelHeight * fakeScrollRatio + "px";
	}

	let tl = gsap.timeline({
		scrollTrigger: {
			trigger: panel,
			start: "bottom bottom",
			end: () => (fakeScrollRatio ? `+=${innerpanel.offsetHeight}` : "bottom top"),
			pinSpacing: false,
			pin: true,
			scrub: true,
		},
	});

	// fake scroll. We use 1 because that's what the rest of the timeline consists of (0.9 scale + 0.1 fade)
	if (fakeScrollRatio) {
		tl.to(innerpanel, { yPercent: -100, y: window.innerHeight, duration: 1 / (1 - fakeScrollRatio) - 1, ease: "none" });
	}
	tl.fromTo(panel, { scale: 1, opacity: 1 }, { scale: 0.7, opacity: 0.5, duration: 0.9 }).to(panel, { opacity: 0, duration: 0.1 });
});
