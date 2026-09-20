document.addEventListener("DOMContentLoaded", () => {

    /* ================= MOBILE MENU ================= */

    const menuBtn = document.querySelector(".menu-btn");
    const navLinks = document.querySelector(".nav-links");

    if (menuBtn && navLinks) {
        menuBtn.addEventListener("click", () => {
            navLinks.classList.toggle("show");
            menuBtn.textContent =
                navLinks.classList.contains("show") ? "✕" : "☰";
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("show");
                menuBtn.textContent = "☰";
            });
        });
    }

    /* ================= ACTIVE PAGE ================= */

    const currentPage =
        window.location.pathname.split("/").pop() || "sdspc.html";

    document.querySelectorAll(".nav-links a").forEach(link => {
        const href = link.getAttribute("href");

        if (href === currentPage) {
            link.classList.add("active");
        }
    });

    /* ================= HERO SLIDER ================= */

    const slides = document.querySelectorAll(".hero-slide");
    const dots = document.querySelectorAll(".slider-dot");

    if (slides.length > 0) {

        let current = 0;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle("active", i === index);
            });

            dots.forEach((dot, i) => {
                dot.classList.toggle("active", i === index);
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                current = index;
                showSlide(current);
            });
        });

        setInterval(() => {
            current = (current + 1) % slides.length;
            showSlide(current);
        }, 5000);
    }

    /* ================= REVEAL ================= */

    const revealItems = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        },
        { threshold: 0.12 }
    );

    revealItems.forEach(item => observer.observe(item));

    /* ================= COURSE FILTER ================= */

    const filterButtons = document.querySelectorAll(".filter-btn");
    const courseCards = document.querySelectorAll("[data-course]");

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            filterButtons.forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            const filter = button.dataset.filter;

            courseCards.forEach(card => {

                if (
                    filter === "all" ||
                    card.dataset.course === filter
                ) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }

            });
        });

    });

    /* ================= GALLERY LIGHTBOX ================= */

    const galleryItems = document.querySelectorAll(".gallery-item");
    const lightbox = document.querySelector(".lightbox");
    const lightboxImage = document.querySelector(".lightbox img");
    const lightboxClose = document.querySelector(".lightbox-close");

    galleryItems.forEach(item => {

        item.addEventListener("click", () => {

            const image = item.querySelector("img");

            if (!image || !lightbox || !lightboxImage) return;

            lightboxImage.src = image.src;
            lightbox.classList.add("show");
        });

    });

    if (lightboxClose) {
        lightboxClose.addEventListener("click", () => {
            lightbox.classList.remove("show");
        });
    }

    if (lightbox) {
        lightbox.addEventListener("click", e => {
            if (e.target === lightbox) {
                lightbox.classList.remove("show");
            }
        });
    }

    /* ================= CONTACT FORM ================= */

    const contactForm = document.querySelector("#contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", e => {
            e.preventDefault();

            alert(
                "Thank you for contacting Shaheed Darshan Singh Pheruman Memorial College. Your enquiry has been received."
            );

            contactForm.reset();
        });
    }

});
