document.querySelectorAll("[data-index]").forEach((el) => {
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

// ============================================
// UTILITY: Animasi general (fade/slide)
// ============================================

function animateFrom(elements, fromVars = {}, scrollTriggerConfig = {}) {
	if (!elements) return;

	const els = elements instanceof NodeList || Array.isArray(elements) ? Array.from(elements) : [elements];

	if (els.length === 0) return;

	gsap.from(els, {
		scrollTrigger: {
			trigger: els[0],
			start: "top 85%",
			...scrollTriggerConfig,
		},
		opacity: 0,
		duration: 0.8,
		ease: "power2.out",
		...fromVars,
	});
}

// ============================================
// UTILITY: Split teks jadi per-kata & animasi
// ============================================

function animateTextByWord(element, fromVars = {}, scrollTriggerConfig = {}) {
	if (!element) return;

	const words = element.innerText.trim().split(/\s+/);
	element.innerHTML = words.map((word) => `<span class="word-wrap"><span class="word">${word}</span></span>`).join(" ");

	const wordEls = element.querySelectorAll(".word");

	gsap.from(wordEls, {
		scrollTrigger: {
			trigger: element,
			start: "top 85%",
			...scrollTriggerConfig,
		},
		opacity: 0,
		y: 20,
		stagger: 0.04,
		duration: 0.5,
		ease: "power2.out",
		...fromVars,
	});
}

// ============================================
// GSAP SCROLL PIN
// ============================================

var panels = gsap.utils.toArray(".section");
panels.pop();

panels.forEach((panel, i) => {
	let innerpanel = panel.querySelector(".section-inner");

	let panelHeight = innerpanel.offsetHeight;
	let windowHeight = window.innerHeight;
	let difference = panelHeight - windowHeight;
	let fakeScrollRatio = difference > 0 ? difference / (difference + windowHeight) : 0;

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

	if (fakeScrollRatio) {
		tl.to(innerpanel, { yPercent: -100, y: window.innerHeight, duration: 1 / (1 - fakeScrollRatio) - 1, ease: "none" });
	}
	tl.fromTo(panel, { scale: 1, opacity: 1 }, { scale: 0.7, opacity: 0.5, duration: 0.9 }).to(panel, { opacity: 0, duration: 0.1 });
});

// ============================================
// ABOUT SECTION - Scroll Animations
// ============================================

const aboutSection = document.querySelectorAll(".slides-wrapper .section")[1];

if (aboutSection) {
	animateFrom(aboutSection.querySelector(".flex.justify-between.items-center"), { y: -20, duration: 0.6 }, { start: "top 80%" });
	animateFrom(aboutSection.querySelector("h1.text-8xl"), { x: -60, duration: 1 }, { start: "top 80%" });

	aboutSection.querySelectorAll("p").forEach((p) => {
		animateTextByWord(p, {}, { start: "top 85%" });
	});

	animateFrom(aboutSection.querySelector('img[src*="about-2"]'), { y: 50, duration: 0.9 }, { start: "top 75%" });
	animateFrom(aboutSection.querySelector('img[src*="about-1"]'), { x: 60, duration: 1 }, { start: "top 75%" });

	const contactLink = aboutSection.querySelector('a[href="#"]');
	animateFrom(contactLink, { y: 20, duration: 0.6 }, { start: "top 90%" });

	document.querySelectorAll(".descri-text").forEach((el) => {
		animateTextByWord(el, { duration: 0.5, y: 30 }, { start: "top 90%" });
	});
	document.querySelectorAll(".disclaimer-text").forEach((el) => {
		animateTextByWord(el, { duration: 1, y: 30 }, { start: "top 90%" });
	});
}

// ============================================
// ABOUT CARDS - Muncul setelah paragraf selesai
// ============================================

const quoteP = document.querySelector(".h-dvh p");
const aboutCards = document.querySelectorAll(".about-card");

if (quoteP && aboutCards.length > 0) {
	const wordCount = quoteP.innerText.trim().split(/\s+/).length;
	const estimatedDelay = wordCount * 0.04 + 0.3;

	gsap.from(aboutCards, {
		scrollTrigger: {
			trigger: quoteP,
			start: "top 85%",
		},
		opacity: 0,
		y: 30,
		stagger: 0.15,
		duration: 0.7,
		ease: "power2.out",
		delay: estimatedDelay,
	});
}

// ============================================
// PROJECT SECTION - Scroll Animations
// ============================================

const projectSection = document.querySelectorAll(".slides-wrapper .section")[2];

if (projectSection) {
	// Header bar: 03 / Project / Hendyscape
	animateFrom(projectSection.querySelector(".flex.justify-between.items-center"), { y: -20, duration: 0.6 }, { start: "top 80%" });

	// "Latest Project" title — slide dari kanan
	animateFrom(projectSection.querySelector("h1.text-8xl"), { x: 60, duration: 1 }, { start: "top 80%" });

	// Tiap collapse-item fade in stagger dari bawah
	animateFrom(projectSection.querySelectorAll(".collapse-item"), { y: 40, duration: 0.7, stagger: 0.12 }, { start: "top 75%" });
}

// ============================================
// COLLAPSE - Per item, pakai class bukan id
// ============================================

document.querySelectorAll(".collapse-item").forEach((item) => {
	const trigger = item.querySelector(".collapse-trigger");
	const body = item.querySelector(".collapse-body");
	const imgs = body.querySelectorAll("img");

	// Set initial state
	gsap.set(body, { height: 0, overflow: "hidden" });
	gsap.set(imgs, { opacity: 0 });

	// Tiap item punya timeline sendiri
	const tl = gsap
		.timeline({ paused: true })
		.to(body, {
			height: "auto",
			duration: 1,
			ease: "power4.out",
		})
		.to(
			imgs,
			{
				opacity: 1,
				duration: 0.5,
				stagger: 0.05,
				ease: "power4.inOut",
			},
			0.3,
		)
		.reverse();

	trigger.addEventListener("click", () => {
		tl.reversed(!tl.reversed());
	});
});
