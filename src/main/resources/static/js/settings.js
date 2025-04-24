document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');

    // Cambiar tema al alternar el interruptor
    themeToggle.addEventListener('change', () => {
        const isDarkMode = themeToggle.checked;
        document.body.style.setProperty('--background-color', isDarkMode ? '#141716' : '#ffffff');
        document.body.style.setProperty('--text-color', isDarkMode ? 'white' : '#000000');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });

    // Cargar configuración guardada o aplicar modo oscuro por defecto
    const savedTheme = localStorage.getItem('theme');
    const isDarkMode = savedTheme ? savedTheme === 'dark' : true; // Por defecto, modo oscuro
    document.body.style.setProperty('--background-color', isDarkMode ? '#141716' : '#ffffff');
    document.body.style.setProperty('--text-color', isDarkMode ? 'white' : '#000000');
});