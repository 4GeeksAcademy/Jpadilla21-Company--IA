document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("healthcore-form");
    const successBanner = document.getElementById("success-banner");

    // Configuración de validaciones semánticas de HealthCore
    const fields = [
        {
            id: "engineer-name",
            errorId: "error-engineer-name",
            validate: (value) => {
                if (!value.trim()) return "El nombre del proponente es obligatorio.";
                if (value.trim().length < 5) return "Ingresa tu nombre y apellido completos.";
                return "";
            }
        },
        {
            id: "engineer-email",
            errorId: "error-engineer-email",
            validate: (value) => {
                if (!value.trim()) return "El correo electrónico es obligatorio.";
                
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return "El formato de correo electrónico no es válido.";
                
                // Validación del dominio de correo corporativo correcto
                if (!value.toLowerCase().endsWith("@healthcore.com")) {
                    return "Debe ser un correo con dominio corporativo @healthcore.com";
                }
                return ""; 
            }
        },
        {
            id: "target-department",
            errorId: "error-target-department",
            validate: (value) => {
                if (!value) return "Debes seleccionar un área destinataria de HealthCore.";
                return "";
            }
        },
        {
            id: "impact-metric",
            errorId: "error-impact-metric",
            validate: (value) => {
                if (!value) return "Selecciona la métrica crítica a optimizar.";
                return "";
            }
        },
        {
            id: "project-budget",
            errorId: "error-project-budget",
            validate: (value) => {
                const num = parseFloat(value);
                if (isNaN(num)) return "El presupuesto debe ser un valor numérico.";
                if (num < 1000) return "El costo mínimo estimado de infraestructura es $1,000 USD.";
                return "";
            }
        },
        {
            id: "deployment-date",
            errorId: "error-deployment-date",
            validate: (value) => {
                if (!value) return "La fecha de implementación es obligatoria.";
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0,0,0,0);
                if (selectedDate <= today) {
                    return "La fecha de despliegue debe ser posterior al día de hoy.";
                }
                return "";
            }
        }
    ];

    // Gestión dinámica de clases e inyección de mensajes (image_84115b.png)
    function validateField(fieldConfig) {
        const inputElement = document.getElementById(fieldConfig.id);
        const errorElement = document.getElementById(fieldConfig.errorId);
        const errorMessage = fieldConfig.validate(inputElement.value);

        if (errorMessage) {
            inputElement.classList.remove("border-slate-600", "focus:ring-teal-500");
            inputElement.classList.add("border-rose-500", "focus:ring-rose-500", "bg-rose-500/5");
            errorElement.textContent = errorMessage;
            errorElement.classList.remove("opacity-0");
            errorElement.classList.add("opacity-100");
            return false;
        } else {
            inputElement.classList.remove("border-rose-500", "focus:ring-rose-500", "bg-rose-500/5");
            inputElement.classList.add("border-slate-600", "focus:ring-teal-500");
            errorElement.classList.remove("opacity-100");
            errorElement.classList.add("opacity-0");
            setTimeout(() => { if(errorElement.classList.contains("opacity-0")) errorElement.textContent = ""; }, 200);
            return true;
        }
    }

    // Eventos en tiempo real y pérdida de foco (image_84115b.png)
    fields.forEach(field => {
        const inputElement = document.getElementById(field.id);
        inputElement.addEventListener("input", () => validateField(field));
        inputElement.addEventListener("blur", () => validateField(field));
    });

    // Envío del formulario con validación final preventiva (image_84115b.png)
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let isFormValid = true;

        fields.forEach(field => {
            if (!validateField(field)) isFormValid = false;
        });

        if (isFormValid) {
            successBanner.classList.remove("hidden");
            successBanner.scrollIntoView({ behavior: "smooth", block: "center" });
            const btnSubmit = document.getElementById("btn-submit");
            btnSubmit.disabled = true;
            btnSubmit.classList.add("opacity-50", "cursor-not-allowed");

            setTimeout(() => {
                form.reset();
                btnSubmit.disabled = false;
                btnSubmit.classList.remove("opacity-50", "cursor-not-allowed");
            }, 4000);
        } else {
            successBanner.classList.add("hidden");
        }
    });

    // Evento de reset para limpiar estados visuales de error (image_84115b.png)
    form.addEventListener("reset", () => {
        successBanner.classList.add("hidden");
        fields.forEach(field => {
            const inputElement = document.getElementById(field.id);
            const errorElement = document.getElementById(field.errorId);
            inputElement.classList.remove("border-rose-500", "focus:ring-rose-500", "bg-rose-500/5");
            inputElement.classList.add("border-slate-600", "focus:ring-teal-500");
            errorElement.classList.remove("opacity-100");
            errorElement.classList.add("opacity-0");
            errorElement.textContent = "";
        });
    });
});