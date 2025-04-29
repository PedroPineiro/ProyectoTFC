document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');

    // Aplicar el tema guardado o el modo oscuro por defecto
    const savedTheme = localStorage.getItem('theme') || 'dark';
    console.log('Tema guardado:', savedTheme); // Depuración

    applyTheme(savedTheme);

    themeToggle.checked = savedTheme === 'dark';
    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        console.log('Nuevo tema seleccionado:', newTheme); // Depuración
        applyTheme(newTheme);
    });

    function applyTheme(theme) {
        const isDarkMode = theme === 'dark';
        document.body.style.setProperty('--background-color', isDarkMode ? '#1c1e1d' : '#dcf0e7');
        document.body.style.setProperty('--text-color', isDarkMode ? 'white' : '#000000');
        document.body.style.setProperty('--content--background-color', isDarkMode ? 'red' : 'blue');
        document.body.style.setProperty('--results-box-color', isDarkMode ? '#000000' : '#cdd6d2');
    }
});