gsap.registerPlugin(ScrollTrigger);

// ============================================================
// UTILITIES
// ============================================================

/**
 * Animate elements from a starting state on scroll.
 * @param {Element|NodeList|Array} els
 * @param {Object} fromVars   - GSAP `from` overrides
 * @param {string} start      - ScrollTrigger start value (default "top 85%")
 */
function animateFrom(els, fromVars = {}, start = "top 85%") {
	if (!els) return;
	const targets = els instanceof NodeList || Array.isArray(els) ? [...els] : [els];
	if (!targets.length) return;

	gsap.from(targets, {
		scrollTrigger: { trigger: targets[0], start },
		opacity: 0,
		duration: 0.8,
		ease: "power2.out",
		...fromVars,
	});
}

/**
 * Split element text into per-word spans and animate them in on scroll.
 * @param {Element} el
 * @param {Object} fromVars
 * @param {string} start
 */
function animateTextByWord(el, fromVars = {}, start = "top 85%") {
	if (!el) return;

	el.innerHTML = el.innerText
		.trim()
		.split(/\s+/)
		.map((w) => `<span class="word-wrap"><span class="word">${w}</span></span>`)
		.join(" ");

	gsap.from(el.querySelectorAll(".word"), {
		scrollTrigger: { trigger: el, start },
		opacity: 0,
		y: 20,
		stagger: 0.04,
		duration: 0.5,
		ease: "power2.out",
		...fromVars,
	});
}

// ============================================================
// NAV — animation delay per item
// ============================================================

function initNavAnimationDelay() {
	document.querySelectorAll("[data-index]").forEach((el) => {
		el.style.animationDelay = `${0.1 + Number(el.dataset.index) * 0.05}s`;
	});
}

// ============================================================
// SCROLL PIN — stacked section scale-out effect
// ============================================================

function initScrollPin() {
	const panels = gsap.utils.toArray(".section");
	panels.pop(); // skip last section

	panels.forEach((panel) => {
		const inner = panel.querySelector(".section-inner");
		const overflow = inner.offsetHeight - window.innerHeight;
		const ratio = overflow > 0 ? overflow / (overflow + window.innerHeight) : 0;

		if (ratio) panel.style.marginBottom = `${inner.offsetHeight * ratio}px`;

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: panel,
				start: "bottom bottom",
				end: () => (ratio ? `+=${inner.offsetHeight}` : "bottom top"),
				pin: true,
				pinSpacing: false,
				scrub: true,
			},
		});

		if (ratio) {
			tl.to(inner, {
				yPercent: -100,
				y: window.innerHeight,
				duration: 1 / (1 - ratio) - 1,
				ease: "none",
			});
		}

		tl.fromTo(panel, { scale: 1, opacity: 1 }, { scale: 0.7, opacity: 0.5, duration: 0.9 }).to(panel, { opacity: 0, duration: 0.1 });
	});
}

// ============================================================
// ABOUT SECTION
// ============================================================

function initAboutAnimations() {
	const section = document.querySelectorAll(".slides-wrapper .section")[1];
	if (!section) return;

	animateFrom(section.querySelector(".flex.justify-between.items-center"), { y: -20, duration: 0.6 }, "top 80%");
	animateFrom(section.querySelector("h1.text-8xl"), { x: -60, duration: 1 }, "top 80%");
	animateFrom(section.querySelector('img[src*="about-2"]'), { y: 50, duration: 0.9 }, "top 75%");
	animateFrom(section.querySelector('img[src*="about-1"]'), { x: 60, duration: 1 }, "top 75%");
	animateFrom(section.querySelector('a[href="#"]'), { y: 20, duration: 0.6 }, "top 90%");

	section.querySelectorAll("p").forEach((p) => animateTextByWord(p, {}, "top 85%"));
	document.querySelectorAll(".descri-text").forEach((el) => animateTextByWord(el, { duration: 0.5, y: 30 }, "top 90%"));
	document.querySelectorAll(".disclaimer-text").forEach((el) => animateTextByWord(el, { duration: 1, y: 30 }, "top 90%"));
}

