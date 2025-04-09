// Canvas arka plan animasyonu
document.addEventListener('DOMContentLoaded', function() {
    // Canvas elementini al
    const canvas = document.getElementById('background-canvas');
    const ctx = canvas.getContext('2d');

    // Canvas boyutunu pencere boyutuna ayarla
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // İlk yüklemede ve pencere boyutu değiştiğinde canvas'ı yeniden boyutlandır
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Dalga animasyonu için parametreler
    const waves = {
        count: 5,
        y: [], // y pozisyonları
        length: [], // dalga uzunluğu
        speed: [], // dalga hızı
        height: [], // dalga yüksekliği
        color: [
            'rgba(45, 10, 90, 0.2)',
            'rgba(65, 20, 120, 0.2)',
            'rgba(85, 30, 160, 0.2)',
            'rgba(105, 40, 200, 0.2)',
            'rgba(125, 50, 230, 0.2)'
        ]
    };

    // Dalgaları başlat
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

    // Parçacıklar için parametreler
    const particles = [];
    const particleCount = 60;
    const maxSize = 2;
    
    // Parçacıkları başlat
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

    // Animasyon fonksiyonu
    function animate() {
        // Canvas'ı temizle
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Koyu arka plan
        ctx.fillStyle = '#0f0b1e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Gradyan arka plan
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#0f0b1e');
        gradient.addColorStop(1, '#1a1040');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Dalgaları çiz
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
        
        // Parçacıkları çiz
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.closePath();
            
            ctx.fillStyle = `rgba(138, 43, 226, ${p.opacity})`;
            ctx.fill();
            
            // Parçacıkları hareket ettir
            p.y -= p.speed;
            
            // Ekranın dışına çıkan parçacıkları yeniden konumlandır
            if (p.y < -10) {
                p.y = canvas.height + 10;
                p.x = Math.random() * canvas.width;
            }
        }
        
        // Çizgisel parlama efekti ekle
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

        // Animasyonu tekrarla
        requestAnimationFrame(animate);
    }

    // Animasyonu başlat
    animate();

    // Yukarı çıkma butonu
    const backToTopButton = document.getElementById('back-to-top');
    
    // Scroll olayını dinle
    window.addEventListener('scroll', function() {
        // Sayfanın en üstünden belirli bir mesafe kaydırıldıysa butonu göster
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    // Butona tıklandığında sayfa en üste kaydırılır
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Form gönderimi
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form verilerini al
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Normalde burada form verilerini bir API'ye göndeririz
            // Bu örnek için sadece konsola yazdırıyoruz
            console.log('Form gönderildi:', { name, email, message });
            
            // Başarılı gönderim mesajı
            const successMsg = currentLanguage === 'tr' 
                ? 'Mesajınız başarıyla gönderildi! Teşekkür ederiz.'
                : 'Your message has been sent successfully! Thank you.';
            
            alert(successMsg);
            
            // Formu temizle
            contactForm.reset();
        });
    }
    
    // Projeler için hover efekti
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Sosyal medya ikonları için hover efekti
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

// Dil ayarları ve değiştirme fonksiyonu
let currentLanguage = 'tr'; // Varsayılan dil: Türkçe

// Tarayıcı diline göre başlangıç dilini ayarla
function detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    // Eğer tarayıcı dili Türkçe ise (tr, tr-TR vb)
    if (browserLang.substring(0, 2) === 'tr') {
        currentLanguage = 'tr';
        changeLanguage('tr');
        // TR butonunu aktif yap
        document.getElementById('lang-tr').classList.add('active');
        document.getElementById('lang-en').classList.remove('active');
    } else {
        // Diğer tüm diller için İngilizce göster
        currentLanguage = 'en';
        changeLanguage('en');
        // EN butonunu aktif yap
        document.getElementById('lang-tr').classList.remove('active');
        document.getElementById('lang-en').classList.add('active');
    }
}

// Tüm metinleri belirlenen dile çevir
function changeLanguage(lang) {
    currentLanguage = lang;
    
    // Tüm dil özellikli elemanları seç
    const elements = document.querySelectorAll('[data-en], [data-tr]');
    
    // HTML elementlerindeki dil özelliğine göre metinleri güncelle
    elements.forEach(element => {
        if (element.hasAttribute(`data-${lang}`)) {
            element.textContent = element.getAttribute(`data-${lang}`);
        }
    });
    
    // Özel durumlar: başlık etiketi için data-text özelliğini güncelle
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
    
    // Sayfa başlığını (title) değiştir
    if (lang === 'en') {
        document.title = "Welcome - Wilwaerin";
    } else {
        document.title = "Hoş Geldiniz - Wilwaerin";
    }
    
    // Butonların aktiflik durumunu güncelle
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`lang-${lang}`).classList.add('active');
    
    // HTML lang özelliğini güncelle
    document.documentElement.lang = lang;
    
    // Tercih edilen dili localStorage'a kaydet
    localStorage.setItem('preferredLanguage', lang);
}

// Sayfa yüklendiğinde tarayıcı dilini algılayarak dili ayarla
document.addEventListener('DOMContentLoaded', function() {
    // Dil algılamasını çağır
    detectBrowserLanguage();
    
    // Dil değiştirme butonlarına tıklandığında dili değiştir
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
    
    // Glitch efektini arttırmak için rastgele aralıklarla tetikle
    setInterval(() => {
        const glitchText = document.querySelector('.glitch-text');
        if (glitchText) {
            // Glitch efektini tetiklemek için class ekle/çıkar
            glitchText.classList.add('glitch-active');
            
            // Kısa bir süre sonra efekti kaldır
            setTimeout(() => {
                glitchText.classList.remove('glitch-active');
            }, 200);
        }
    }, 3000);

    // Navigasyon kaydırma animasyonu
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

    // Sayfa kaydırıldığında projelerin ve diğer elementlerin animasyonla görünmesi
    window.addEventListener('scroll', function() {
        const elements = document.querySelectorAll('.project-card, .about-container, .timeline-item');
        
        elements.forEach(element => {
            // Elemanın sayfada görünüp görünmediğini kontrol et
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight - 100;
            
            if (isVisible) {
                element.classList.add('animate-in');
            }
        });
    });

    // Sayfa yüklendiğinde Google Fonts'u ekle
    function loadGoogleFonts() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700&family=Press+Start+2P&display=swap';
        document.head.appendChild(link);
    }

    // Fontları yükle
    loadGoogleFonts();
});
