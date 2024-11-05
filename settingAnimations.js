document.addEventListener('DOMContentLoaded', () => {
    const settingsDialog = document.querySelector('.settings');
    const settingsButton = document.querySelector('.settings-button');
    const closeButton = document.querySelector('.close-dialog button');
    const errorElements = document.querySelectorAll('.error');

    // Mostrar el diálogo con animación usando clases CSS
    settingsButton.addEventListener('click', () => {
        settingsDialog.classList.add('open');
    });

    // Cerrar el diálogo con animación usando clases CSS
    closeButton.addEventListener('click', () => {
        settingsDialog.classList.remove('open');
    });

});
