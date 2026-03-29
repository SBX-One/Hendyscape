// ============================================
// GSAP PLUGIN REGISTRATION
// ============================================

gsap.registerPlugin(ScrollTrigger);

// ============================================
// CONSTANTS
// ============================================

const NAV_ITEMS = [
	{ label: "Service", href: "#" },
	{ label: "Gallery", href: "#" },
	{ label: "Home", href: "#" },
	{ label: "Project", href: "#" },
	{ label: "About", href: "#" },
];

// ============================================
// UTILITIES
// ============================================

/**
 * Animasi fade/slide dari posisi tertentu dengan ScrollTrigger.
 * @param {Element|NodeList|Array} elements - Target elemen
 * @param {Object} fromVars - GSAP from vars tambahan
 * @param {Object} scrollTriggerConfig - Konfigurasi ScrollTrigger tambahan
 */
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

/**
 * Pecah teks elemen jadi per-kata, lalu animasikan tiap kata satu per satu.
 * @param {Element} element - Target elemen
 * @param {Object} fromVars - GSAP from vars tambahan
 * @param {Object} scrollTriggerConfig - Konfigurasi ScrollTrigger tambahan
 */
function animateTextByWord(element, fromVars = {}, scrollTriggerConfig = {}) {
	if (!element) return;

	const words = element.innerText.trim().split(/\s+/);
	element.innerHTML = words.map((word) => `<span class="word-wrap"><span class="word">${word}</span></span>`).join(" ");

	gsap.from(element.querySelectorAll(".word"), {
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
// NAVIGATION
// ============================================

/**
 * Set delay animasi per-item berdasarkan atribut data-index.
 */
function initNavAnimationDelay() {
	document.querySelectorAll("[data-index]").forEach((el) => {
		const i = Number(el.dataset.index);
		el.style.animationDelay = `${0.1 + i * 0.05}s`;
	});
}

/**
 * SVG arrow icon.
 * @param {string} stroke - Warna stroke
 * @returns {string}
 */
function ARROW_SVG(stroke) {
	return `
		<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M4 14L14 4M14 4H7M14 4V11" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
	`;
}

/**
 * Buat satu elemen nav item.
 * @param {Object} param0 - { label, href }
 * @returns {HTMLElement}
 */
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

	const arrowDark = document.createElement("div");
	arrowDark.className = "arrow-dark";
	arrowDark.innerHTML = ARROW_SVG("#000");

	const arrowWhite = document.createElement("div");
	arrowWhite.className = "arrow-white";
	arrowWhite.innerHTML = ARROW_SVG("#fff");

	arrowWrap.append(arrowDark, arrowWhite);
	a.append(curtain, text, arrowWrap);
	li.appendChild(a);

	return li;
}

/**
 * Render semua nav item ke dalam selector list.
 * @param {string} selector - CSS selector untuk ul.nav-list
 */
function initNav(selector) {
	const list = document.querySelector(selector);
	if (!list) return;
	NAV_ITEMS.forEach((item) => list.appendChild(createNavItem(item)));
}

// ============================================
// SCROLL PIN — SECTION STACK EFFECT
// ============================================

/**
 * Inisialisasi efek pin & scale-out untuk setiap section (kecuali yang terakhir).
 */
function initScrollPin() {
	const panels = gsap.utils.toArray(".section");
	panels.pop(); // Kecualikan section terakhir

	panels.forEach((panel) => {
		const inner = panel.querySelector(".section-inner");
		const panelHeight = inner.offsetHeight;
		const windowHeight = window.innerHeight;
		const difference = panelHeight - windowHeight;
		const fakeScrollRatio = difference > 0 ? difference / (difference + windowHeight) : 0;

		if (fakeScrollRatio) {
			panel.style.marginBottom = panelHeight * fakeScrollRatio + "px";
		}

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: panel,
				start: "bottom bottom",
				end: () => (fakeScrollRatio ? `+=${inner.offsetHeight}` : "bottom top"),
				pinSpacing: false,
				pin: true,
				scrub: true,
			},
		});

		if (fakeScrollRatio) {
			tl.to(inner, {
				yPercent: -100,
				y: windowHeight,
				duration: 1 / (1 - fakeScrollRatio) - 1,
				ease: "none",
			});
		}

		tl.fromTo(panel, { scale: 1, opacity: 1 }, { scale: 0.7, opacity: 0.5, duration: 0.9 }).to(panel, { opacity: 0, duration: 0.1 });
	});
}

// ============================================
// ABOUT SECTION — SCROLL ANIMATIONS
// ============================================

function initAboutAnimations() {
	const section = document.querySelectorAll(".slides-wrapper .section")[1];
	if (!section) return;

	animateFrom(section.querySelector(".flex.justify-between.items-center"), { y: -20, duration: 0.6 }, { start: "top 80%" });

	animateFrom(section.querySelector("h1.text-8xl"), { x: -60, duration: 1 }, { start: "top 80%" });

	section.querySelectorAll("p").forEach((p) => {
		animateTextByWord(p, {}, { start: "top 85%" });
	});

	animateFrom(section.querySelector('img[src*="about-2"]'), { y: 50, duration: 0.9 }, { start: "top 75%" });

	animateFrom(section.querySelector('img[src*="about-1"]'), { x: 60, duration: 1 }, { start: "top 75%" });

	animateFrom(section.querySelector('a[href="#"]'), { y: 20, duration: 0.6 }, { start: "top 90%" });

	document.querySelectorAll(".descri-text").forEach((el) => {
		animateTextByWord(el, { duration: 0.5, y: 30 }, { start: "top 90%" });
	});

	document.querySelectorAll(".disclaimer-text").forEach((el) => {
		animateTextByWord(el, { duration: 1, y: 30 }, { start: "top 90%" });
	});
}

