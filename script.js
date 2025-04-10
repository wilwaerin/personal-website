
document.addEventListener('DOMContentLoaded', function() {
    // Yükleme durumunu takip etmek için
    let resourcesLoaded = false;
    let animationStarted = false;
    let fontsLoaded = false;
    let timeoutElapsed = false;
    

    function hideLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.visibility = 'hidden';
            }, 500);
        }
    }


    function checkPageReady() {
        // Tüm kritik bileşenler yüklendiyse loading ekranını gizle
        if ((resourcesLoaded && animationStarted && fontsLoaded) || timeoutElapsed) {
            console.log("Sayfa yüklendi: ", {
                resourcesLoaded,
                animationStarted,
                fontsLoaded,
                timeoutElapsed
            });
            hideLoading();
        }
    }


    window.addEventListener('load', function() {
        resourcesLoaded = true;
        checkPageReady();
    });
    

    setTimeout(function() {
        timeoutElapsed = true;
        checkPageReady();
    }, 5000);
    

    document.fonts.ready.then(function() {
        fontsLoaded = true;
        checkPageReady();
    });
    

    const canvas = document.getElementById('background-canvas');
    const ctx = canvas.getContext('2d');


    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }


    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);


    const waves = {
        count: 5,
        y: [], 
        length: [], 
        speed: [], 
        height: [], 
        color: [
            'rgba(45, 10, 90, 0.2)',
            'rgba(65, 20, 120, 0.2)',
            'rgba(85, 30, 160, 0.2)',
            'rgba(105, 40, 200, 0.2)',
            'rgba(125, 50, 230, 0.2)'
        ]
    };


    function initWaves() {
        for (let i = 0; i < waves.count; i++) {
            waves.y[i] = canvas.height * (0.5 + 0.1 * i);
            waves.length[i] = canvas.width * (1.5 - 0.15 * i);
            waves.speed[i] = 0.5 + 0.2 * i;
            waves.height[i] = 20 + 10 * i;
        }
    }

    initWaves();
    window.addEventListener('resize', initWaves);


    const particles = [];
    const particleCount = 60;
    const maxSize = 2;
    

    function initParticles() {
        particles.length = 0;
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * maxSize + 1,
                speed: Math.random() * 0.5 + 0.2,
                opacity: Math.random() * 0.5 + 0.2,
                color: '#8a2be2'
            });
        }
    }

    initParticles();
    window.addEventListener('resize', initParticles);


    function animate() {
        
        if (!animationStarted) {
            animationStarted = true;
            checkPageReady();
        }


        ctx.clearRect(0, 0, canvas.width, canvas.height);
        

        ctx.fillStyle = '#0f0b1e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        

        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#0f0b1e');
        gradient.addColorStop(1, '#1a1040');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);


        const time = Date.now() / 1000;
        
        for (let i = 0; i < waves.count; i++) {
            ctx.beginPath();
            ctx.moveTo(0, waves.y[i]);
            
            for (let x = 0; x < canvas.width; x++) {
                const dx = x / waves.length[i];
                const offsetX = Math.sin(dx * 6.28 + time * waves.speed[i]) * waves.height[i];
                const y = waves.y[i] + offsetX;
                ctx.lineTo(x, y);
            }
            
            ctx.lineTo(canvas.width, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.closePath();
            ctx.fillStyle = waves.color[i];
            ctx.fill();
        }
        

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.closePath();
            
            ctx.fillStyle = `rgba(138, 43, 226, ${p.opacity})`;
            ctx.fill();
            

            p.y -= p.speed;
            
            if (p.y < -10) {
                p.y = canvas.height + 10;
                p.x = Math.random() * canvas.width;
            }
        }
        

        const lineCount = 2;
        const time2 = Date.now() / 5000;
        
        for (let i = 0; i < lineCount; i++) {
            const y = (Math.sin(time2 + i) * 0.5 + 0.5) * canvas.height;
            
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.strokeStyle = `rgba(0, 218, 255, ${0.1 - Math.abs(Math.sin(time2 + i)) * 0.05})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }


        requestAnimationFrame(animate);
    }


    animate();


    const backToTopButton = document.getElementById('back-to-top');
    

    window.addEventListener('scroll', function() {

        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    

    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });


    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            

            console.log('Form gönderildi:', { name, email, message });
            

            const successMsg = currentLanguage === 'tr' 
                ? 'Mesajınız başarıyla gönderildi! Teşekkür ederiz.'
                : 'Your message has been sent successfully! Thank you.';
            
            alert(successMsg);
            

            contactForm.reset();
        });
    }
    

    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    

    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) rotate(10deg)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotate(0)';
        });
    });
});


let currentLanguage = 'tr'; 


function detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;

    if (browserLang.substring(0, 2) === 'tr') {
        currentLanguage = 'tr';
        changeLanguage('tr');

        document.getElementById('lang-tr').classList.add('active');
        document.getElementById('lang-en').classList.remove('active');
    } else {

        currentLanguage = 'en';
        changeLanguage('en');

        document.getElementById('lang-tr').classList.remove('active');
        document.getElementById('lang-en').classList.add('active');
    }
}


function changeLanguage(lang) {
    currentLanguage = lang;
    

    const elements = document.querySelectorAll('[data-en], [data-tr]');
    

    elements.forEach(element => {
        if (element.hasAttribute(`data-${lang}`)) {
            element.textContent = element.getAttribute(`data-${lang}`);
        }
    });
    

    const glitchText = document.querySelector('.glitch-text');
    if (glitchText) {
        if (lang === 'en') {
            glitchText.setAttribute('data-text', "Hello, I'm Berkay");
            glitchText.innerHTML = "Hello, I'm <span class='highlight'>Berkay</span>";
        } else {
            glitchText.setAttribute('data-text', "Merhaba, ben Berkay");
            glitchText.innerHTML = "Merhaba, ben <span class='highlight'>Berkay</span>";
        }
    }
    

    if (lang === 'en') {
        document.title = "Welcome - Wilwaerin";
    } else {
        document.title = "Hoş Geldiniz - Wilwaerin";
    }
    

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`lang-${lang}`).classList.add('active');
    

    document.documentElement.lang = lang;
    

    localStorage.setItem('preferredLanguage', lang);
}


document.addEventListener('DOMContentLoaded', function() {

    detectBrowserLanguage();
    

    document.getElementById('lang-tr').addEventListener('click', function() {
        changeLanguage('tr');
        document.getElementById('lang-tr').classList.add('active');
        document.getElementById('lang-en').classList.remove('active');
    });
    
    document.getElementById('lang-en').addEventListener('click', function() {
        changeLanguage('en');
        document.getElementById('lang-tr').classList.remove('active');
        document.getElementById('lang-en').classList.add('active');
    });
    

    setInterval(() => {
        const glitchText = document.querySelector('.glitch-text');
        if (glitchText) {

            glitchText.classList.add('glitch-active');
            

            setTimeout(() => {
                glitchText.classList.remove('glitch-active');
            }, 200);
        }
    }, 3000);


    document.querySelectorAll('nav a, .cta-button').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        });
    });


    window.addEventListener('scroll', function() {
        const elements = document.querySelectorAll('.project-card, .about-container, .timeline-item');
        
        elements.forEach(element => {

            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight - 100;
            
            if (isVisible) {
                element.classList.add('animate-in');
            }
        });
    });


    function loadGoogleFonts() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700&family=Press+Start+2P&display=swap';
        document.head.appendChild(link);
    }


    loadGoogleFonts();
});
