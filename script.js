gsap.registerPlugin(ScrollTrigger);
gsap.set(".flair", { xPercent: 100, yPercent: 100 });

let xTo = gsap.quickTo(".flair", "x", { duration: 0.6, ease: "power3" }),
	yTo = gsap.quickTo(".flair", "y", { duration: 0.6, ease: "power3" });

window.addEventListener("mousemove", (e) => {
	xTo(e.clientX);
	yTo(e.clientY);
});

// ============================================================
// SCROLL FADE-IN SYSTEM
// ============================================================
//
// Tambahkan class berikut ke elemen HTML mana saja,
// animasi akan otomatis jalan saat elemen masuk viewport.
//
// CLASS YANG TERSEDIA:
//   fade-up        → muncul dari bawah ke atas       (default)
//   fade-down      → muncul dari atas ke bawah
//   fade-left      → muncul dari kanan ke kiri
//   fade-right     → muncul dari kiri ke kanan
//   fade-in        → muncul di tempat (opacity saja)
//
// MODIFIER OPSIONAL (bisa dikombinasikan):
//   fade-delay-1   → delay 100ms
//   fade-delay-2   → delay 200ms
//   fade-delay-3   → delay 300ms
//   fade-delay-4   → delay 400ms
//   fade-delay-5   → delay 500ms
//
// CONTOH PEMAKAIAN DI HTML:
//   <h1 class="fade-right">About Us</h1>
//   <img class="fade-up fade-delay-2" src="..." />
//   <p class="fade-left fade-delay-1">Lorem ipsum...</p>
// ============================================================

const FADE_CONFIG = {
	"fade-up": { y: 50, x: 0 },
	"fade-down": { y: -50, x: 0 },
	"fade-left": { x: 60, y: 0 },
	"fade-right": { x: -60, y: 0 },
	"fade-in": { x: 0, y: 0 },
};

const DELAY_MAP = {
	"fade-delay-1": 0.1,
	"fade-delay-2": 0.2,
	"fade-delay-3": 0.3,
	"fade-delay-4": 0.4,
	"fade-delay-5": 0.5,
};

function initScrollFade() {
	const allClasses = Object.keys(FADE_CONFIG);

	allClasses.forEach((fadeClass) => {
		document.querySelectorAll(`.${fadeClass}`).forEach((el) => {
			// Cari delay modifier kalau ada
			let delay = 0;
			for (const [delayClass, delayVal] of Object.entries(DELAY_MAP)) {
				if (el.classList.contains(delayClass)) {
					delay = delayVal;
					break;
				}
			}

			const { x, y } = FADE_CONFIG[fadeClass];

			gsap.from(el, {
				scrollTrigger: {
					trigger: el,
					start: "top 88%",
					toggleActions: "play none none none",
				},
				opacity: 0,
				x,
				y,
				duration: 0.75,
				delay,
				ease: "power2.out",
				clearProps: "all",
			});
		});
	});
}

// ============================================================
// UTILITIES
// ============================================================

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
		y: 40,
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
		y: 50,
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

	section.querySelectorAll(".collapse-item").forEach((item, i) => {
		gsap.from(item, {
			scrollTrigger: {
				trigger: item,
				start: "top 85%",
				toggleActions: "play none none none",
			},
			opacity: 0,
			y: 50,
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

function openCollapse(body, imgs) {
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
}

function closeCollapse(body, imgs) {
	body.style.height = body.scrollHeight + "px";
	body.offsetHeight;
	imgs.forEach((img) => {
		img.style.opacity = "0";
	});
	body.style.height = "0px";
}

function initCollapseHint(item) {
	const body = item.querySelector(".collapse-body");
	const imgs = body.querySelectorAll("img");

	ScrollTrigger.create({
		trigger: item,
		start: "top 60%",
		once: true,
		onEnter: () => {
			// Buka setelah 600ms (biar fade-in item-nya kelar dulu)
			setTimeout(() => {
				openCollapse(body, imgs);

				// Tutup lagi setelah 1.8s
				setTimeout(() => {
					closeCollapse(body, imgs);
					body.addEventListener(
						"transitionend",
						() => {
							ScrollTrigger.refresh();
						},
						{ once: true },
					);
				}, 1800);
			}, 600);
		},
	});
}

function initCollapse() {
	document.querySelectorAll(".collapse-item").forEach((item, index) => {
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

		// Hint hanya untuk collapse pertama
		if (index === 0) initCollapseHint(item);

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

window.addEventListener("DOMContentLoaded", () => {
	initScrollFade(); // ← sistem class fade universal, jalankan pertama
	initNavAnimationDelay();
	initAboutAnimations();
	initAboutCardAnimations();
	initProjectAnimations();
	initGalleryAnimations();
	initCollapse();
	initFooterAnimations();
	initSidebar();
});

function initSidebar() {
	const hamBtn = document.getElementById("ham-btn");
	const sidebar = document.getElementById("sidebar");
	const overlay = document.getElementById("sidebar-overlay");
	const closeBtn = document.getElementById("sidebar-close");

	function openSidebar() {
		sidebar.classList.remove("-translate-y-full");
		overlay.classList.remove("opacity-0", "pointer-events-none");
		overlay.classList.add("opacity-100");
		document.body.style.overflow = "hidden";
	}

	function closeSidebar() {
		sidebar.classList.add("-translate-y-full");
		overlay.classList.add("opacity-0", "pointer-events-none");
		overlay.classList.remove("opacity-100");
		document.body.style.overflow = "";
	}

	hamBtn.addEventListener("click", openSidebar);
	closeBtn.addEventListener("click", closeSidebar);
	overlay.addEventListener("click", closeSidebar);
}
