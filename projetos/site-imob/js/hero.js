// Hero Canvas Animation Logic

const canvas = document.getElementById('hero-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

if (canvas) {
    const frameCount = 80;
    const images = [];
    let loadedImages = 0;
    const currentFrame = { index: 0 };
    let targetFrameIndex = 0;

    // Helper to get image path
    const getImagePath = (index) => {
        const num = index.toString().padStart(3, '0');
        return `imagens/frame_${num}.jpg`;
    };

    // Resize canvas to full screen
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        render(Math.round(currentFrame.index));
    }

    // Draw image covering the canvas (object-fit: cover equivalent)
    function drawImageCover(img) {
        if (!img) return;
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        
        let drawWidth = canvas.width;
        let drawHeight = canvas.height;
        let offsetX = 0;
        let offsetY = 0;

        if (canvasRatio > imgRatio) {
            drawHeight = canvas.width / imgRatio;
            offsetY = (canvas.height - drawHeight) / 2;
        } else {
            drawWidth = canvas.height * imgRatio;
            offsetX = (canvas.width - drawWidth) / 2;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }

    // Render a specific frame
    function render(index) {
        if (images[index] && images[index].complete) {
            drawImageCover(images[index]);
        }
    }

    // Preload images
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = getImagePath(i);
        img.onload = () => {
            loadedImages++;
            // Initial render when first image loads
            if (i === 0) {
                resizeCanvas();
                canvas.classList.add('loaded');
                
                // Hide loader
                const loader = document.getElementById('loader');
                if (loader) {
                    loader.classList.add('hidden');
                }
            }
        };
        images.push(img);
    }

    window.addEventListener('resize', resizeCanvas);

    // Scroll Logic
    window.addEventListener('scroll', () => {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;
        
        // Calculate scroll progress within the hero section
        const heroHeight = heroSection.offsetHeight - window.innerHeight;
        // Avoid division by zero or negative values
        if (heroHeight <= 0) return;
        
        const scrollFraction = Math.max(0, Math.min(1, window.scrollY / heroHeight));
        
        targetFrameIndex = Math.floor(scrollFraction * (frameCount - 1));
    });

    // Animation Loop with Easing for smooth transition
    function loop() {
        // Easing factor (lower is smoother but slower to reach target)
        const ease = 0.08;
        currentFrame.index += (targetFrameIndex - currentFrame.index) * ease;
        
        // Only render if there's a meaningful change
        if (Math.abs(targetFrameIndex - currentFrame.index) > 0.01) {
            render(Math.round(currentFrame.index));
        }
        
        requestAnimationFrame(loop);
    }
    
    // Start loop
    loop();
}