// ============================================
// ABOUT CARDS — MUNCUL SETELAH PARAGRAF SELESAI
// ============================================

function initAboutCardAnimations() {
	const quoteP = document.querySelector(".h-dvh p");
	const aboutCards = document.querySelectorAll(".about-card");
	if (!quoteP || aboutCards.length === 0) return;

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
// PROJECT SECTION — SCROLL ANIMATIONS
// ============================================

function initProjectAnimations() {
	const section = document.querySelectorAll(".slides-wrapper .section")[2];
	if (!section) return;

	// Header bar project
	animateFrom(section.querySelector(".flex.justify-between.items-center"), { y: -20, duration: 0.6 }, { start: "top 80%" });

	// Judul "Latest Project"
	animateFrom(section.querySelector("h1.text-8xl"), { x: -60, duration: 1 }, { start: "top 80%" });

	// Tiap collapse item
	animateFrom(section.querySelectorAll(".collapse-item"), { y: 40, duration: 0.7, stagger: 0.12 }, { start: "top 75%" });

	// Header bar gallery
	animateFrom(section.querySelector(".header"), { y: -20, duration: 0.6 }, { start: "top 80%" });

	// Judul "Architectural Archive"
	animateFrom(section.querySelector(".heading"), { x: -60, duration: 1 }, { start: "top 80%" });
}

// ============================================
// GALLERY — GAMBAR MUNCUL SATU PER SATU
// ============================================

function initGalleryAnimations() {
	const galleryCells = document.querySelectorAll(".cell:not(.empty)");
	if (galleryCells.length === 0) return;

	galleryCells.forEach((cell) => {
		const img = cell.querySelector("img");
		if (!img) return;

		gsap.from(img, {
			scrollTrigger: {
				trigger: cell,
				start: "top 90%",
				toggleActions: "play none none none",
			},
			opacity: 0,
			y: 40,
			duration: 0.6,
			ease: "power2.out",
		});
	});
}

// ============================================
// COLLAPSE — BUKA/TUTUP PER ITEM
// ============================================

function initCollapse() {
	document.querySelectorAll(".collapse-item").forEach((item) => {
		const trigger = item.querySelector(".collapse-trigger");
		const body = item.querySelector(".collapse-body");
		const imgs = body.querySelectorAll("img");

		gsap.set(body, { height: 0, overflow: "hidden" });
		gsap.set(imgs, { opacity: 0 });

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
}

// ============================================
// FOOTER INNER — SHRINK & SLIDE DOWN
//
// Efek:
// 1. Saat footer-bg mulai masuk viewport, footer-inner
//    mengisi penuh lebar & tinggi footer (seperti cover).
// 2. Saat di-scroll, gambar mengecil (scale down) dari
//    atas ke bawah, seolah "terseret" turun.
// 3. Berhenti di pertengahan antara footer-outer-img
//    dan footer-bg — yaitu sekitar 50% dari atas footer.
// ============================================

function initFooterInner() {
	const footerBg = document.querySelector(".footer-bg");
	const innerImg = document.querySelector("#footer-inner");
}

function initFooterAnimations() {
	const footerBg = document.querySelector(".footer-bg");
	if (!footerBg) return;

	// Nama "Hendyscape" — slide dari kiri
	animateFrom(footerBg.querySelector(".footer-title"), { x: -40, duration: 0.8 }, { start: "top 70%" });

	// Nav footer — stagger fade dari bawah
	animateFrom(footerBg.querySelectorAll(".footer-nav-border"), { y: 20, duration: 0.6, stagger: 0.08 }, { start: "top 70%" });

	// CTA "Explore More"
	animateFrom(footerBg.querySelector(".footer-cta"), { y: 20, duration: 0.6 }, { start: "top 70%" });

	// Tagline — word by word, sama seperti paragraf about
	const tagline = footerBg.querySelector(".footer-tagline");
	if (tagline) {
		animateTextByWord(tagline, { duration: 0.55, y: 25 }, { start: "top 80%" });
	}

	// Info blocks (address, email, phone) — stagger fade dari bawah
	animateFrom(footerBg.querySelectorAll(".footer-info"), { y: 30, duration: 0.7, stagger: 0.15 }, { start: "top 85%" });

	// Bottom bar copyright & links
	animateFrom(footerBg.querySelector(".footer-bottom"), { y: 15, duration: 0.5 }, { start: "bottom 100%" });
}

initNavAnimationDelay();
initNav(".nav-list");
initScrollPin();
initAboutAnimations();
initAboutCardAnimations();
initProjectAnimations();
initGalleryAnimations();
initCollapse();
initFooterInner();
initFooterAnimations();
