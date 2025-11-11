// Presentation Controller
class PresentationController {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentSlideEl = document.getElementById('currentSlide');
        this.totalSlidesEl = document.getElementById('totalSlides');
        this.progressFill = document.getElementById('progressFill');
        this.slideIndicatorsContainer = document.getElementById('slideIndicators');
        
        this.init();
    }
    
    init() {
        // Set total slides
        this.totalSlidesEl.textContent = this.totalSlides;
        
        // Create slide indicators
        this.createIndicators();
        
        // Event listeners
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
            if (e.key === 'Home') this.goToSlide(0);
            if (e.key === 'End') this.goToSlide(this.totalSlides - 1);
        });
        
        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
        
        const handleSwipe = () => {
            if (touchEndX < touchStartX - 50) this.nextSlide();
            if (touchEndX > touchStartX + 50) this.previousSlide();
        };
        
        this.handleSwipe = handleSwipe;
        
        // Initial update
        this.updateSlide();
    }
    
    createIndicators() {
        for (let i = 0; i < this.totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (i === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => this.goToSlide(i));
            this.slideIndicatorsContainer.appendChild(indicator);
        }
    }
    
    updateSlide() {
        // Update slides
        this.slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev');
            if (index === this.currentSlide) {
                slide.classList.add('active');
            } else if (index < this.currentSlide) {
                slide.classList.add('prev');
            }
        });
        
        // Update counter
        this.currentSlideEl.textContent = this.currentSlide + 1;
        
        // Update progress bar
        const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
        this.progressFill.style.width = `${progress}%`;
        
        // Update buttons
        this.prevBtn.disabled = this.currentSlide === 0;
        this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
        
        // Update indicators
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
        
        // Trigger fade-in animations
        this.animateSlideContent();
    }
    
    animateSlideContent() {
        const currentSlideEl = this.slides[this.currentSlide];
        const fadeElements = currentSlideEl.querySelectorAll('.fade-in');
        
        fadeElements.forEach((el, index) => {
            el.style.animation = 'none';
            setTimeout(() => {
                el.style.animation = `fadeIn 0.6s ease-out ${index * 0.1}s backwards`;
            }, 10);
        });
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.currentSlide++;
            this.updateSlide();
        }
    }
    
    previousSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateSlide();
        }
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides) {
            this.currentSlide = index;
            this.updateSlide();
        }
    }
}

// Initialize presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const presentation = new PresentationController();
    
    // Add fullscreen toggle (F key)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'f' || e.key === 'F') {
            toggleFullscreen();
        }
    });
    
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen error:', err);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }
    
    // Add print functionality (P key)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'p' || e.key === 'P') {
            e.preventDefault();
            window.print();
        }
    });
    
    // Prevent context menu on presentation
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
});

// Add smooth scrolling for slide content
document.querySelectorAll('.slide-content').forEach(content => {
    content.style.scrollBehavior = 'smooth';
});