/**
 * Animate about-cards after the quote paragraph finishes its word animation.
 */
function initAboutCardAnimations() {
	const quoteP = document.querySelector(".h-dvh p");
	const cards = document.querySelectorAll(".about-card");
	if (!quoteP || !cards.length) return;

	const delay = quoteP.innerText.trim().split(/\s+/).length * 0.04 + 0.3;

	gsap.from(cards, {
		scrollTrigger: { trigger: quoteP, start: "top 85%" },
		opacity: 0,
		y: 30,
		stagger: 0.15,
		duration: 0.7,
		ease: "power2.out",
		delay,
	});
}

// ============================================================
// PROJECT SECTION
// ============================================================

function initProjectAnimations() {
	const section = document.querySelectorAll(".slides-wrapper .section")[2];
	if (!section) return;

	animateFrom(section.querySelector(".flex.justify-between.items-center"), { y: -20, duration: 0.6 }, "top 80%");
	animateFrom(section.querySelector("h1.text-8xl"), { x: -60, duration: 1 }, "top 80%");
	animateFrom(section.querySelectorAll(".collapse-item"), { y: 40, duration: 0.7, stagger: 0.12 }, "top 75%");
	animateFrom(section.querySelector(".header"), { y: -20, duration: 0.6 }, "top 80%");
	animateFrom(section.querySelector(".heading"), { x: -60, duration: 1 }, "top 80%");
}

// ============================================================
// GALLERY — fade in each image on scroll
// ============================================================

function initGalleryAnimations() {
	document.querySelectorAll(".cell:not(.empty)").forEach((cell) => {
		const img = cell.querySelector("img");
		if (!img) return;

		gsap.from(img, {
			scrollTrigger: { trigger: cell, start: "top 90%", toggleActions: "play none none none" },
			opacity: 0,
			y: 40,
			duration: 0.6,
			ease: "power2.out",
		});
	});
}

// ============================================================
// COLLAPSE — accordion open/close per item
// ============================================================

function initCollapse() {
	document.querySelectorAll(".collapse-item").forEach((item) => {
		const trigger = item.querySelector(".collapse-trigger");
		const body = item.querySelector(".collapse-body");
		const imgs = body.querySelectorAll("img");

		gsap.set(body, { height: 0, overflow: "hidden" });
		gsap.set(imgs, { opacity: 0 });

		const tl = gsap
			.timeline({ paused: true, reversed: true })
			.to(body, { height: "auto", duration: 1, ease: "power4.out" })
			.to(imgs, { opacity: 1, duration: 0.5, stagger: 0.05, ease: "power4.inOut" }, 0.3);

		trigger.addEventListener("click", () => tl.reversed(!tl.reversed()));
	});
}

// ============================================================
// FOOTER
// ============================================================

function initFooterAnimations() {
	const footer = document.querySelector(".footer-bg");
	if (!footer) return;

	animateFrom(footer.querySelector(".footer-title"), { x: -40, duration: 0.8 }, "top 70%");
	animateFrom(footer.querySelectorAll(".footer-nav-border"), { y: 20, duration: 0.6, stagger: 0.08 }, "top 70%");
	animateFrom(footer.querySelector(".footer-cta"), { y: 20, duration: 0.6 }, "top 70%");
	animateFrom(footer.querySelectorAll(".footer-info"), { y: 30, duration: 0.7, stagger: 0.15 }, "top 85%");
	animateFrom(footer.querySelector(".footer-bottom"), { y: 15, duration: 0.5 }, "bottom 100%");

	const tagline = footer.querySelector(".footer-tagline");
	if (tagline) animateTextByWord(tagline, { duration: 0.55, y: 25 }, "top 80%");
}

// ============================================================
// INIT
// ============================================================

initNavAnimationDelay();
initScrollPin();
initAboutAnimations();
initAboutCardAnimations();
initProjectAnimations();
initGalleryAnimations();
initCollapse();
initFooterAnimations();
