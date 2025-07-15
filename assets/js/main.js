// Espera a que todo el contenido del DOM esté cargado
document.addEventListener('DOMContentLoaded', function () {

    // 1. Inicialización de AOS (Animate On Scroll)
    AOS.init({
        duration: 800, // Duración de la animación
        once: true, // La animación ocurre solo una vez
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