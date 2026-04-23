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

const FADE_CONFIG = {
	"fade-up": { y: 60, x: 0 },
	"fade-down": { y: -60, x: 0 },
	"fade-left": { x: -100, y: 20 },
	"fade-right": { x: 100, y: 20 },
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
			// Skip for sticky section elements on desktop to avoid conflict
			if (window.innerWidth >= 768 && el.closest("#about-card-section")) return;
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
					start: "top 92%",
					toggleActions: "play none none none",
				},
				opacity: 0,
				x,
				y,
				duration: 1.2,
				delay,
				ease: "power3.out",
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
		duration: 1.0,
		ease: "power3.out",
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
		duration: 0.8,
		ease: "power3.out",
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
// HERO ENTRANCE ANIMATION (after preloader)
// ============================================================

function initHeroEntrance() {
	// Remove loading class to allow CSS animations on rest of page
	document.body.classList.remove("is-loading");

	const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

	// --- Navbar ---
	const logo = document.querySelector('[data-index="1"].flex.gap-2');
	const navLinks = document.querySelectorAll('.animate-fade-in-top.nav-border');
	const hamBtn = document.getElementById('ham-btn');

	// --- Hero ---
	const headerLetters = document.querySelectorAll('.header-text .animate-fade-in-text');
	const descriText = document.querySelector('.descri-text');
	const disclaimerText = document.querySelector('.disclaimer-text');
	const exploreBtn = document.querySelector('a.nav-black.animate-fade-in-text');
	const heroImg = document.querySelector('.slides-wrapper .section:first-child img');

	// Set initial states with GSAP (override CSS)
	if (logo) gsap.set(logo, { opacity: 0, y: -30 });
	if (navLinks.length) gsap.set(navLinks, { opacity: 0, y: -30 });
	if (hamBtn) gsap.set(hamBtn, { opacity: 0, y: -20 });
	if (headerLetters.length) gsap.set(headerLetters, { opacity: 0, y: 50 });
	if (descriText) gsap.set(descriText, { opacity: 0, y: 30 });
	if (disclaimerText) gsap.set(disclaimerText, { opacity: 0, y: 20 });
	if (exploreBtn) gsap.set(exploreBtn, { opacity: 0, y: 25 });
	if (heroImg) gsap.set(heroImg, { opacity: 0, y: 80, scale: 1.05 });

	// --- Build timeline ---

	// 1. Logo drops in
	if (logo) {
		tl.to(logo, { opacity: 1, y: 0, duration: 0.6 }, 0);
	}

	// 2. Ham button (mobile)
	if (hamBtn) {
		tl.to(hamBtn, { opacity: 1, y: 0, duration: 0.5 }, 0.1);
	}

	// 3. Nav links stagger in
	if (navLinks.length) {
		tl.to(navLinks, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06 }, 0.15);
	}

	// 4. Header letters cascade up
	if (headerLetters.length) {
		tl.to(headerLetters, {
			opacity: 1,
			y: 0,
			duration: 0.7,
			stagger: 0.04,
			ease: "power4.out"
		}, 0.25);
	}

	// 5. Description text
	if (descriText) {
		tl.to(descriText, { opacity: 1, y: 0, duration: 0.8 }, 0.7);
	}

	// 6. Disclaimer text
	if (disclaimerText) {
		tl.to(disclaimerText, { opacity: 1, y: 0, duration: 0.7 }, 0.85);
	}

	// 7. Explore More button
	if (exploreBtn) {
		tl.to(exploreBtn, { opacity: 1, y: 0, duration: 0.6 }, 0.9);
	}

	// 8. Hero image — dramatic reveal
	if (heroImg) {
		tl.to(heroImg, {
			opacity: 1,
			y: 0,
			scale: 1,
			duration: 0.3,
			ease: "power2.out"
		}, 0.6);
	}

	// Clear inline styles after all animations complete
	tl.eventCallback("onComplete", () => {
		const allTargets = [logo, hamBtn, descriText, disclaimerText, exploreBtn, heroImg];
		allTargets.forEach(el => { if (el) gsap.set(el, { clearProps: "all" }); });
		if (navLinks.length) gsap.set(navLinks, { clearProps: "all" });
		if (headerLetters.length) gsap.set(headerLetters, { clearProps: "all" });
	});
}

// ============================================================
// HERO SCROLL EFFECT
// ============================================================

function initHeroScrollEffect() {
	const heroSection = document.getElementById("hero-section");
	const heroImg = document.querySelector(".slides-wrapper .section:first-child img");

	if (!heroSection || !heroImg) return;

	// Fade out text section as we scroll down
	gsap.to(heroSection, {
		scrollTrigger: {
			trigger: heroSection,
			start: "top top",
			end: "bottom top",
			scrub: true,
		},
		opacity: 0,
		scale: 0.95,
		y: -50,
		ease: "none",
	});

	// Scale up image "to the top" as it comes into view
	gsap.to(heroImg, {
		scrollTrigger: {
			trigger: ".slides-wrapper .section:first-child",
			start: "top bottom",
			end: "center center",
			scrub: true,
		},
		scale: 1.2,
		y: -20,
		ease: "none",
	});
}

