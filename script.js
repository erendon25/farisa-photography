document.addEventListener('DOMContentLoaded', () => {

    // Lógica para el seguimiento del mouse y el revelado dinámico del Hero
    const hero = document.querySelector('.hero'); // Captura el contenedor principal del Hero
    const heroReveal = document.querySelector('.hero-reveal'); // Captura la imagen que se revela (en color/nítida)
    const focusFrame = document.querySelector('.focus-frame'); // Captura el recuadro blanco (el marco físico)

    // Verifica si todos los elementos necesarios existen antes de ejecutar el código
    if (hero && heroReveal && focusFrame) {
    // MOTOR DE FLUIDEZ (LERP) - ESTILO EXVIA
    // Este motor crea el efecto "mantequilla" donde el marco sigue al mouse con una inercia elegante.
    let targetX = window.innerWidth / 2; // Punto de destino (mouse)
    let targetY = window.innerHeight / 2; // Punto de destino (mouse)
    let currentX = targetX; // Posición actual del marco
    let currentY = targetY; // Posición actual del marco
    
    // Función de interpolación lineal (Lerp)
    // Función de interpolación lineal (Lerp)
    const lerp = (start, end, factor) => start + (end - start) * factor;

    const animateFocus = () => {
        const isMobile = window.innerWidth < 992;
        
        // Suavizamos el movimiento
        currentX = lerp(currentX, targetX, 0.08);
        currentY = lerp(currentY, targetY, 0.08);

        const rect = hero.getBoundingClientRect();

        // 1. Mueve el marco físico (solo visible en desktop por CSS)
        focusFrame.style.left = `${currentX}px`;
        focusFrame.style.top = `${currentY}px`;

        // 2. Sincroniza la máscara de revelado (clip-path)
        // Reducimos el tamaño del revelado en móviles para un look más íntimo
        const frameSize = isMobile ? 220 : 350; 
        const halfSize = frameSize / 2;

        const top = currentY - halfSize;
        const left = currentX - halfSize;
        const bottom = rect.height - (currentY + halfSize);
        const right = rect.width - (currentX + halfSize);

        heroReveal.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px)`;

        requestAnimationFrame(animateFocus);
    };

    if (hero && heroReveal && focusFrame) {
        animateFocus(); // Inicia el motor de animación

        // Escucha el movimiento del mouse para actualizar solo el 'target'
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            targetX = e.clientX - rect.left;
            targetY = e.clientY - rect.top;
        });

        // Al salir, el target vuelve al centro suavemente
        hero.addEventListener('mouseleave', () => {
            const rect = hero.getBoundingClientRect();
            targetX = rect.width / 2;
            targetY = rect.height / 2;
        });

        // Al redimensionar, recalcula el centro
        window.addEventListener('resize', () => {
            const rect = hero.getBoundingClientRect();
            targetX = rect.width / 2;
            targetY = rect.height / 2;
        });
    }
    }

    // Selección de elementos para revelado dinámico
    const reveals = document.querySelectorAll('.reveal');

    // Configuración de IntersectionObserver para una navegación más fluida
    const observerOptions = {
        threshold: 0.25, // Activa cuando el 25% de la sección es visible
        rootMargin: "-10% 0px -10% 0px" // Margen de seguridad para el área activa
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Actualiza el estado activo en los enlaces de navegación
                const id = entry.target.getAttribute('id');
                if (id) {
                    const navLinks = document.querySelectorAll('.nav-links a');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }

                // Activa las animaciones de revelado suave
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    // Observa tanto las secciones (para nav) como los elementos individuales con clase reveal
    document.querySelectorAll('section, header, .reveal').forEach(el => {
        navObserver.observe(el);
    });

    // Control de desplazamiento horizontal (Rueda + Arrastrar)
    const horizontalSections = document.querySelectorAll('.gallery-scroll, .services-grid, .plans-grid, .blog-grid');
    
    horizontalSections.forEach(section => {
        // 1. Desplazamiento con la rueda del ratón (Vertical a Horizontal)
        section.addEventListener('wheel', (evt) => {
            const canScrollRight = section.scrollLeft < (section.scrollWidth - section.clientWidth) - 1;
            const canScrollLeft = section.scrollLeft > 1;

            if ((evt.deltaY > 0 && canScrollRight) || (evt.deltaY < 0 && canScrollLeft)) {
                evt.preventDefault();
                section.scrollLeft += evt.deltaY * 1.5;
            }
        }, { passive: false });

        // 2. Funcionalidad de "Arrastrar para Deslizar" (Click and Drag)
        let isDown = false;
        let startX;
        let scrollLeft;

        section.addEventListener('mousedown', (e) => {
            isDown = true;
            section.classList.add('grabbing');
            startX = e.pageX - section.offsetLeft;
            scrollLeft = section.scrollLeft;
        });

        section.addEventListener('mouseleave', () => {
            isDown = false;
            section.classList.remove('grabbing');
        });

        section.addEventListener('mouseup', () => {
            isDown = false;
            section.classList.remove('grabbing');
        });

        section.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - section.offsetLeft;
            const walk = (x - startX) * 2; // Velocidad de arrastre
            section.scrollLeft = scrollLeft - walk;
        });
    });

    // Cursor personalizado con seguimiento para todas las secciones deslizables
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = '<span>Deslizar</span>';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    // Activa el cursor en todas las áreas con scroll horizontal
    const slideAreas = document.querySelectorAll('.gallery-container, .services-grid, .plans-grid');
    slideAreas.forEach(area => {
        area.addEventListener('mouseenter', () => cursor.classList.add('active'));
        area.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
    // Simulación de envío de formulario mejorada
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.textContent;
            
            btn.textContent = 'Enviando...';
            btn.style.opacity = '0.7';
            
            setTimeout(() => {
                btn.textContent = '¡Enviado!';
                btn.style.backgroundColor = '#4CAF50';
                form.reset();
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.opacity = '1';
                }, 3000);
            }, 1500);
        });
    }

    // --- Lógica de Modal para Servicios ---
    const serviceData = {
        editorial: {
            title: "Moda & Editorial",
            description: "Creación de narrativas visuales de alto impacto para marcas y publicaciones. Nos enfocamos en la estética vanguardista y la perfección técnica.",
            images: [
                "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&q=80"
            ]
        },
        eventos: {
            title: "Eventos & Bodas",
            description: "Documentación elegante de los momentos más importantes. Un enfoque cinematográfico que captura la emoción genuina y los detalles de lujo.",
            images: [
                "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1465495910483-db4428cca99a?auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80"
            ]
        },
        arquitectura: {
            title: "Arquitectura & Lux",
            description: "Resaltamos la simetría, la iluminación y la esencia del espacio arquitectónico. Fotografía de precisión para estudios y constructoras.",
            images: [
                "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1503387762-592dea58ef21?auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
            ]
        }
    };

    const modal = document.getElementById('service-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-description');
    const modalGallery = document.getElementById('modal-gallery');
    const closeModal = document.querySelector('.close-modal');

    document.querySelectorAll('.service-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const serviceKey = btn.closest('.service-card').dataset.service;
            const data = serviceData[serviceKey];
            if (data && modal) {
                modalTitle.textContent = data.title;
                modalDesc.textContent = data.description;
                modalGallery.innerHTML = '';
                data.images.forEach(imgUrl => {
                    const img = document.createElement('img');
                    img.src = imgUrl;
                    img.alt = data.title;
                    modalGallery.appendChild(img);
                });
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    const closeHandler = () => {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    };

    if (closeModal) closeModal.addEventListener('click', closeHandler);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeHandler();
    });
});
