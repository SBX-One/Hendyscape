gsap.registerPlugin(ScrollTrigger);
gsap.set(".flair", { xPercent: 100, yPercent: 100 });

let xTo = gsap.quickTo(".flair", "x", { duration: 0.6, ease: "power3" }),
	yTo = gsap.quickTo(".flair", "y", { duration: 0.6, ease: "power3" });

window.addEventListener("mousemove", (e) => {
	xTo(e.clientX);
	yTo(e.clientY);
});

// ============================================================
// UTILITIES
// ============================================================

/**
 * Animate elements from a starting state on scroll.
 */
function animateFrom(els, fromVars = {}, start = "top 85%") {
	if (!els) return;
	const targets = els instanceof NodeList || Array.isArray(els) ? [...els] : [els];
	if (!targets.length) return;

	gsap.from(targets, {
		scrollTrigger: {
			trigger: targets[0],
			start,
			toggleActions: "play none none none",
		},
		opacity: 0,
		duration: 0.8,
		ease: "power2.out",
		clearProps: "all",
		...fromVars,
	});
}

/**
 * Split element text into per-word spans and animate them in on scroll.
 */
function animateTextByWord(el, fromVars = {}, start = "top 85%") {
	if (!el) return;

	el.innerHTML = el.innerText
		.trim()
		.split(/\s+/)
		.map((w) => `<span class="word-wrap"><span class="word">${w}</span></span>`)
		.join(" ");

	gsap.from(el.querySelectorAll(".word"), {
		scrollTrigger: { trigger: el, start, toggleActions: "play none none none" },
		opacity: 0,
		y: 40, // Fade in dari bawah
		stagger: 0.04,
		duration: 0.6,
		ease: "power2.out",
		clearProps: "all",
		...fromVars,
	});
}

// ============================================================
// NAV
// ============================================================

function initNavAnimationDelay() {
	document.querySelectorAll("[data-index]").forEach((el) => {
		el.style.animationDelay = `${0.1 + Number(el.dataset.index) * 0.05}s`;
	});
}

// ============================================================
// ABOUT SECTION
// ============================================================

function initAboutAnimations() {
	const section = document.querySelectorAll(".slides-wrapper .section")[1];
	if (!section) return;

	animateFrom(section.querySelector(".flex.justify-between.items-center"), { y: -20, duration: 0.6 }, "top 80%");
	animateFrom(section.querySelector("h1"), { x: -60, duration: 1 }, "top 80%");
	animateFrom(section.querySelector('img[src*="about-2"]'), { y: 50, duration: 0.9 }, "top 75%");
	animateFrom(section.querySelector('img[src*="about-1"]'), { x: 60, duration: 1 }, "top 75%");
	animateFrom(section.querySelector('a[href="#"]'), { y: 20, duration: 0.6 }, "top 90%");

	section.querySelectorAll("p").forEach((p) => animateTextByWord(p, { y: 40 }, "top 85%"));
	document.querySelectorAll(".descri-text").forEach((el) => animateTextByWord(el, { duration: 0.5, y: 30 }, "top 90%"));
	document.querySelectorAll(".disclaimer-text").forEach((el) => animateTextByWord(el, { duration: 1, y: 30 }, "top 90%"));
}

function initAboutCardAnimations() {
	const quoteP = document.querySelector(".h-dvh p");
	const cards = document.querySelectorAll(".about-card");
	if (!quoteP || !cards.length) return;

	const delay = quoteP.innerText.trim().split(/\s+/).length * 0.04 + 0.3;

	gsap.from(cards, {
		scrollTrigger: { trigger: quoteP, start: "top 85%" },
		opacity: 0,
		y: 50, // Muncul dari bawah
		stagger: 0.15,
		duration: 0.7,
		ease: "power2.out",
		clearProps: "all",
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

	// Animasi item collapse muncul dari bawah
	section.querySelectorAll(".collapse-item").forEach((item, i) => {
		gsap.from(item, {
			scrollTrigger: {
				trigger: item,
				start: "top 85%",
				toggleActions: "play none none none",
			},
			opacity: 0,
			y: 50, // Dari bawah
			duration: 0.8,
			ease: "power2.out",
			clearProps: "all",
			delay: i * 0.1,
		});
	});

	animateFrom(section.querySelector(".header"), { y: -20, duration: 0.6 }, "top 80%");
	animateFrom(section.querySelector(".heading"), { x: -60, duration: 1 }, "top 80%");
}

// ============================================================
// GALLERY SECTION
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
			clearProps: "all",
		});
	});
}

// ============================================================
// COLLAPSE LOGIC
// ============================================================

function initCollapse() {
	document.querySelectorAll(".collapse-item").forEach((item) => {
		const trigger = item.querySelector(".collapse-trigger");
		const body = item.querySelector(".collapse-body");
		const imgs = body.querySelectorAll("img");

		body.style.height = "0px";
		body.style.overflow = "hidden";
		body.style.transition = "height 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
		imgs.forEach((img) => {
			img.style.opacity = "0";
			img.style.transition = "opacity 0.5s ease";
		});

		let isOpen = false;

		trigger.addEventListener("click", () => {
			if (!isOpen) {
				body.style.height = "auto";
				const fullHeight = body.scrollHeight + "px";
				body.style.height = "0px";
				body.offsetHeight;
				body.style.height = fullHeight;

				setTimeout(() => {
					imgs.forEach((img, i) => {
						setTimeout(() => {
							img.style.opacity = "1";
						}, i * 50);
					});
				}, 300);

				body.addEventListener(
					"transitionend",
					() => {
						if (isOpen) {
							body.style.height = "auto";
							ScrollTrigger.refresh();
						}
					},
					{ once: true },
				);
			} else {
				body.style.height = body.scrollHeight + "px";
				body.offsetHeight;

				imgs.forEach((img) => {
					img.style.opacity = "0";
				});
				body.style.height = "0px";

				body.addEventListener(
					"transitionend",
					() => {
						if (!isOpen) ScrollTrigger.refresh();
					},
					{ once: true },
				);
			}
			isOpen = !isOpen;
		});
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
// initScrollPin(); <- Baris ini dan fungsinya sudah dihapus total
initAboutAnimations();
initAboutCardAnimations();
initProjectAnimations();
initGalleryAnimations();
initCollapse();
initFooterAnimations();
