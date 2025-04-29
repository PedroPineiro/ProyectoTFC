document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const themeToggle = document.getElementById('theme-toggle');
    const themeStatus = document.getElementById('theme-status');
    const languageSelect = document.getElementById('language-select');
    const resetSettingsBtn = document.getElementById('reset-settings-btn');
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    const confirmModal = document.getElementById('confirm-modal');
    const modalCancel = document.getElementById('modal-cancel');
    const modalConfirm = document.getElementById('modal-confirm');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');

    // Cargar configuraciones guardadas
    loadSettings();

    // Event listeners
    themeToggle.addEventListener('change', toggleTheme);
    languageSelect.addEventListener('change', changeLanguage);
    resetSettingsBtn.addEventListener('click', () => showConfirmModal(
        'Restablecer configuración',
        '¿Estás seguro de que quieres restablecer todas tus configuraciones?',
        resetSettings
    ));
    deleteAccountBtn.addEventListener('click', () => showConfirmModal(
        'Eliminar cuenta',
        'Esta acción eliminará permanentemente tu cuenta y todos tus datos. ¿Estás seguro?',
        deleteAccount
    ));
    modalCancel.addEventListener('click', closeModal);
    modalConfirm.addEventListener('click', confirmAction);

    // Funciones
    function loadSettings() {
        // Tema
        const savedTheme = localStorage.getItem('theme') || 'dark';
        applyTheme(savedTheme);
        themeToggle.checked = savedTheme === 'dark';
        updateThemeStatus(savedTheme);

        // Idioma
        const savedLanguage = localStorage.getItem('language') || 'es';
        languageSelect.value = savedLanguage;
    }

    function toggleTheme() {
        const newTheme = themeToggle.checked ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
        updateThemeStatus(newTheme);
    }

    function applyTheme(theme) {
        const isDarkMode = theme === 'dark';
        document.documentElement.style.setProperty('--background-color', isDarkMode ? '#1c1e1d' : '#dcf0e7');
        document.documentElement.style.setProperty('--text-color', isDarkMode ? 'white' : '#333333');
        document.documentElement.style.setProperty('--card-bg-color', isDarkMode ? '#252827' : '#ffffff');
        document.documentElement.style.setProperty('--text-secondary', isDarkMode ? '#b0b0b0' : '#666666');
        document.documentElement.style.setProperty('--border-color', isDarkMode ? '#3a3d3c' : '#d1d9d6');
    }

    function updateThemeStatus(theme) {
        themeStatus.textContent = theme === 'dark' ? 'Modo oscuro activado' : 'Modo claro activado';
    }

    function changeLanguage() {
        const language = languageSelect.value;
        localStorage.setItem('language', language);
        // Aquí podrías implementar la internacionalización
        showToast(`Idioma cambiado a ${getLanguageName(language)}`);
    }

    function getLanguageName(code) {
        const languages = {
            'es': 'Español',
            'en': 'Inglés',
            'fr': 'Francés',
            'de': 'Alemán'
        };
        return languages[code] || code;
    }

    function resetSettings() {
        localStorage.removeItem('theme');
        localStorage.removeItem('language');
        loadSettings();
        closeModal();
        showToast('Configuración restablecida');
    }

    function deleteAccount() {
        // Aquí iría la lógica para eliminar la cuenta
        closeModal();
        showToast('Tu cuenta se eliminará pronto', 'warning');
        // Simulación de eliminación de cuenta
        setTimeout(() => {
            showToast('Cuenta eliminada correctamente', 'success');
            // Redirigir al logout o página principal
            window.location.href = '../index.html';
        }, 1500);
    }

    function showConfirmModal(title, message, action) {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        confirmModal.style.display = 'block';
        modalConfirm.dataset.action = action.name;
    }

    function closeModal() {
        confirmModal.style.display = 'none';
    }

    function confirmAction() {
        const actionName = this.dataset.action;
        switch(actionName) {
            case 'resetSettings':
                resetSettings();
                break;
            case 'deleteAccount':
                deleteAccount();
                break;
        }
    }

    function showToast(message, type = 'success') {
        // Implementación básica de toast (puedes mejorarla)
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
});