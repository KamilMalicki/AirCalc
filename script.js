    if (action === 'sin') {
        let currentValue = parseFloat(display.textContent);
        if (!isNaN(currentValue)) {
            // Convert degrees to radians
            let radians = currentValue * Math.PI / 180;
            display.textContent = Math.sin(radians).toString();
            shouldResetDisplay = true;
        }
        return;
    }

    if (action === 'cos') {
        let currentValue = parseFloat(display.textContent);
        if (!isNaN(currentValue)) {
            let radians = currentValue * Math.PI / 180;
            display.textContent = Math.cos(radians).toString();
            shouldResetDisplay = true;
        }
        return;
    }

    if (action === 'tan') {
        let currentValue = parseFloat(display.textContent);
        if (!isNaN(currentValue)) {
            let radians = currentValue * Math.PI / 180;
            display.textContent = Math.tan(radians).toString();
            shouldResetDisplay = true;
        }
        return;
    }

    if (action === 'cot') {
        let currentValue = parseFloat(display.textContent);
        if (!isNaN(currentValue)) {
            let radians = currentValue * Math.PI / 180;
            let tanValue = Math.tan(radians);
            if (tanValue === 0) {
                display.textContent = 'Error';
            } else {
                display.textContent = (1 / tanValue).toString();
            }
            shouldResetDisplay = true;
        }
        return;
    }

    if (action === 'square') {
        let currentValue = parseFloat(display.textContent);
        if (!isNaN(currentValue)) {
            display.textContent = (currentValue ** 2).toString();
            shouldResetDisplay = true;
        }
        return;
    }

const display = document.querySelector('.display');
const buttons = document.querySelector('.buttons');
const sideOps = document.querySelector('.side-ops');


let firstValue = '';
let operator = '';
let secondValue = '';
let shouldResetDisplay = false;

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
        default:
            return null;
    }
}

function updateDisplay(value) {
    display.textContent = value.toString().substring(0, 10);
}


function handleButtonAction(target) {
    if (!target.matches('button')) return;
    const value = target.textContent;
    const action = target.dataset.action;

    if (!action) {
        if (shouldResetDisplay) {
            display.textContent = value;
            shouldResetDisplay = false;
        } else {
            display.textContent = display.textContent === '0' ? value : display.textContent + value;
        }
        return;
    }

    if (action === 'clear') {
        display.textContent = '0';
        firstValue = '';
        operator = '';
        secondValue = '';
        shouldResetDisplay = false;
        return;
    }

    if (action === 'decimal') {
        if (shouldResetDisplay) {
            display.textContent = '0.';
            shouldResetDisplay = false;
        } else if (!display.textContent.includes('.')) {
            display.textContent += '.';
        }
        return;
    }

    if (action === 'negate') {
        let currentValue = parseFloat(display.textContent);
        if (!isNaN(currentValue)) {
            currentValue = currentValue * -1;
            updateDisplay(currentValue);
        }
        return;
    }

    if (action === 'percent') {
        let currentValue = parseFloat(display.textContent);
        if (!isNaN(currentValue)) {
            let result = operate('%', currentValue);
            updateDisplay(result);
        }
        return;
    }

    if (action === 'sqrt') {
        let currentValue = parseFloat(display.textContent);
        if (!isNaN(currentValue)) {
            if (currentValue < 0) {
                display.textContent = 'Error';
            } else {
                display.textContent = Math.sqrt(currentValue).toString();
            }
            shouldResetDisplay = true;
        }
        return;
    }

    if (
        action === 'add' ||
        action === 'subtract' ||
        action === 'multiply' ||
        action === 'divide'
    ) {
        if (firstValue && operator && !shouldResetDisplay) {
            secondValue = display.textContent;
            const result = operate(operator, firstValue, secondValue);
            updateDisplay(result);
            firstValue = result;
        } else {
            firstValue = display.textContent;
        }
        operator = value;
        shouldResetDisplay = true;
        return;
    }

    if (action === 'calculate') {
        if (firstValue && operator) {
            secondValue = display.textContent;
            const result = operate(operator, firstValue, secondValue);
            updateDisplay(result);
            firstValue = '';
            operator = '';
            secondValue = '';
            shouldResetDisplay = true;
        }
        return;
    }
}

buttons.addEventListener('click', (event) => {
    handleButtonAction(event.target);
});

sideOps.addEventListener('click', (event) => {
    handleButtonAction(event.target);
});
