// Espera a que todo el contenido del DOM esté cargado
document.addEventListener('DOMContentLoaded', function () {

    // 1. Inicialización de AOS (Animate On Scroll)
    AOS.init({
        duration: 800, // Duración de la animación
        once: false, //nimación ocurre solo una vez
    });

    // 2. Configuración de Typed.js para el texto dinámico
    const typed = new Typed('#typed-text', {
        strings: ["Desarrollador Full Stack", "Especialista en IoT", "Ingeniero Mecatrónico", "Innovador con IA"],
        typeSpeed: 70,
        backSpeed: 35,
        loop: true,
        backDelay: 1500,
        startDelay: 500,
    });

});

// assets/js/main.js (solo la parte relevante del chatbot)

// ... (tu código AOS y Typed.js arriba) ...

// 3. Funcionalidad del Chatbot
const openChatBtn = document.getElementById('open-chat-btn');
const chatWindow = document.getElementById('chat-window');
const closeChatBtn = document.getElementById('close-chat-btn');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

// Nuevos elementos para las preguntas preestablecidas
const presetQuestionsContainer = document.getElementById('preset-questions-container'); // Necesitaremos agregar esto en el HTML

// Lógica de apertura/cierre del chat (sin cambios significativos aquí)
if (openChatBtn && chatWindow) {
    openChatBtn.addEventListener('click', () => {
        openChatBtn.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
        setTimeout(() => {
            openChatBtn.style.display = 'none';
            chatWindow.classList.remove('hidden', 'opacity-0', 'scale-95');
            chatWindow.classList.add('opacity-100', 'scale-100', 'flex');
            chatInput.focus();
        }, 300);
    });
}

if (closeChatBtn && chatWindow && openChatBtn) {
    closeChatBtn.addEventListener('click', () => {
        chatWindow.classList.remove('opacity-100', 'scale-100');
        chatWindow.classList.add('opacity-0', 'scale-95');
        setTimeout(() => {
            chatWindow.classList.add('hidden');
            chatWindow.classList.remove('flex');
            openChatBtn.style.display = '';
            openChatBtn.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
        }, 300);
    });
}

