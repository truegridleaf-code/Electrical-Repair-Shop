/**
 * Truegrid leaf - High-Performance Vanilla JS
 * Production-optimized: Minimal DOM overhead, zero external dependencies.
 */
function initTruegridleaf() {
    if (window.__TRUEGRIDLEAF_INITED) return;
    window.__TRUEGRIDLEAF_INITED = true;
    // 1. Header Elevation & Back to Top
    const header = document.getElementById('mainHeader');
    const btt = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (header) {
            header.classList.toggle('shadow-xl', y > 40);
            header.classList.toggle('bg-primary-900/95', y > 40);
            header.classList.toggle('bg-primary-900/80', y <= 40);
        }
        if (btt) {
            btt.classList.toggle('opacity-100', y > 400);
            btt.classList.toggle('pointer-events-auto', y > 400);
            btt.classList.toggle('translate-y-0', y > 400);
            btt.classList.toggle('opacity-0', y <= 400);
            btt.classList.toggle('pointer-events-none', y <= 400);
            btt.classList.toggle('translate-y-4', y <= 400);
        }
    }, { passive: true });

    if (btt) btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // 2. Mobile Drawer
    const drawer = document.getElementById('mobileDrawer');
    const backdrop = document.getElementById('drawerBackdrop');
    const drawerContent = document.getElementById('drawerContent');
    const toggleDrawer = (open) => {
        if (!drawer) return;
        drawer.classList.toggle('pointer-events-none', !open);
        backdrop?.classList.toggle('opacity-100', open);
        backdrop?.classList.toggle('opacity-0', !open);
        drawerContent?.classList.toggle('translate-x-0', open);
        drawerContent?.classList.toggle('translate-x-full', !open);
        document.body.classList.toggle('overflow-hidden', open);
    };

    document.getElementById('hamburgerBtn')?.addEventListener('click', () => toggleDrawer(true));
    document.getElementById('closeDrawerBtn')?.addEventListener('click', () => toggleDrawer(false));
    backdrop?.addEventListener('click', () => toggleDrawer(false));
    document.querySelectorAll('.mobile-nav-link').forEach(l => l.addEventListener('click', () => toggleDrawer(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleDrawer(false); });

    // 3. Service Tabs
    const tabBtns = document.querySelectorAll('.service-tab-btn');
    const tabPanels = document.querySelectorAll('.tab-content');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(targetId)?.classList.add('active');
            btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });
    });

    // 4. Testimonials Slider
    const track = document.getElementById('testimonialTrack');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.getElementById('testimonialDots');
    if (track && slides.length) {
        let cur = 0;
        const total = slides.length;
        let timer;

        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.className = `h-2.5 rounded-full transition-all duration-300 ${i === 0 ? 'w-7 bg-secondary-500' : 'w-2.5 bg-slate-300'}`;
                dot.setAttribute('aria-label', `Slide ${i + 1}`);
                dot.addEventListener('click', () => { goTo(i); reset(); });
                dotsContainer.appendChild(dot);
            });
        }

        const updateDots = () => {
            dotsContainer?.querySelectorAll('button').forEach((d, i) => {
                d.className = `h-2.5 rounded-full transition-all duration-300 ${i === cur ? 'w-7 bg-secondary-500' : 'w-2.5 bg-slate-300 hover:bg-slate-400'}`;
            });
        };

        const goTo = (i) => {
            cur = (i + total) % total;
            track.style.transform = `translateX(-${cur * 100}%)`;
            updateDots();
        };

        const next = () => goTo(cur + 1);
        const prev = () => goTo(cur - 1);
        const reset = () => { clearInterval(timer); timer = setInterval(next, 5000); };

        document.getElementById('nextTestimonial')?.addEventListener('click', () => { next(); reset(); });
        document.getElementById('prevTestimonial')?.addEventListener('click', () => { prev(); reset(); });

        const container = document.getElementById('testimonialCarouselContainer');
        container?.addEventListener('mouseenter', () => clearInterval(timer));
        container?.addEventListener('mouseleave', reset);

        // Touch gestures
        let startX = 0;
        track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; clearInterval(timer); }, { passive: true });
        track.addEventListener('touchend', e => {
            const diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
            reset();
        }, { passive: true });

        reset();
    }

    // 5. Animated Counters
    const counters = document.querySelectorAll('.stat-counter');
    if (counters.length) {
        const statsSec = document.getElementById('about');
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                counters.forEach(c => {
                    const target = parseInt(c.dataset.target, 10) || 0;
                    const duration = 1800;
                    const start = performance.now();
                    const tick = (now) => {
                        const p = Math.min((now - start) / duration, 1);
                        const ease = 1 - Math.pow(1 - p, 3);
                        c.textContent = Math.floor(ease * target).toLocaleString() + '+';
                        if (p < 1) requestAnimationFrame(tick);
                        else c.textContent = target.toLocaleString() + '+';
                    };
                    requestAnimationFrame(tick);
                });
                observer.disconnect();
            }
        }, { threshold: 0.2 });
        if (statsSec) observer.observe(statsSec);
    }

    // 6. Direct WhatsApp Booking Dispatcher
    const initForm = (id) => {
        const form = document.getElementById(id);
        if (!form) return;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = form.querySelector('[name="name"]')?.value.trim();
            const phone = form.querySelector('[name="phone"]')?.value.trim();
            const service = form.querySelector('[name="service"]')?.value || 'General Inquiry';
            const message = form.querySelector('[name="message"]')?.value.trim() || 'Immediate repair assistance';

            if (!name || !phone) {
                alert('Please enter your name and phone number.');
                return;
            }

            const msg = `*⚡ Service Booking - Truegrid leaf*%0A` +
                        `------------------------------------%0A` +
                        `*Customer Name:* ${encodeURIComponent(name)}%0A` +
                        `*Phone:* ${encodeURIComponent(phone)}%0A` +
                        `*Service Needed:* ${encodeURIComponent(service)}%0A` +
                        `*Locality/Notes:* ${encodeURIComponent(message)}%0A` +
                        `------------------------------------%0A` +
                        `_Booked via Truegrid leaf official site_`;

            window.open(`https://wa.me/919582113764?text=${msg}`, '_blank');
            form.reset();
        });
    };
    initForm('heroBookingForm');
    initForm('mainContactForm');

    // 7. Dynamic Copyright Year
    const yearEl = document.getElementById('copyrightYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // 8. Nav Scrollspy
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.desktop-nav-link');
    if (sections.length && navLinks.length) {
        const navObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(link => {
                        const active = link.getAttribute('href') === `#${id}`;
                        link.classList.toggle('text-secondary-400', active);
                        link.classList.toggle('border-secondary-400', active);
                        link.classList.toggle('border-b-2', active);
                        link.classList.toggle('text-white', !active);
                    });
                }
            });
        }, { threshold: 0.25, rootMargin: '-70px 0px -50% 0px' });
        sections.forEach(s => navObserver.observe(s));
    }

    // 9. FAQ Accordion
    document.querySelectorAll('.faq-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const answer = btn.nextElementSibling;
            const icon = btn.querySelector('.faq-icon');
            const isClosed = answer?.classList.contains('hidden');

            document.querySelectorAll('.faq-answer').forEach(a => a.classList.add('hidden'));
            document.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('rotate-180'));

            if (isClosed && answer) {
                answer.classList.remove('hidden');
                icon?.classList.add('rotate-180');
            }
        });
    });
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTruegridleaf);
} else {
    initTruegridleaf();
}
