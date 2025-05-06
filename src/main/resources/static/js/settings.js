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
    const brandColorPickerCustom = document.getElementById('brand-color-picker-custom');
    const presetColorBoxes = document.querySelectorAll('.preset-color-box-wide:not(.rainbow-box-wide)'); // Excluimos la caja arcoíris
    const rainbowBoxWide = document.querySelector('.rainbow-box-wide');

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

    presetColorBoxes.forEach(box => {
        box.addEventListener('click', selectPresetColor);
    });

    // Event listener para la caja arcoíris que abrirá el selector de color
    if (rainbowBoxWide && brandColorPickerCustom) {
        rainbowBoxWide.addEventListener('click', () => {
            brandColorPickerCustom.click();
        });
    }

    if (brandColorPickerCustom) {
        brandColorPickerCustom.addEventListener('input', changeBrandColor);
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

        const savedBrandColor = localStorage.getItem('brandColor');
        const initialBrandColor = savedBrandColor || '#3be39a';
        applyTheme(initialTheme, initialBrandColor);
        if (themeStatus) {
            updateThemeStatus(initialTheme);
        }
        if (brandColorPickerCustom) {
            brandColorPickerCustom.value = initialBrandColor;
        }
        applyTheme(initialTheme, initialBrandColor);
        if (themeStatus) {
            updateThemeStatus(initialTheme);
        }

        // Idioma
        if (languageSelect) {
            const savedLanguage = localStorage.getItem('language') || 'es';
            languageSelect.value = savedLanguage;
        }

        // Color de marca seleccionado
        markSelectedColor(initialBrandColor);

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
        const currentBrandColor = localStorage.getItem('brandColor') || '#3be39a';
        applyTheme(newTheme, currentBrandColor);
        if (themeStatus) {
            updateThemeStatus(newTheme);
        }
    }

    function applyTheme(theme, brandColor = '#3be39a') {
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
        document.documentElement.style.setProperty('--brand-color', brandColor);
        document.documentElement.style.setProperty('--background-brand-color', isDarkMode ? lightenColor(brandColor, -60) : lightenColor(brandColor, 60)); // Ajusta el fondo del brand color
        document.documentElement.style.setProperty('--hover-brand-color', lightenColor(brandColor, 30)); // Oscurece/aclara para el hover

        // Colores adicionales (puedes ajustarlos para que dependan del brandColor si lo deseas)
        document.documentElement.style.setProperty('--danger-color', isDarkMode ? '#ff6b6b' : '#ff4757');
        document.documentElement.style.setProperty('--warning-color', isDarkMode ? '#ffc107' : '#ffb800');
        document.documentElement.style.setProperty('--info-color', isDarkMode ? '#6b8cff' : '#4d7bff');

        document.documentElement.style.setProperty('--brand-color', brandColor);
        document.documentElement.style.setProperty('--background-brand-color', isDarkMode ? lightenColor(brandColor, -60) : lightenColor(brandColor, 60));
        document.documentElement.style.setProperty('--hover-brand-color', lightenColor(brandColor, 30));
    }

    function lightenColor(hex, percent) {
        let R = parseInt(hex.substring(1, 3), 16);
        let G = parseInt(hex.substring(3, 5), 16);
        let B = parseInt(hex.substring(5, 7), 16);

        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);

        R = (R < 255) ? R : 255;
        G = (G < 255) ? G : 255;
        B = (B < 255) ? B : 255;

        R = Math.round(R);
        G = Math.round(G);
        B = Math.round(B);

        const RR = ((R.toString(16).length === 1) ? '0' + R.toString(16) : R.toString(16));
        const GG = ((G.toString(16).length === 1) ? '0' + G.toString(16) : G.toString(16));
        const BB = ((B.toString(16).length === 1) ? '0' + B.toString(16) : B.toString(16));

        return '#' + RR + GG + BB;
    }

    function changeBrandColor(event) {
        const newBrandColor = event.target.value;
        localStorage.setItem('brandColor', newBrandColor);
        const currentTheme = localStorage.getItem('theme') || 'dark';
        applyTheme(currentTheme, newBrandColor);
        markSelectedColor(newBrandColor);

        // Marcar la caja arcoíris como seleccionada cuando se elige un color personalizado
        if (rainbowBoxWide) {
            rainbowBoxWide.style.border = '2px solid var(--text-color)';
        }
        // Desmarcar las otras cajas predefinidas
        presetColorBoxes.forEach(box => {
            if (box.dataset.color !== newBrandColor) {
                box.style.border = '1px solid transparent';
            }
        });
    }

    function selectPresetColor(event) {
        const selectedColor = event.target.dataset.color;
        localStorage.setItem('brandColor', selectedColor);
        const currentTheme = localStorage.getItem('theme') || 'dark';
        applyTheme(currentTheme, selectedColor);
        if (brandColorPickerCustom) {
            brandColorPickerCustom.value = selectedColor;
        }
        markSelectedColor(selectedColor);
        // Desmarcar la caja arcoíris cuando se selecciona un color predefinido
        if (rainbowBoxWide) {
            rainbowBoxWide.style.border = '1px solid transparent';
        }
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
        localStorage.removeItem('brandColor'); // Elimina el color de marca guardado
        loadSettings();
        closeModal();
        showToast('Configuración restablecida');
    }

    function deleteAccount() {
        closeModal();
        showToast('Tu cuenta se eliminará pronto', 'warning');
        setTimeout(() => {
            showToast('Cuenta eliminada correctamente', 'success');
        }, 4000);
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

        // Forzar reflow para activar la animación
        void toast.offsetWidth;

        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            toast.classList.add('hide');

            setTimeout(() => {
                toast.remove();
            }, 400);
        }, 3000);
    }

    function markSelectedColor(color) {
        presetColorBoxes.forEach(box => {
            if (box.dataset.color === color) {
                box.style.border = '2px solid var(--text-color)';
            } else {
                box.style.border = '1px solid transparent';
            }
        });

        // También marcar la caja arcoíris si el color coincide con el valor del input
        if (brandColorPickerCustom && rainbowBoxWide && brandColorPickerCustom.value === color) {
            rainbowBoxWide.style.border = '2px solid var(--text-color)';
        } else if (rainbowBoxWide) {
            // Desmarcar la caja arcoíris si el color no coincide con el valor del input
            let isPresetSelected = false;
            presetColorBoxes.forEach(box => {
                if (box.dataset.color === color) {
                    isPresetSelected = true;
                }
            });
            if (!isPresetSelected) {
                rainbowBoxWide.style.border = '1px solid transparent';
            }
        }
    }
});