function generateSolution(size) {
    const solution = [];
    for (let i = 0; i < size; i++) {
        const row = Array(size).fill(0);
        solution.push(row);
    }

    for (let i = 0; i < size; i++) {
        const randomCol = Math.floor(Math.random() * size);
        solution[i][randomCol] = 1; 
    }

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (solution[i][j] === 0) {
                solution[i][j] = Math.random() > 0.5 ? 1 : 0;
            }
        }
    }
    console.log(solution);
    return solution;
}

function calculateHints(solution) {
    const rowHints = solution.map(row => {
        let hints = [];
        let count = 0;
        row.forEach(cell => {
            if (cell === 1) {
                count++;
            } else if (count > 0) {
                hints.push(count);
                count = 0;
            }
        });
        if (count > 0) hints.push(count);
        return hints.length ? hints : [0];
    });

    const colHints = solution[0].map((_, colIndex) => {
        let hints = [];
        let count = 0;
        for (let rowIndex = 0; rowIndex < solution.length; rowIndex++) {
            if (solution[rowIndex][colIndex] === 1) {
                count++;
            } else if (count > 0) {
                hints.push(count);
                count = 0;
            }
        }
        if (count > 0) hints.push(count);
        return hints.length ? hints : [0];
    });

    return { rowHints, colHints };
}

function createTable(size, rowHints, colHints) {
    const thead = document.querySelector('.nonogram-thead');
    const tbody = document.querySelector('.nonogram-tbody');

    thead.innerHTML = '<tr><td></td>' + colHints.map((hint, index)=> `<td class="col-hint">${hint.join(' ')}</td>`).join('') + '</tr>';
    tbody.innerHTML = rowHints.map((hint, i) => {
        const row = `<td>${hint.join(' ')}</td>` + Array(size).fill('<td class="game-td"><button class="game-button"></button></td>').join('');
        return `<tr>${row}</tr>`;
    }).join('');
}

function updateLives(lives) {
    const livesSpan = document.querySelector('.lives-span')

    if (lives === 0) livesSpan.textContent = 'Perdiste :('
    else livesSpan.textContent = `Vidas: ${Array(lives).fill('❤️').join('')}`
}

function getCellValue(row, col) {
    return solution[row][col]
}

function saveGameState(size, lives, solution, buttonsState, rowsCompleted) {
    const gameState = {
        size,
        lives,
        solution,
        buttonsState,
        rowsCompleted,
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
}

function loadGameState() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        const parsedState = JSON.parse(savedState);
        rowsCompleted = parsedState.rowsCompleted || 0; 
        return parsedState;
    }
    return null;
}


function getButtonsState() {
    const buttons = document.querySelectorAll('.game-button');
    const buttonsState = [];

    buttons.forEach(button => {
        buttonsState.push({
            id: button.id,
            innerHTML: button.innerHTML,
            style: button.style.backgroundColor,
            borderColor: button.closest('td').style.border,
        });
    });

    return buttonsState;
}

function restoreButtonsState(buttonsState) {
    const buttons = document.querySelectorAll('.game-button');

    buttons.forEach((button, index) => {
        const buttonState = buttonsState[index];
        if (buttonState) {
            button.id = buttonState.id;
            button.innerHTML = buttonState.innerHTML;
            button.style.backgroundColor = buttonState.style;
            button.closest('td').style.border = buttonState.borderColor;
        }
    });
}

let rowsCompleted = 0

