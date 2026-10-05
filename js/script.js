
const RANKING_NPOINT_ENDPOINT = "https://api.npoint.io/e2c585386a70aed45f48";

document.addEventListener("DOMContentLoaded", () => {


    const typedElement = document.getElementById("typed-text");
    const phrases = [
        "Aprende. Colabora. Construye.",
        "Programming Communities.",
        "El código se vuelve comunidad.",
        "SerakDepMS Studios."
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 65;
    const deletingSpeed = 35;
    const pauseBetween = 1800;

    function typeLoop() {
        if (!typedElement) return;
        const currentPhrase = phrases[phraseIndex];

        if (!isDeleting) {
            typedElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentPhrase.length) {
                isDeleting = true;
                setTimeout(typeLoop, pauseBetween);
                return;
            }
            setTimeout(typeLoop, typingSpeed);
        } else {
            typedElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(typeLoop, 400);
                return;
            }
            setTimeout(typeLoop, deletingSpeed);
        }
    }
    typeLoop();

    const rankingStatus = document.getElementById("simple-ranking-status");
    const rankingTableWrap = document.getElementById("simple-ranking-table-wrap");
    const rankingRows = document.getElementById("simple-ranking-rows");

    async function loadSimpleRanking() {
        rankingStatus.hidden = false;
        rankingStatus.classList.remove("error");
        rankingStatus.textContent = "Cargando ranking...";
        rankingTableWrap.hidden = true;

        try {
            const response = await fetch(RANKING_NPOINT_ENDPOINT, { cache: "no-store" });
            if (!response.ok) throw new Error(`La solicitud respondió con el estado ${response.status}.`);

            const data = await response.json();
            if (!data || !Array.isArray(data.ranking)) {
                throw new Error("La respuesta no contiene una lista de posiciones válida.");
            }

            const ranking = data.ranking
                .map((player) => ({
                    name: String(player.nombre || "").trim(),
                    wins: Number(player.torneosGanados)
                }))
                .filter((player) => player.name && Number.isFinite(player.wins))
                .sort((a, b) => b.wins - a.wins);

            rankingRows.replaceChildren();
            ranking.forEach((player, index) => {
                const row = document.createElement("tr");
                [index + 1, player.name, player.wins].forEach((value) => {
                    const cell = document.createElement("td");
                    cell.textContent = String(value);
                    row.append(cell);
                });
                rankingRows.append(row);
            });

            rankingStatus.hidden = ranking.length > 0;
            if (ranking.length === 0) rankingStatus.textContent = "Aún no hay programadores en el ranking.";
            rankingTableWrap.hidden = ranking.length === 0;
        } catch (error) {
            console.error("No se pudo cargar el ranking de programadores:", error);
            rankingStatus.classList.add("error");
            rankingStatus.textContent = "No pudimos cargar el ranking. Inténtalo de nuevo.";
            const retryButton = document.createElement("button");
            retryButton.className = "simple-ranking-retry";
            retryButton.type = "button";
            retryButton.textContent = "Reintentar";
            retryButton.addEventListener("click", loadSimpleRanking);
            rankingStatus.append(retryButton);
        }
    }

    if (rankingStatus && rankingTableWrap && rankingRows) loadSimpleRanking();


    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            const icon = menuToggle.querySelector("i");
            if (icon) {
                icon.classList.toggle("fa-bars");
                icon.classList.toggle("fa-xmark");
            }
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                const icon = menuToggle.querySelector("i");
                if (icon) {
                    icon.classList.add("fa-bars");
                    icon.classList.remove("fa-xmark");
                }
            });
        });
    }


    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question");
        if (question) {
            question.addEventListener("click", () => {
                const isActive = item.classList.contains("active");
                faqItems.forEach(i => i.classList.remove("active"));
                if (!isActive) item.classList.add("active");
            });
        }
    });


    const sections = document.querySelectorAll("section[id]");
    const navItems = document.querySelectorAll(".nav-links a");

    function updateActiveNav() {
        let current = "";
        const scrollPos = window.scrollY + 120;

        sections.forEach(section => {
            if (scrollPos >= section.offsetTop) {
                current = section.getAttribute("id");
            }
        });

        navItems.forEach(item => {
            item.classList.remove("active");
            if (item.getAttribute("href") === "#" + current) {
                item.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", updateActiveNav, { passive: true });
    updateActiveNav();


    const scrollTopBtn = document.getElementById("scroll-top");
    if (scrollTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.add("show");
            } else {
                scrollTopBtn.classList.remove("show");
            }
        });

        scrollTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }


    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = "translateY(0)";
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
        ".division-card, .rule-item, .sanction-card, .about-card, .faq-item, .cta-side-item, .about-badge"
    );

    animatedElements.forEach((el, index) => {
        el.style.opacity = 0;
        el.style.transform = "translateY(30px)";
        el.style.transition = `all 0.7s cubic-bezier(0.25, 0.8, 0.25, 1) ${(index % 4) * 0.08}s`;
        revealObserver.observe(el);
    });

});