// ============================================================
// ABOUT SECTION
// ============================================================

function initAboutAnimations() {
	const section = document.querySelectorAll(".slides-wrapper .section")[1];
	if (!section) return;

	animateFrom(section.querySelector(".flex.justify-between.items-center"), { y: -20, duration: 0.6 }, "top 80%");
	// Rely on fade classes for h1/h2 to avoid conflict
	animateFrom(section.querySelector('img[src*="about-2"]'), { y: 50, duration: 0.9 }, "top 75%");
	animateFrom(section.querySelector('img[src*="about-1"]'), { x: 60, duration: 1 }, "top 75%");
	animateFrom(section.querySelector('a[href="#"]'), { y: 20, duration: 0.6 }, "top 90%");

	section.querySelectorAll("p").forEach((p) => {
		if (p.closest("#about-card-section")) return;
		animateTextByWord(p, { y: 40 }, "top 85%");
	});
	document.querySelectorAll(".descri-text").forEach((el) => animateTextByWord(el, { duration: 0.5, y: 30 }, "top 90%"));
	document.querySelectorAll(".disclaimer-text").forEach((el) => animateTextByWord(el, { duration: 1, y: 30 }, "top 90%"));
}

// ============================================================
// ABOUT CARD — STICKY SCROLL REVEAL
// ============================================================