function setupInteraction(gameSwitch, size, lives, solution) {
    const gameButtons = document.querySelectorAll('.game-button');
    let liveCount = lives
    let isDragging = false
    let draggedCells = []
    let previousCell = null

    gameButtons.forEach((button, index) => {
        const row = Math.floor(index / size);
        const col = index % size
        button.dataset.row = row
        button.dataset.col = col

        let isClicked = false

        button.addEventListener("mousedown", function (e) {
            if (liveCount === 0) return
            isDragging = true
            draggedCells.push(this)
            
            if(!isClicked){
                handleClick(this, gameSwitch)
                isClicked = true
            }
            
            previousCell = { row, col }
        });

        button.addEventListener("mouseenter", function (e) {
            if(liveCount === 0) return

            if (isDragging && !draggedCells.includes(this)) {
                const currentCell = { row, col }
                
                // Solo permite marcar celdas adyacentes en la misma fila o columna
                if (isAdjacent(previousCell, currentCell)) {
                    draggedCells.push(this)
                    handleClick(this, gameSwitch)
                    previousCell = currentCell
                }
            }
        });

        document.addEventListener("mouseup", function (e) {
            if(liveCount === 0) return
            if (isDragging) {
                isDragging = false
                draggedCells = []
                previousCell = null
            }
        });

        button.addEventListener("click", function (e) {
            if (liveCount === 0) return
           
            if(!isClicked) {
                handleClick(this, gameSwitch)
                isClicked = true
            }
            
        });
    });

    function handleClick(button, gameSwitch) {
        if (button.id === "clicked") return;
    
        const row = button.dataset.row;
        const col = button.dataset.col;
        const cellValue = getCellValue(row, col);
    
        button.id = "clicked";
    
        if (gameSwitch.checked) {
            if (cellValue === 1) {
                button.style.transition = "background-color 0.3s ease";
                button.style.backgroundColor = "#333";
                button.closest('td').style.border = "1px solid #222";
            } else {
                liveCount--;
                updateLives(liveCount);
                const span = document.createElement('span')
                span.textContent = '✖'
                button.appendChild(span)
                span.style.color = '#f00'
                span.style.fontSize = '15px'
                span.style.fontWeight = 800
                setTimeout(() => {
                    span.style.transition = 'color 1.5s ease'
                    span.style.color = '#000'
                }, 10)
            }
        } else {
            if (cellValue === 0) {
                button.innerHTML += '<span style="font-size:15px; font-weight: 800;">✖</span>';
            } else {
                liveCount--;
                updateLives(liveCount);
                button.style.backgroundColor = "#f00";
                button.closest('td').style.border = "1px solid #f00";
                setTimeout(() => {
                    button.style.transition = "1.5s ease";
                    button.style.backgroundColor = "#333";
                    button.closest('td').style.border = "1px solid #222";
                }, 1);
            }
        }
        
        checkCompletion(row, col);
        saveGameState(size, liveCount, solution, getButtonsState(), rowsCompleted);
    
        if (rowsCompleted === solution.length && liveCount > 0) {
            const reset = document.querySelector('.reset');
            reset.style.opacity = 1;
            reset.style.cursor = "pointer";
            reset.addEventListener('click', () => {
                reset.style.opacity = 0;
                reset.style.cursor = "default";
                localStorage.removeItem('gameState')
                startGame(size);
            });
            setTimeout(() => {
                alert("Completaste el juego!!");
            }, 100);
        }
    
        if (liveCount === 0) {
            localStorage.removeItem('gameState')
            const reset = document.querySelector('.reset');
            reset.style.opacity = 1;
            reset.style.cursor = "pointer";
            reset.addEventListener('click', () => {
                reset.style.opacity = 0;
                reset.style.cursor = "default";
                resetGame(size, solution);
            });
        }
    }    
    
    // Verifica tanto filas como columnas
    function checkCompletion(row, col) {
        checkRowCompletion(row);
        checkColumnCompletion(col);
    }
    
    // Verifica si una fila está completa
    function checkRowCompletion(row) {
        const rowCells = document.querySelectorAll(`[data-row="${row}"]`);
        const totalCorrectCells = solution[row].filter(cell => cell === 1).length;
        let markedCorrectCells = 0;
    
        rowCells.forEach(cell => {
            if (cell.style.backgroundColor === 'rgb(51, 51, 51)') {
                markedCorrectCells++;
            }
        });
    
        if (markedCorrectCells === totalCorrectCells) {
            rowsCompleted++
            rowCells.forEach(cell => {
                if (!cell.id || cell.id !== 'clicked') {
                    cell.innerHTML = '<span style="font-size:15px; font-weight: 800;">✖</span>';
                    cell.id = 'clicked';
                }
            });
        }
    }
    
    // Verifica si una columna está completa
    function checkColumnCompletion(col) {
        const colCells = document.querySelectorAll(`[data-col="${col}"]`);
        let markedCorrectCells = 0;
        let totalCorrectCells = 0;
    
        for (let i = 0; i < solution.length; i++) {
            if (solution[i][col] === 1) totalCorrectCells++;
        }
    
        colCells.forEach(cell => {
            if (cell.style.backgroundColor === 'rgb(51, 51, 51)') {
                markedCorrectCells++;
            }
        });
    
        if (markedCorrectCells === totalCorrectCells) {
            colCells.forEach(cell => {
                if (!cell.id || cell.id !== 'clicked') {
                    cell.innerHTML = '<span style="font-size:15px; font-weight: 800;">✖</span>';
                    cell.id = 'clicked';
                }
            });
    
            // Cambia el color de la pista de la columna completada
            //const colHint = colCells.closest('.col-hint')
            //colHint.style.backgroundColor = "#fcc" // Cambia el color de la pista a gris claro
        }
    }    

    function isAdjacent(cell1, cell2) {
        return (
            (cell1.row === cell2.row && Math.abs(cell1.col - cell2.col) === 1) ||
            (cell1.col === cell2.col && Math.abs(cell1.row - cell2.row) === 1)
        );
    }
}

