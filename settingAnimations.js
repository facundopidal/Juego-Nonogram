document.addEventListener('DOMContentLoaded', () => {
    const settingsDialog = document.querySelector('.settings');
    const settingsButton = document.querySelector('.settings-button');
    const closeButton = document.querySelector('.close-dialog button');
    const errorElements = document.querySelectorAll('.error');


    settingsButton.addEventListener('click', () => {
        settingsDialog.classList.add('open');
    });

    closeButton.addEventListener('click', () => {
        settingsDialog.classList.remove('open');
    });

});

const dialogButton = document.querySelector('.settings-button')
const dialog = document.querySelector('.settings')

dialogButton.addEventListener('click', () => {
    dialog.showModal()
})

const newGameButton = document.querySelector('.new-game');
newGameButton.addEventListener('click', () => {
    localStorage.removeItem('gameState')
    startGame(parseInt(sizeSelect.value));
});


const darkModeToggle = document.getElementById("darkmode-check");

darkModeToggle.addEventListener("change", () => {
  if (darkModeToggle.checked) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
});


const savedTheme = localStorage.getItem("darkMode");

if (savedTheme === "enabled") {
    enableDarkMode(); // Activar al cargar
}

function enableDarkMode() {
    darkModeToggle.checked = true;
    document.body.classList.add("dark-mode");
    document.querySelector("header").classList.add("dark-mode");
    document.querySelector(".settings").classList.add("dark-mode");
    document.querySelector("main").classList.add("dark-mode");
    localStorage.setItem("darkMode", "enabled");
}

function disableDarkMode() {
    darkModeToggle.checked = false;
    document.body.classList.remove("dark-mode");
    document.querySelector("header").classList.remove("dark-mode");
    document.querySelector(".settings").classList.remove("dark-mode");
    document.querySelector("main").classList.remove("dark-mode");
    localStorage.setItem("darkMode", "disabled");
}

darkModeToggle.addEventListener("change", () => {
    if (darkModeToggle.checked) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
});
