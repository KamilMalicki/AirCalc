const display = document.querySelector('.display');
const buttons = document.querySelector('.buttons');

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

buttons.addEventListener('click', (event) => {
    const target = event.target;
    if (!target.matches('button')) {
        return;
    }

    const value = target.textContent;
    const action = target.dataset.action;

    if (!action) {
        if (shouldResetDisplay) {
            display.textContent = value;
            shouldResetDisplay = false;
        } else {
            display.textContent = display.textContent === '0' ? value : display.textContent + value;
        }
    }

    if (action === 'clear') {
        display.textContent = '0';
        firstValue = '';
        operator = '';
        secondValue = '';
        shouldResetDisplay = false;
    }

    if (action === 'decimal') {
        if (shouldResetDisplay) {
            display.textContent = '0.';
            shouldResetDisplay = false;
        } else if (!display.textContent.includes('.')) {
            display.textContent += '.';
        }
    }
    
    if (action === 'negate') {
        let currentValue = parseFloat(display.textContent);
        if (!isNaN(currentValue)) {
            currentValue = currentValue * -1;
            updateDisplay(currentValue);
        }
    }

    if (action === 'percent') {
        let currentValue = parseFloat(display.textContent);
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
            secondValue = display.textContent;
            const result = operate(operator, firstValue, secondValue);
            updateDisplay(result);
            firstValue = result;
        } else {
            firstValue = display.textContent;
        }
        operator = value;
        shouldResetDisplay = true;
    }

    if (action === 'calculate') {
        if (firstValue && operator) {
            secondValue = display.textContent;
            const result = operate(operator, firstValue, secondValue);
            updateDisplay(result);
            firstValue = '';
            operator = '';
            shouldResetDisplay = true;
        }
    }
});