// **Lógica Principal de Envío de Mensajes al API**
if (chatForm && chatInput && chatMessages) {
    chatForm.addEventListener('submit', async function (e) { // Agrega 'async' aquí
        e.preventDefault();
        const pregunta = chatInput.value.trim();
        if (!pregunta) return;

        // 1. Mostrar pregunta del usuario
        chatMessages.innerHTML += `<div class="mb-2 text-right"><span class="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg max-w-[80%]">${pregunta}</span></div>`;
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll al final

        chatInput.value = ''; // Limpiar input inmediatamente
        chatInput.disabled = true; // Deshabilitar input mientras se espera respuesta

        // 2. Mostrar un mensaje de "escribiendo..." o cargando
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('mb-2', 'text-left');
        typingIndicator.innerHTML = '<span class="inline-block bg-gray-200 text-gray-800 px-3 py-1 rounded-lg animate-pulse">Escribiendo...</span>';
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;


        try {
            // 3. Realizar la llamada a la API
            const response = await fetch('https://ai-agent-backend-production-7919.up.railway.app/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: pregunta }),
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            const respuestaBot = data.reply || "Lo siento, no pude obtener una respuesta."; // Asegura que haya una respuesta

            // 4. Eliminar el indicador de "escribiendo..." y mostrar la respuesta
            chatMessages.removeChild(typingIndicator);
            chatMessages.innerHTML += `<div class="mb-2 text-left"><span class="inline-block bg-gray-200 text-gray-800 px-3 py-1 rounded-lg max-w-[80%]">${respuestaBot}</span></div>`;

        } catch (error) {
            console.error('Error al comunicarse con el chatbot:', error);
            if (typingIndicator.parentNode) { // Solo si el indicador sigue en el DOM
                chatMessages.removeChild(typingIndicator);
            }
            chatMessages.innerHTML += `<div class="mb-2 text-left text-red-600"><span class="inline-block bg-red-100 px-3 py-1 rounded-lg max-w-[80%]">Hubo un error al conectar con el asistente. Intenta más tarde.</span></div>`;
        } finally {
            chatMessages.scrollTop = chatMessages.scrollHeight; // Asegurar scroll final
            chatInput.disabled = false; // Habilitar input de nuevo
            chatInput.focus(); // Enfocar de nuevo el input
        }
    });
}

// **Función para enviar preguntas preestablecidas**
function sendPresetQuestion(question,buttonElement) {
    chatInput.value = question; // Pone la pregunta en el input
    chatForm.dispatchEvent(new Event('submit')); // Dispara el evento submit del formulario
     if (buttonElement) {
        buttonElement.style.display = 'none'; // Oculta solo el botón clickeado
    }

}

// ... (tu código filterProjects debajo) ...

// 3. Lógica para filtrar los proyectos
function filterProjects(category, button) {
    // Manejo de la clase 'active' para los botones de filtro
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Lógica de filtrado de las tarjetas de proyecto
    const projects = document.querySelectorAll('#projects-container .flip-card');
    projects.forEach(project => {
        // Oculta el proyecto primero con una transición
        project.style.opacity = '0';
        project.style.transform = 'scale(0.9)';

        // Muestra el proyecto si coincide con la categoría o si es 'all'
        setTimeout(() => {
            const hasCategory = project.classList.contains(`category-${category}`);
            if (category === 'all' || hasCategory) {
                project.style.display = 'block';
                // Revela el proyecto con una animación suave
                setTimeout(() => {
                    project.style.opacity = '1';
                    project.style.transform = 'scale(1)';
                }, 50);
            } else {
                project.style.display = 'none';
            }
        }, 300); // Tiempo de espera para la animación de salida
    });
}

// Chat falso flotante con avatar y respuestas predefinidas

const respuestasPredefinidas = [
    {
        pregunta: /hola|buenas/i,
        respuesta: "¡Hola! Soy AldoBot, el asistente virtual de Aldo Florez. Estoy aquí para contarte sobre su perfil, experiencia o resolver tus dudas. ¿Cómo puedo ayudarte?"
    },
    {
        pregunta: /quién eres|quien eres|quién es aldo|quien es aldo/i,
        respuesta: "Soy un avatar virtual basado en Aldo Florez, profesional en formación en Ingeniería Mecatrónica y Desarrollador Full Stack con experiencia en software, hardware e integración de sistemas."
    },
    {
        pregunta: /experiencia|trabajo|trayectoria/i,
        respuesta: "Aldo cuenta con experiencia en desarrollo de aplicaciones web y móviles, integración de sistemas e-commerce, automatización de procesos y soporte operativo en logística y producción."
    },
    {
        pregunta: /tecnolog[ií]as|stack|herramientas|con qué trabajas/i,
        respuesta: "Aldo trabaja con tecnologías como React, Vue.js, Node.js, FastAPI, React Native, Arduino, ESP32-CAM, WebSockets, Shopify, WooCommerce, PostgreSQL y MongoDB. También domina herramientas de automatización y visión artificial."
    },
    {
        pregunta: /proyectos|logros|portafolio/i,
        respuesta: "Ha liderado proyectos como dashboards IoT en tiempo real, asistentes inteligentes con visión artificial y ESP32-CAM, tiendas virtuales personalizables y arquitecturas basadas en microservicios. Puedes ver su portafolio en: https://aldoveloper.github.io/"
    },
    {
        pregunta: /edad|años|cuántos años tienes|tienes/i,
        respuesta: "Aldo tiene 28 años y combina su experiencia técnica con una actitud proactiva y un enfoque constante en el aprendizaje y la innovación."
    },
    {
        pregunta: /de dónde eres|donde vives|nacionalidad|pa[ií]s/i,
        respuesta: "Aldo es colombiano y actualmente reside en Colombia, donde combina su experiencia en tecnología con participación en proyectos de alcance internacional."
    },
    {
        pregunta: /idioma|hablas ingl[eé]s|nivel de ingl[eé]s|inglés/i,
        respuesta: "Aldo tiene un nivel A2 de inglés conversacional y un nivel intermedio en lectura y comprensión de documentación técnica, lo que le permite trabajar con herramientas y documentación internacional."
    },
    {
        pregunta: /contacto|correo|email/i,
        respuesta: "Puedes contactar a Aldo directamente al correo florezaldo10@gmail.com o a través de LinkedIn: https://www.linkedin.com/in/aldo-florez-dev/"
    },
    {
        pregunta: /.*/i,
        respuesta: "¡Gracias por tu consulta! Actualmente puedo responder sobre la experiencia, habilidades y proyectos de Aldo. Pronto integraré más respuestas gracias a la IA."
    }
];


function obtenerRespuesta(preguntaUsuario) {
    for (const item of respuestasPredefinidas) {
        if (item.pregunta.test(preguntaUsuario)) {
            return item.respuesta;
        }
    }
    return respuestasPredefinidas[respuestasPredefinidas.length - 1].respuesta;
}

document.addEventListener('DOMContentLoaded', function () {
    // ...tu código existente...

    // Chat flotante
    const openBtn = document.getElementById('open-chat-btn');
    const chatWindow = document.getElementById('chat-window');
    const closeBtn = document.getElementById('close-chat-btn');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    if (openBtn && chatWindow) {
        openBtn.addEventListener('click', () => {
            openBtn.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
            setTimeout(() => {
                openBtn.style.display = 'none';
                chatWindow.classList.remove('hidden');
                chatWindow.classList.remove('opacity-0', 'scale-95');
                chatWindow.classList.add('opacity-100', 'scale-100');
                chatInput.focus();
            }, 300);
        });
    }
    if (closeBtn && chatWindow && openBtn) {
        closeBtn.addEventListener('click', () => {
            chatWindow.classList.remove('opacity-100', 'scale-100');
            chatWindow.classList.add('opacity-0', 'scale-95');
            setTimeout(() => {
                chatWindow.classList.add('hidden');
                openBtn.style.display = '';
                openBtn.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
            }, 300);
        });
    }
    if (closeBtn && chatWindow && openBtn) {
        closeBtn.addEventListener('click', () => {
            chatWindow.classList.add('hidden');
            openBtn.style.display = ''; // Muestra el botón al cerrar el chat
        });
    }
    if (chatForm && chatInput && chatMessages) {
        chatForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const pregunta = chatInput.value.trim();
            if (!pregunta) return;

            // Mostrar pregunta del usuario
            chatMessages.innerHTML += `<div class="mb-2 text-right"><span class="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg">${pregunta}</span></div>`;

            // Obtener y mostrar respuesta
            const respuesta = obtenerRespuesta(pregunta);
            setTimeout(() => {
                chatMessages.innerHTML += `<div class="mb-2 text-left"><span class="inline-block bg-gray-200 text-gray-800 px-3 py-1 rounded-lg">${respuesta}</span></div>`;
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 500);

            chatInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
    }
});

// Cargar proyectos desde Supabase y renderizarlos
async function loadProjects() {
    try {
        const response = await fetch("hhttps://ai-agent-backend-production-7919.up.railway.app/api/chat"); 
        const data = await response.json();

        const projectsContainer = document.getElementById("projects-container");
        projectsContainer.innerHTML = ""; // Limpia contenido previo

        data.proyectos.forEach(proyecto => {
            // Generar clases de categorías dinámicamente
            const categoryClasses = proyecto.categoria.map(cat => `category-${cat}`).join(" ");

            // Crear tarjeta
            const projectCard = `
                <div class="flip-card ${categoryClasses} transition-all duration-300">
                    <div class="flip-card-inner">
                        <div class="flip-card-front bg-white rounded-xl shadow-lg overflow-hidden">
                            <img src="${proyecto.imagen_url}" alt="${proyecto.titulo}" class="w-full h-40 object-cover">
                            <div class="p-4">
                                <h3 class="text-xl font-bold mb-2 text-gray-900">${proyecto.titulo}</h3>
                                <p class="text-gray-700 text-sm">${proyecto.descripcion}</p>
                            </div>
                        </div>
                        <div class="flip-card-back bg-gray-900 text-white rounded-xl p-4 flex flex-col items-center justify-center">
                            <h3 class="text-lg font-bold mb-2">${proyecto.titulo}</h3>
                            <p class="text-sm mb-4">${proyecto.tecnologias.join(", ")}</p>
                            <a href="${proyecto.enlace}" target="_blank" class="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full transition">
                                Ver Proyecto
                            </a>
                        </div>
                    </div>
                </div>
            `;

            projectsContainer.innerHTML += projectCard;
        });
    } catch (error) {
        console.error("Error cargando proyectos:", error);
    }
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", loadProjects);
