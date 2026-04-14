document.addEventListener('DOMContentLoaded', () => {

    // ─────────────────────────────────────────
    // 1. Sticky / frosted-glass nav on scroll
    // ─────────────────────────────────────────
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // ─────────────────────────────────────────
    // 1b. Mobile Navigation Toggle
    // ─────────────────────────────────────────
    const navToggle = document.getElementById('mobile-nav-toggle');
    const navLinks  = document.getElementById('nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ─────────────────────────────────────────
    // 2. Counter animation (triggers when section enters viewport)
    // ─────────────────────────────────────────
    const counterEl      = document.querySelector('#founding-counter span');
    const counterSection = document.querySelector('.counter-section');
    let counterDone      = false;

    if (counterEl && counterSection) {
        const counterObs = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !counterDone) {
                counterDone = true;
                let count   = 1250;
                const target = 1284;
                const tick = () => {
                    if (count < target) {
                        count++;
                        counterEl.textContent = count.toLocaleString();
                        setTimeout(tick, 50);
                    } else {
                        counterEl.textContent = target.toLocaleString();
                    }
                };
                setTimeout(tick, 400);
            }
        }, { threshold: 0.3 });
        counterObs.observe(counterSection);
    }

    // ─────────────────────────────────────────
    // 3. Parallax effects on scroll
    // ─────────────────────────────────────────
    const heroBg       = document.getElementById('hero-bg');
    const runnerStage  = document.getElementById('runner-stage');
    const heroContent  = document.getElementById('hero-content');
    const productImg   = document.getElementById('product-img');
    const productFrame = document.getElementById('product-frame');

    const onParallax = () => {
        // Only run parallax on desktop / larger tablets (width > 1024px)
        if (window.innerWidth <= 1024) return;

        const sy = window.scrollY;

        // Hero background drifts at 45% of scroll speed
        if (heroBg) {
            heroBg.style.transform = `translateY(${sy * 0.45}px)`;
        }

        // Hero text content drifts at 15%
        if (heroContent) {
            heroContent.style.transform = `translateY(${sy * 0.15}px)`;
        }

        // Running figure drifts at 25%
        if (runnerStage) {
            runnerStage.style.transform = `translateY(${sy * 0.25}px)`;
        }

        // Product image parallax — relative to its own section position
        if (productImg && productFrame) {
            const rect     = productFrame.getBoundingClientRect();
            const inView   = rect.bottom > 0 && rect.top < window.innerHeight;
            if (inView) {
                const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                productImg.style.transform = `scale(1.07) translateY(${(0.5 - progress) * 44}px)`;
            }
        }
    };

    window.addEventListener('scroll', onParallax, { passive: true });

    // ─────────────────────────────────────────
    // 4. Fade-in on scroll (IntersectionObserver)
    // ─────────────────────────────────────────
    const fadeObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObs.unobserve(entry.target); // fire once only
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('section').forEach(sec => {
        sec.classList.add('fade-in');
        fadeObs.observe(sec);
    });

});
