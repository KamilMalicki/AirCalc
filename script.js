

const display = document.querySelector('.display');
const buttons = document.querySelector('.buttons');
const sideOps = document.querySelector('.side-ops');

let shouldResetDisplay = false;
let firstValue = '';
let operator = '';
let secondValue = '';

// Single-argument calculator functions
const calcFunctions = {
    sin: x => Math.sin(x * Math.PI / 180),
    cos: x => Math.cos(x * Math.PI / 180),
    tan: x => Math.tan(x * Math.PI / 180),
    cot: x => {
        const t = Math.tan(x * Math.PI / 180);
        return t === 0 ? 'Error' : 1 / t;
    },
    square: x => x ** 2,
    sqrt: x => x < 0 ? 'Error' : Math.sqrt(x),
};

// Two-argument operations
const basicOps = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => b === 0 ? 'Error' : a / b,
    percent: a => a / 100,
};

function handleButtonAction(target) {
    if (!target.matches('button')) return;
    const value = target.textContent;
    const action = target.dataset.action;

    // Number input
    if (!action) {
        if (shouldResetDisplay) {
            display.textContent = value;
            shouldResetDisplay = false;
        } else {
            display.textContent = display.textContent === '0' ? value : display.textContent + value;
        }
        return;
    }

    // Clear
    if (action === 'clear') {
        display.textContent = '0';
        firstValue = '';
        operator = '';
        secondValue = '';
        shouldResetDisplay = false;
        return;
    }

    // Decimal
    if (action === 'decimal') {
        if (shouldResetDisplay) {
            display.textContent = '0.';
            shouldResetDisplay = false;
        } else if (!display.textContent.includes('.')) {
            display.textContent += '.';
        }
        return;
    }

    // Negate
    if (action === 'negate') {
        let currentValue = parseFloat(display.textContent);
        if (!isNaN(currentValue)) {
            display.textContent = (-currentValue).toString();
        }
        return;
    }

    // Percent
    if (action === 'percent') {
        let currentValue = parseFloat(display.textContent);
        if (!isNaN(currentValue)) {
            display.textContent = basicOps.percent(currentValue).toString();
            shouldResetDisplay = true;
        }
        return;
    }

    // Single-argument functions (sin, cos, tan, cot, square, sqrt)
    if (calcFunctions[action]) {
        let currentValue = parseFloat(display.textContent);
        if (isNaN(currentValue)) currentValue = 0;
        let result = calcFunctions[action](currentValue);
        display.textContent = result.toString();
        shouldResetDisplay = true;
        return;
    }

    // Two-argument operations (+, -, *, /)
    if (['add', 'subtract', 'multiply', 'divide'].includes(action)) {
        if (firstValue && operator && !shouldResetDisplay) {
            secondValue = display.textContent;
            let a = parseFloat(firstValue);
            let b = parseFloat(secondValue);
            let result = basicOps[operator](a, b);
            display.textContent = result.toString();
            firstValue = result;
        } else {
            firstValue = display.textContent;
        }
        operator = action;
        shouldResetDisplay = true;
        return;
    }

    // Equals
    if (action === 'calculate') {
        if (firstValue && operator) {
            secondValue = display.textContent;
            let a = parseFloat(firstValue);
            let b = parseFloat(secondValue);
            let result = basicOps[operator](a, b);
            display.textContent = result.toString();
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
