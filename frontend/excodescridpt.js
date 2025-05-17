document.addEventListener('DOMContentLoaded', () => {
    const autoSlideTimers = {};

    // Initialize both sliders
    initSlider('features', true, 5000);
    initSlider('how-it-works', true, 5000);

    function initSlider(sectionId, autoSlide = false, interval = 5000) {
        const slider = document.querySelector(`#${sectionId} .feature-slider`);
        const slides = document.querySelectorAll(`#${sectionId} .feature-card`);
        const controls = document.getElementById(`${sectionId}-slider-controls`);
        const isMobile = window.innerWidth < 768;

        if (!slider || !slides.length || !controls) return;

        // Reset controls
        controls.innerHTML = '';

        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            dot.dataset.index = i;
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(sectionId, i));
            controls.appendChild(dot);
        });

        setupSlides(sectionId);

        window.addEventListener('resize', () => setupSlides(sectionId));

        if (autoSlide) {
            startAutoSlide(sectionId, interval);

            const wrapper = document.querySelector(`#${sectionId} .feature-slider-container`);
            ['mouseenter', 'touchstart'].forEach(evt =>
                wrapper.addEventListener(evt, () => stopAutoSlide(sectionId))
            );
            ['mouseleave', 'touchend'].forEach(evt =>
                wrapper.addEventListener(evt, () => startAutoSlide(sectionId, interval))
            );
        }
    }

    function setupSlides(sectionId) {
        const slides = document.querySelectorAll(`#${sectionId} .feature-card`);
        const slider = document.querySelector(`#${sectionId} .feature-slider`);
        const isMobile = window.innerWidth < 768;

        slides.forEach(slide => {
            slide.style.display = '';
            slide.style.flex = '';
            slide.style.minWidth = '';
        });

        if (isMobile) {
            slides.forEach((slide, i) => {
                slide.style.display = i === 0 ? 'block' : 'none';
                slide.style.width = '100%';
            });
        } else {
            const visible = Math.min(3, slides.length);
            const cardWidth = 100 / visible;
            slides.forEach(slide => {
                slide.style.flex = `0 0 ${cardWidth}%`;
                slide.style.minWidth = `${cardWidth}%`;
            });
            slider.style.transform = 'translateX(0%)';
        }

        updateDots(sectionId, 0);
    }

    function goToSlide(sectionId, index) {
        const slides = document.querySelectorAll(`#${sectionId} .feature-card`);
        const slider = document.querySelector(`#${sectionId} .feature-slider`);
        const isMobile = window.innerWidth < 768;
        const total = slides.length;
        const clampedIndex = Math.max(0, Math.min(index, total - 1));

        if (isMobile) {
            slides.forEach((slide, i) => {
                slide.style.display = i === clampedIndex ? 'block' : 'none';
            });
        } else {
            const visible = Math.min(3, total);
            const cardWidth = 100 / visible;
            let translateX = -clampedIndex * cardWidth;
            const maxTranslate = -(total - visible) * cardWidth;
            translateX = Math.max(translateX, maxTranslate);
            translateX = Math.min(translateX, 0);
            slider.style.transform = `translateX(${translateX}%)`;
        }

        updateDots(sectionId, clampedIndex);
    }

    function updateDots(sectionId, activeIndex) {
        const dots = document.querySelectorAll(`#${sectionId}-slider-controls .slider-dot`);
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === activeIndex);
        });
    }

    function getCurrentIndex(sectionId) {
        const active = document.querySelector(`#${sectionId}-slider-controls .slider-dot.active`);
        return active ? parseInt(active.dataset.index) : 0;
    }

    function startAutoSlide(sectionId, interval) {
        stopAutoSlide(sectionId);
        const slides = document.querySelectorAll(`#${sectionId} .feature-card`);
        autoSlideTimers[sectionId] = setInterval(() => {
            const current = getCurrentIndex(sectionId);
            const next = (current + 1) % slides.length;
            goToSlide(sectionId, next);
        }, interval);
    }

    function stopAutoSlide(sectionId) {
        if (autoSlideTimers[sectionId]) {
            clearInterval(autoSlideTimers[sectionId]);
            delete autoSlideTimers[sectionId];
        }
    }
});
