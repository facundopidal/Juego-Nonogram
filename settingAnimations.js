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


// Seleccionamos el checkbox del modo oscuro
const darkModeToggle = document.getElementById("darkmode-check");

// Agregamos un evento al cambio del checkbox
darkModeToggle.addEventListener("change", () => {
  // Verifica si el checkbox está marcado
  if (darkModeToggle.checked) {
    // Agregar la clase 'dark-mode' al body
    document.body.classList.add("dark-mode");
  } else {
    // Remover la clase 'dark-mode'
    document.body.classList.remove("dark-mode");
  }
});


// Guardar estado en localStorage
const savedTheme = localStorage.getItem("darkMode");

if (savedTheme === "enabled") {
    enableDarkMode(); // Activar al cargar
}

// Activar modo oscuro
function enableDarkMode() {
    darkModeToggle.checked = true;
    document.body.classList.add("dark-mode");
    document.querySelector("header").classList.add("dark-mode");
    document.querySelector(".settings").classList.add("dark-mode");
    document.querySelector("main").classList.add("dark-mode");
    localStorage.setItem("darkMode", "enabled");
}

// Desactivar modo oscuro
function disableDarkMode() {
    darkModeToggle.checked = false;
    document.body.classList.remove("dark-mode");
    document.querySelector("header").classList.remove("dark-mode");
    document.querySelector(".settings").classList.remove("dark-mode");
    document.querySelector("main").classList.remove("dark-mode");
    localStorage.setItem("darkMode", "disabled");
}

// Escuchar cambios en el checkbox
darkModeToggle.addEventListener("change", () => {
    if (darkModeToggle.checked) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
});
