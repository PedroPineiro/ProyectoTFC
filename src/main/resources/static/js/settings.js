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

    // Desactivar el toggle inicialmente
    if (themeToggle) {
        themeToggle.disabled = true;
    }

    // Event listeners
    if (themeToggle) {
        themeToggle.addEventListener('change', toggleTheme);
    }
    if (languageSelect) {
        languageSelect.addEventListener('change', changeLanguage);
    }
    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', () => showConfirmModal(
            'Restablecer configuración',
            '¿Estás seguro de que quieres restablecer todas tus configuraciones?',
            resetSettings
        ));
    }
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', () => showConfirmModal(
            'Eliminar cuenta',
            'Esta acción eliminará permanentemente tu cuenta y todos tus datos. ¿Estás seguro?',
            deleteAccount
        ));
    }
    if (modalCancel) {
        modalCancel.addEventListener('click', closeModal);
    }
    if (modalConfirm) {
        modalConfirm.addEventListener('click', confirmAction);
    }

    // Funciones
    function loadSettings() {
        // Tema
        const savedTheme = localStorage.getItem('theme');
        let initialTheme = 'dark'; // Modo default es oscuro

        if (savedTheme === 'light') {
            initialTheme = 'light';
            if (themeToggle) {
                themeToggle.checked = true; // Simula que el toggle está activado para modo claro
            }
        } else {
            if (themeToggle) {
                themeToggle.checked = false; // Asegura que el toggle esté desactivado para el default oscuro
            }
        }

        applyTheme(initialTheme);
        if (themeStatus) {
            updateThemeStatus(initialTheme);
        }

        // Idioma
        if (languageSelect) {
            const savedLanguage = localStorage.getItem('language') || 'es';
            languageSelect.value = savedLanguage;
        }

        // Habilitar el toggle después de la carga inicial
        if (themeToggle) {
            setTimeout(() => {
                themeToggle.disabled = false;
            }, 100); // Pequeño delay para asegurar que el estado inicial se aplique
        }
    }

    function toggleTheme() {
        const newTheme = themeToggle.checked ? 'light' : 'dark'; // Invertimos la lógica
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
        if (themeStatus) {
            updateThemeStatus(newTheme);
        }
    }

    function applyTheme(theme) {
        const isDarkMode = theme === 'dark';

        // Colores base
        document.documentElement.style.setProperty('--background-color', isDarkMode ? '#121212' : '#f8fcfb');
        document.documentElement.style.setProperty('--second-background-color', isDarkMode ? '#1e1e1e' : '#ffffff');
        document.documentElement.style.setProperty('--third-background-color', isDarkMode ? '#252525' : '#f0f5f3');
        document.documentElement.style.setProperty('--card-bg-color', isDarkMode ? '#1e1e1e' : '#ffffff');
        document.documentElement.style.setProperty('--text-color', isDarkMode ? '#f0f0f0' : '#2d3748');
        document.documentElement.style.setProperty('--text-secondary', isDarkMode ? '#b0b0b0' : '#718096');
        document.documentElement.style.setProperty('--border-color', isDarkMode ? '#2d2d2d' : '#e2e8f0');

        // Colores de marca
        document.documentElement.style.setProperty('--brand-color', isDarkMode ? '#3be39a' : '#2bc184');
        document.documentElement.style.setProperty('--background-brand-color', isDarkMode ? '#1a2e25' : '#e0f7ec');
        document.documentElement.style.setProperty('--hover-brand-color', isDarkMode ? '#68f7b5' : '#3be39a');

        // Colores adicionales
        document.documentElement.style.setProperty('--danger-color', isDarkMode ? '#ff6b6b' : '#ff4757');
        document.documentElement.style.setProperty('--warning-color', isDarkMode ? '#ffc107' : '#ffb800');
        document.documentElement.style.setProperty('--info-color', isDarkMode ? '#6b8cff' : '#4d7bff');
    }

    function updateThemeStatus(theme) {
        if (themeStatus) {
            themeStatus.textContent = theme === 'dark' ? 'Modo oscuro activado' : 'Modo claro activado';
        }
    }

    function changeLanguage() {
        if (languageSelect) {
            const language = languageSelect.value;
            localStorage.setItem('language', language);
            showToast(`Idioma cambiado a ${getLanguageName(language)}`);
        }
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
        closeModal();
        showToast('Tu cuenta se eliminará pronto', 'warning');
        setTimeout(() => {
            showToast('Cuenta eliminada correctamente', 'success');
            window.location.href = '../index.html';
        }, 1500);
    }

    function showConfirmModal(title, message, action) {
        if (modalTitle) modalTitle.textContent = title;
        if (modalMessage) modalMessage.textContent = message;
        if (confirmModal) confirmModal.style.display = 'block';
        if (modalConfirm) modalConfirm.dataset.action = action.name;
    }

    function closeModal() {
        if (confirmModal) confirmModal.style.display = 'none';
    }

    function confirmAction() {
        if (this && this.dataset && this.dataset.action) {
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
    }

    function showToast(message, type = 'success') {
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