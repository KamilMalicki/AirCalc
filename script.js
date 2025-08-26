const mainDisplay = document.querySelector('.main-display');
const powerDisplay = document.querySelector('.power-display');
const buttons = document.querySelector('.buttons');
const scientificButtons = document.querySelector('.scientific-buttons');

let firstValue = '';
let operator = '';
let secondValue = '';
let shouldResetDisplay = false;
let isPowerMode = false;

function operate(operator, a, b) {
    a = parseFloat(a);
    b = parseFloat(b);
    switch (operator) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '×':
            return a * b;
        case '÷':
            return b === 0 ? 'Error' : a / b;
        case '%':
            return a / 100;
        case '√':
            return Math.sqrt(a);
        case 'power':
            return Math.pow(a, b);
        case 'sin':
            return Math.sin(a * (Math.PI / 180));
        case 'cos':
            return Math.cos(a * (Math.PI / 180));
        case 'tan':
            return Math.tan(a * (Math.PI / 180));
        case 'log':
            return Math.log10(a);
        default:
            return null;
    }
}

function updateDisplay(value, targetDisplay = mainDisplay) {
    targetDisplay.textContent = value.toString().substring(0, 10);
}

function resetCalculator() {
    mainDisplay.textContent = '0';
    powerDisplay.textContent = '';
    firstValue = '';
    operator = '';
    secondValue = '';
    shouldResetDisplay = false;
    isPowerMode = false;
}

// Obsługa przycisków standardowego kalkulatora
buttons.addEventListener('click', (event) => {
    const target = event.target;
    if (!target.matches('button')) {
        return;
    }

    const value = target.textContent;
    const action = target.dataset.action;

    if (action === 'power') {
        isPowerMode = true;
        firstValue = mainDisplay.textContent;
        mainDisplay.textContent = '';
        return;
    }

    if (!action) {
        if (shouldResetDisplay) {
            mainDisplay.textContent = value;
            shouldResetDisplay = false;
        } else {
            if (isPowerMode) {
                powerDisplay.textContent += value;
            } else {
                mainDisplay.textContent = mainDisplay.textContent === '0' ? value : mainDisplay.textContent + value;
            }
        }
    }

    if (action === 'clear') {
        resetCalculator();
    }

    if (action === 'decimal') {
        if (shouldResetDisplay) {
            if (isPowerMode) {
                powerDisplay.textContent = '0.';
            } else {
                mainDisplay.textContent = '0.';
            }
            shouldResetDisplay = false;
        } else if (!mainDisplay.textContent.includes('.')) {
            if (isPowerMode && !powerDisplay.textContent.includes('.')) {
                powerDisplay.textContent += '.';
            } else if (!isPowerMode) {
                mainDisplay.textContent += '.';
            }
        }
    }
    
    if (action === 'negate') {
        let currentValue = parseFloat(mainDisplay.textContent);
        if (!isNaN(currentValue)) {
            currentValue = currentValue * -1;
            updateDisplay(currentValue);
        }
    }

    if (action === 'percent') {
        let currentValue = parseFloat(mainDisplay.textContent);
        if (!isNaN(currentValue)) {
            let result = operate('%', currentValue);
            updateDisplay(result);
        }
    }

    if (
        action === 'add' ||
        action === 'subtract' ||
        action === 'multiply' ||
        action === 'divide'
    ) {
        if (firstValue && operator && !shouldResetDisplay) {
            secondValue = mainDisplay.textContent;
            const result = operate(operator, firstValue, secondValue);
            updateDisplay(result);
            firstValue = result;
        } else {
            firstValue = mainDisplay.textContent;
        }
        operator = value;
        shouldResetDisplay = true;
    }

    if (action === 'calculate') {
        if (isPowerMode) {
            secondValue = powerDisplay.textContent;
            const result = operate('power', firstValue, secondValue);
            updateDisplay(result);
            isPowerMode = false;
        } else if (firstValue && operator) {
            secondValue = mainDisplay.textContent;
            const result = operate(operator, firstValue, secondValue);
            updateDisplay(result);
        }
        firstValue = '';
        operator = '';
        powerDisplay.textContent = '';
        shouldResetDisplay = true;
    }
});

// Obsługa przycisków naukowych
scientificButtons.addEventListener('click', (event) => {
    const target = event.target;
    if (!target.matches('button')) {
        return;
    }

    const action = target.dataset.action;
    let currentValue = parseFloat(mainDisplay.textContent);

    if (action === 'sqrt') {
        if (!isNaN(currentValue) && currentValue >= 0) {
            let result = operate('√', currentValue);
            updateDisplay(result);
        } else {
            updateDisplay('Error');
        }
    }
    if (action === 'sin' || action === 'cos' || action === 'tan' || action === 'log') {
        if (!isNaN(currentValue)) {
            let result = operate(action, currentValue);
            updateDisplay(result);
        } else {
            updateDisplay('Error');
        }
    }
});