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
    // 2. Founding Members Counter — Live from Google Sheets
    // ─────────────────────────────────────────
    const counterEl      = document.querySelector('#founding-counter span');
    const counterSection = document.querySelector('.counter-section');
    let counterDone      = false;

    // Fetch count from Column A — reads the VALUE of the last non-blank cell
    // (Column A contains serial/row numbers, so lastValue = total member count)
    async function fetchMemberCount() {
        const SHEET_ID = '1-3MBoO6Z88cNmEqfrr_YjCSX95v4m7-NEIkvY2RyQ50';
        // Use A1:A so gviz correctly identifies row 1 as the header
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&range=A1:A`;
        try {
            const res  = await fetch(url);
            const text = await res.text();
            // Strip JSONP wrapper: /*O_o*/\ngoogle.visualization.Query.setResponse({...});
            const jsonStr = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
            const data    = JSON.parse(jsonStr);
            const rows    = data.table.rows;

            // Walk through rows and track the last non-null value
            let lastValue = null;
            for (const row of rows) {
                const cell = row.c && row.c[0];
                if (cell && cell.v !== null && cell.v !== '') {
                    lastValue = Math.round(cell.v); // v is a float like 3.0 → 3
                } else {
                    break; // Stop at first blank cell
                }
            }
            return lastValue; // null if sheet is empty (falls back to hardcoded)
        } catch (e) {
            console.warn('Could not fetch member count from Google Sheets:', e);
            return null;
        }
    }

    function animateCounter(target) {
        if (!counterEl) return;
        const start = Math.max(0, target - 30);
        let count = start;
        const tick = () => {
            if (count < target) {
                count++;
                counterEl.textContent = count.toLocaleString('en-IN');
                setTimeout(tick, 55);
            } else {
                counterEl.textContent = target.toLocaleString('en-IN');
            }
        };
        setTimeout(tick, 400);
    }

    if (counterEl && counterSection) {
        // Pre-fetch the count so it's ready when the section scrolls into view
        let liveCount = null;
        fetchMemberCount().then(count => { liveCount = count; });

        const counterObs = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !counterDone) {
                counterDone = true;
                // Use live count if available, otherwise fall back to hardcoded
                const target = liveCount !== null ? liveCount : 1284;
                animateCounter(target);
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