function initAboutCardScrollReveal() {
	const section = document.getElementById("about-card-section");
	if (!section) return;

	const quoteP = section.querySelector("p");
	const cards = [...section.querySelectorAll(".about-card")];
	if (!quoteP || !cards.length) return;

	let mm = gsap.matchMedia();

	// Only run on desktop/tablet (min-width: 768px)
	mm.add("(min-width: 768px)", () => {
		// --- Wrap quote words, start very dim (gray look) ---
		const rawWords = quoteP.innerText.trim().split(/\s+/);
		quoteP.innerHTML = rawWords.map((w) => `<span class="word-wrap" style="display:inline-block; margin-right: 0.25em;"><span class="word-q" style="display:inline-block; color: #000;">${w}</span></span>`).join("");
		const wordEls = [...quoteP.querySelectorAll(".word-q")];
		
		// Set initial states
		gsap.set(wordEls, { opacity: 0.2 });
		cards.forEach((card) => {
			const img = card.querySelector("img");
			const label = card.querySelector("h1");
			if (img) gsap.set(img, { opacity: 0.3, filter: "blur(15px)", scale: 0.9 });
			if (label) gsap.set(label, { opacity: 0, y: 20 });
		});

		// --- GSAP scrub timeline with PIN ---
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: section,
				start: "top top",
				end: "+=1500",
				pin: true,
				scrub: 1,
				invalidateOnRefresh: true,
				pinSpacing: true,
				anticipatePin: 1
			},
		});

		// 1. Animate Text (0% to 40%)
		const textPartEnd = 0.4;
		wordEls.forEach((w, i) => {
			tl.to(w, { 
				opacity: 1, 
				duration: 0.4, 
				ease: "power1.inOut" 
			}, (i / wordEls.length) * textPartEnd);
		});

		// 2. Animate Cards (40% to 100%)
		const cardStep = (1 - textPartEnd) / cards.length;
		cards.forEach((card, ci) => {
			const img = card.querySelector("img");
			const label = card.querySelector("h1");
			const startAt = textPartEnd + ci * cardStep;

			if (img) {
				tl.to(img, {
					opacity: 1,
					filter: "blur(0px)",
					scale: 1,
					duration: cardStep,
					ease: "power2.inOut"
				}, startAt);
			}
			if (label) {
				tl.to(label, {
					opacity: 1,
					y: 0,
					duration: cardStep * 0.5,
					ease: "power2.out"
				}, startAt + cardStep * 0.2);
			}
		});

		return () => {
			// Cleanup if screen resized back to mobile
			gsap.set(wordEls, { clearProps: "all" });
			cards.forEach((card) => {
				gsap.set([card.querySelector("img"), card.querySelector("h1")], { clearProps: "all" });
			});
		};
	});

	// Mobile branch (< 768px)
	mm.add("(max-width: 767px)", () => {
		// Word by word reveal for mobile
		animateTextByWord(quoteP, { y: 30, duration: 1.0, ease: "power3.out" }, "top 92%");
		
		// Staggered cards for mobile
		cards.forEach((card, i) => {
			animateFrom(card, { y: 60, duration: 1.2, delay: i * 0.15, ease: "power3.out" }, "top 92%");
		});

		return () => {
			gsap.set(quoteP, { clearProps: "all" });
			cards.forEach((card) => gsap.set(card, { clearProps: "all" }));
		};
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
	// Rely on fade classes for heading to avoid conflict
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
			setTimeout(() => {
				openCollapse(body, imgs);
				setTimeout(() => {
					closeCollapse(body, imgs);
					body.addEventListener(
						"transitionend",
						() => {
							// No refresh needed here as it returns to original height
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
							// Removed refresh to prevent jumps
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
						if (!isOpen) {
							// Removed refresh to prevent jumps
						}
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
// SIDEBAR
// ============================================================

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

// ============================================================
// PRELOADER
// ============================================================

function preloadAssets() {
	return new Promise((resolve) => {
		const preloader = document.getElementById("preloader");
		const bar = document.getElementById("preloader-bar");
		const percentEl = document.getElementById("preloader-percent");

		// Lock scroll during loading
		document.body.style.overflow = "hidden";

		// Collect all image sources from the page
		const imgEls = document.querySelectorAll("img");
		const sources = new Set();
		imgEls.forEach((img) => {
			if (img.src && !img.src.startsWith("data:")) sources.add(img.src);
		});

		// Also collect background images from CSS
		document.querySelectorAll("*").forEach((el) => {
			const bg = getComputedStyle(el).backgroundImage;
			if (bg && bg !== "none") {
				const match = bg.match(/url\(["']?(.+?)["']?\)/);
				if (match && match[1] && !match[1].startsWith("data:")) {
					sources.add(match[1]);
				}
			}
		});

		const total = sources.size;
		if (total === 0) {
			finishPreloader(preloader, resolve);
			return;
		}

		let loaded = 0;
		let displayedPercent = 0;
		let animFrame;

		// Smoothly animate the displayed percentage
		function animatePercent() {
			const targetPercent = Math.round((loaded / total) * 100);
			if (displayedPercent < targetPercent) {
				displayedPercent += Math.max(1, Math.ceil((targetPercent - displayedPercent) * 0.15));
				if (displayedPercent > targetPercent) displayedPercent = targetPercent;
			}
			bar.style.width = displayedPercent + "%";
			percentEl.textContent = displayedPercent + "%";

			if (displayedPercent < 100) {
				animFrame = requestAnimationFrame(animatePercent);
			} else {
				cancelAnimationFrame(animFrame);
				// Small delay for the bar to visually reach 100%
				setTimeout(() => finishPreloader(preloader, resolve), 400);
			}
		}

		function onAssetLoad() {
			loaded++;
			if (loaded === 1) animatePercent(); // Start smooth animation on first load
			if (loaded >= total && displayedPercent < 100) {
				// Force reach 100 if all loaded but animation hasn't caught up
				displayedPercent = 99; // Let animation tick to 100
			}
		}

		sources.forEach((src) => {
			const img = new Image();
			img.onload = onAssetLoad;
			img.onerror = onAssetLoad; // Count errors too so we don't hang
			img.src = src;
		});

		// Start the animation loop
		animatePercent();

		// Safety timeout: reveal after 8 seconds even if some assets fail
		setTimeout(() => {
			if (displayedPercent < 100) {
				displayedPercent = 100;
				bar.style.width = "100%";
				percentEl.textContent = "100%";
				setTimeout(() => finishPreloader(preloader, resolve), 300);
			}
		}, 8000);
	});
}

function finishPreloader(preloader, resolve) {
	let resolved = false;
	preloader.classList.add("loaded");
	document.body.style.overflow = "";

	function done() {
		if (resolved) return;
		resolved = true;
		if (preloader.parentNode) preloader.remove();
		resolve();
	}

	// Remove preloader from DOM after transition
	preloader.addEventListener("transitionend", done, { once: true });

	// Fallback if transitionend doesn't fire
	setTimeout(done, 1000);
}

// ============================================================
// INIT — preload assets first, then fire all animations
// ============================================================

window.addEventListener("DOMContentLoaded", async () => {
	// Wait for all assets to load
	await preloadAssets();

	// Play hero entrance animation first
	initHeroEntrance();
	initHeroScrollEffect();

	initNavAnimationDelay();
	initAboutAnimations();
	
	// Initialize in DOM order for correct ScrollTrigger calculations
	// The Pinning section must be initialized before elements below it
	initAboutCardScrollReveal();

	initProjectAnimations();
	initGalleryAnimations();
	initCollapse();
	initFooterAnimations();

	// Initialize general fades after pinning to ensure correct positions
	initScrollFade();
	
	initSidebar();

	// Final refresh to lock in all positions
	ScrollTrigger.refresh();
});

