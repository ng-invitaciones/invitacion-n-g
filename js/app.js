document.addEventListener("DOMContentLoaded", () => {
    // Cuenta regresiva
    iniciarCuentaRegresiva(invitationConfig.eventDate);

    // Galería
    const galleryElement = document.querySelector(".gallery-swiper");

    if (galleryElement && typeof Swiper !== "undefined") {
        new Swiper(".gallery-swiper", {
            loop: true,
            speed: 700,
            spaceBetween: 18,

            pagination: {
                el: ".swiper-pagination",
                clickable: true
            },

            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev"
            },

            keyboard: {
                enabled: true
            }
        });
    }

    // Confirmación por WhatsApp
    const rsvpForm = document.getElementById("rsvp-form");
    const rsvpStatus = document.getElementById("rsvp-status");
    const rsvpStatusName = document.getElementById("rsvp-status-name");
    const modifyButton = document.getElementById("rsvp-modify-button");

    const confirmationModal =
        document.getElementById("confirmation-modal");

    const confirmationModalName =
        document.getElementById("confirmation-modal-name");

    const homeButton =
        document.getElementById("confirmation-home-button");

    const editButton =
        document.getElementById("confirmation-edit-button");

    const storageKey = "weddingInvitationRsvp";
    const whatsappNumber = "5215512345678";

    function obtenerConfirmacionGuardada() {
        try {
            const storedData = localStorage.getItem(storageKey);

            return storedData ? JSON.parse(storedData) : null;
        } catch (error) {
            console.error(
                "No fue posible leer la confirmación guardada:",
                error
            );

            return null;
        }
    }

    function guardarConfirmacion(data) {
        try {
            localStorage.setItem(storageKey, JSON.stringify(data));
        } catch (error) {
            console.error(
                "No fue posible guardar la confirmación:",
                error
            );
        }
    }

    function mostrarEstadoConfirmado(data) {
        if (!rsvpForm || !rsvpStatus) {
            return;
        }

        rsvpForm.hidden = true;
        rsvpStatus.hidden = false;

        if (rsvpStatusName) {
            rsvpStatusName.textContent = data.guestName || "invitado";
        }
    }

    function mostrarFormulario(data = null) {
        if (!rsvpForm || !rsvpStatus) {
            return;
        }

        rsvpForm.hidden = false;
        rsvpStatus.hidden = true;

        if (!data) {
            return;
        }

        const nameInput = rsvpForm.elements.guestName;
        const countSelect = rsvpForm.elements.guestCount;
        const messageInput = rsvpForm.elements.guestMessage;

        if (nameInput) {
            nameInput.value = data.guestName || "";
        }

        if (countSelect) {
            countSelect.value = data.guestCount || "";
        }

        if (messageInput) {
            messageInput.value = data.guestMessage || "";
        }

        const attendanceOption = rsvpForm.querySelector(
            `input[name="attendance"][value="${data.attendance}"]`
        );

        if (attendanceOption) {
            attendanceOption.checked = true;
        }
    }

    function abrirModal(data) {
        if (!confirmationModal) {
            return;
        }

        if (confirmationModalName) {
            confirmationModalName.textContent =
                data.guestName || "invitado";
        }

        confirmationModal.classList.add("is-visible");
        confirmationModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
    }

    function cerrarModal() {
        if (!confirmationModal) {
            return;
        }

        confirmationModal.classList.remove("is-visible");
        confirmationModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
    }

    const savedConfirmation = obtenerConfirmacionGuardada();

    if (savedConfirmation) {
        mostrarEstadoConfirmado(savedConfirmation);
    }

    if (rsvpForm) {
        rsvpForm.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!rsvpForm.checkValidity()) {
                rsvpForm.reportValidity();
                return;
            }

            const formData = new FormData(rsvpForm);

            const confirmationData = {
                guestName:
                    formData.get("guestName")?.trim() || "",

                attendance:
                    formData.get("attendance") || "",

                guestCount:
                    formData.get("guestCount") || "",

                guestMessage:
                    formData.get("guestMessage")?.trim() || "",

                confirmationDate:
                    new Date().toISOString()
            };

            const messageLines = [
                "Hola, Gustavo y Nadia.",
                "",
                "Quiero confirmar mi asistencia a su boda.",
                "",
                `Nombre: ${confirmationData.guestName}`,
                `Confirmación: ${confirmationData.attendance}`,
                `Número de asistentes: ${confirmationData.guestCount}`
            ];

            if (confirmationData.guestMessage) {
                messageLines.push(
                    "",
                    `Mensaje: ${confirmationData.guestMessage}`
                );
            }

            messageLines.push("", "Gracias.");

            const whatsappMessage = messageLines.join("\n");

            const whatsappUrl =
                `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    whatsappMessage
                )}`;

            guardarConfirmacion(confirmationData);
            mostrarEstadoConfirmado(confirmationData);
            abrirModal(confirmationData);

            const whatsappWindow = window.open(
                whatsappUrl,
                "_blank",
                "noopener,noreferrer"
            );

            if (!whatsappWindow) {
                console.warn(
                    "El navegador bloqueó la apertura de WhatsApp."
                );
            }
        });
    }

    if (modifyButton) {
        modifyButton.addEventListener("click", () => {
            const data = obtenerConfirmacionGuardada();

            mostrarFormulario(data);
            rsvpForm?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    }

    if (homeButton) {
        homeButton.addEventListener("click", () => {
            cerrarModal();

            document.getElementById("inicio")?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    }

    if (editButton) {
        editButton.addEventListener("click", () => {
            const data = obtenerConfirmacionGuardada();

            cerrarModal();
            mostrarFormulario(data);

            document.getElementById("confirmacion")?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    }
});