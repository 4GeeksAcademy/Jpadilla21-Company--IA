document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("healthcore-form");
    const successBanner = document.getElementById("success-banner");

    // Reglas y configuraciones específicas de campos
    const fields = [
        {
            id: "engineer-name",
            errorId: "error-engineer-name",
            validate: (value) => {
                if (!value.trim()) return "El nombre del proponente es obligatorio.";
                if (value.trim().length < 5) return "Ingresa el nombre y apellido completos (mínimo 5 caracteres).";
                return "";
            }
        },
        {
            id: "engineer-email",
            errorId: "error-engineer-email",
            validate: (value) => {
                if (!value.trim()) return "El correo institucional es obligatorio.";
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return "El formato de correo no es válido.";
                if (!value.endsWith("@healthcore.com")) return "Debe ser un correo con dominio corporativo @healthcore.com";
                return "";
            }
        },
        {
            id: "target-department",
            errorId: "error-target-department",
            validate: (value) => {
                if (!value) return "Debes seleccionar un departamento clínico u operativo afectado.";
                return "";
            }
        },
        {
            id: "legal-framework",
            errorId: "error-legal-framework",
            validate: (value) => {
                if (!value) return "Especifique el marco regulatorio para el control de acceso a datos.";
                return "";
            }
        },
        {
            id: "project-budget",
            errorId: "error-project-budget",
            validate: (value) => {
                const num = parseFloat(value);
                if (isNaN(num)) return "El presupuesto debe ser un valor numérico expresado en dólares.";
                if (num < 5000) return "El costo de infraestructura mínimo estimado por módulo IA es $5,000 USD.";
                if (num > 500000) return "El presupuesto excede el límite asignado para la división HealthCore Digital ($500,000 USD).";
                return "";
            }
        },
        {
            id: "deployment-date",
            errorId: "error-deployment-date",
            validate: (value) => {
                if (!value) return "La fecha de implementación técnica en las clínicas es obligatoria.";
                
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0,0,0,0); // Limpiar zona horaria para comparar fechas exactas

                if (selectedDate <= today) {
                    return "La fecha de despliegue debe ser posterior a la fecha actual.";
                }
                return "";
            }
        }
    ];

    // Aplicación visual de alertas y accesibilidad
    function validateField(fieldConfig) {
        const inputElement = document.getElementById(fieldConfig.id);
        const errorElement = document.getElementById(fieldConfig.errorId);
        const errorMessage = fieldConfig.validate(inputElement.value);

        if (errorMessage) {
            inputElement.classList.remove("border-slate-600", "focus:border-teal-500");
            inputElement.classList.add("border-rose-500", "focus:border-rose-500");
            
            errorElement.textContent = errorMessage;
            errorElement.classList.remove("opacity-0");
            errorElement.classList.add("opacity-100");
            return false;
        } else {
            inputElement.classList.remove("border-rose-500", "focus:border-rose-500");
            inputElement.classList.add("border-slate-600", "focus:border-teal-500");
            
            errorElement.classList.remove("opacity-100");
            errorElement.classList.add("opacity-0");
            setTimeout(() => { if(errorElement.classList.contains("opacity-0")) errorElement.textContent = ""; }, 200);
            return true;
        }
    }

    // Escuchadores reactivos
    fields.forEach(field => {
        const inputElement = document.getElementById(field.id);
        inputElement.addEventListener("input", () => validateField(field));
        inputElement.addEventListener("blur", () => validateField(field));
    });

    // Envío del formulario
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

    // Reset de estilos
    form.addEventListener("reset", () => {
        successBanner.classList.add("hidden");
        fields.forEach(field => {
            const inputElement = document.getElementById(field.id);
            const errorElement = document.getElementById(field.errorId);
            
            inputElement.classList.remove("border-rose-500", "focus:border-rose-500");
            inputElement.classList.add("border-slate-600", "focus:border-teal-500");
            errorElement.classList.remove("opacity-100");
            errorElement.classList.add("opacity-0");
            errorElement.textContent = "";
        });
    });
});