const sizeSelect = document.querySelector('.select-size')
let solution
let livesInput = document.querySelector('.input-lives')

function resetGame(size, existingSolution) {
    let lives = Math.max(1, Math.min(parseInt(livesInput.value, 10), 10));
    updateLives(lives);
    const { rowHints, colHints } = calculateHints(existingSolution);
    createTable(size, rowHints, colHints);
    const gameSwitch = document.getElementById('check');
    gameSwitch.checked = true;
    setupInteraction(gameSwitch, size, lives, existingSolution);
}

function startGame(size) {
    const savedState = loadGameState();
    
    if (savedState && savedState.size === size) {
        solution = savedState.solution;
        const lives = savedState.lives;
        const buttonsState = savedState.buttonsState;

        rowsCompleted = savedState.rowsCompleted || 0;
        updateLives(lives);
        const { rowHints, colHints } = calculateHints(solution);
        createTable(size, rowHints, colHints);

        const gameSwitch = document.getElementById('check');
        gameSwitch.checked = true;

        setupInteraction(gameSwitch, size, lives, solution);

        restoreButtonsState(buttonsState);
        
    } else {
        let lives = Math.max(1, Math.min(parseInt(livesInput.value, 10), 10));
        const reset = document.querySelector('.reset');
        reset.style.opacity = 0; // Ocultamos el botón de reinicio
        updateLives(lives);
        solution = generateSolution(size);
        const { rowHints, colHints } = calculateHints(solution);
        createTable(size, rowHints, colHints);
        const gameSwitch = document.getElementById('check');
        gameSwitch.checked = true;

        rowsCompleted = 0
        saveGameState(size, lives, solution, getButtonsState(), rowsCompleted)

        setupInteraction(gameSwitch, size, lives, solution);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const savedSize = localStorage.getItem('selectedSize');
    const sizeToStart = savedSize ? parseInt(savedSize) : 5; 
    sizeSelect.value = sizeToStart; 
    
    const savedLives = localStorage.getItem('lives');
    livesInput.value = savedLives ? savedLives : 3;
    startGame(sizeToStart); 
});

sizeSelect.addEventListener("change", () => {
    const selectedSize = parseInt(sizeSelect.value);
    localStorage.setItem('selectedSize', selectedSize);
    startGame(selectedSize);
});

livesInput.addEventListener("input", () => {
    const lives = Math.max(1, Math.min(parseInt(livesInput.value, 10), 10));
    localStorage.setItem('lives', lives);
});


const dialogButton = document.querySelector('.settings-button')
const dialog = document.querySelector('.settings')

dialogButton.addEventListener('click', () => {
    dialog.showModal()
})
