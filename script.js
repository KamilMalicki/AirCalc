

const display = document.querySelector('.display');
const buttons = document.querySelector('.buttons');
const sideOps = document.querySelector('.side-ops');

let shouldResetDisplay = false;
let firstValue = '';
let operator = '';
let secondValue = '';


const display = document.querySelector('.display');
const buttons = document.querySelector('.buttons');
const sideOps = document.querySelector('.side-ops');

let shouldResetDisplay = false;
let firstValue = '';
let operator = '';
let secondValue = '';

// Add event listeners for function buttons in side-ops
['btn-sin','btn-cos','btn-tan','btn-cot','btn-square','btn-sqrt'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
        btn.addEventListener('click', function() {
            let x = parseFloat(display.textContent);
            if (isNaN(x)) x = 0;
            let formula = btn.getAttribute('data-formula');
            try {
                let result = eval(formula);
                display.textContent = result.toString();
            } catch(e) {
                display.textContent = 'Error';
            }
            shouldResetDisplay = true;
        });
    }
});

// Keep basic calculator logic for number and operator buttons
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
            display.textContent = (-currentValue).toString();
        }
        return;
    }

    if (action === 'percent') {
        let currentValue = parseFloat(display.textContent);
        if (!isNaN(currentValue)) {
            display.textContent = (currentValue / 100).toString();
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
            let a = parseFloat(firstValue);
            let b = parseFloat(secondValue);
            let result;
            switch (action) {
                case 'add': result = a + b; break;
                case 'subtract': result = a - b; break;
                case 'multiply': result = a * b; break;
                case 'divide': result = b === 0 ? 'Error' : a / b; break;
            }
            display.textContent = result.toString();
            firstValue = result;
        } else {
            firstValue = display.textContent;
        }
        operator = action;
        shouldResetDisplay = true;
        return;
    }

    if (action === 'calculate') {
        if (firstValue && operator) {
            secondValue = display.textContent;
            let a = parseFloat(firstValue);
            let b = parseFloat(secondValue);
            let result;
            switch (operator) {
                case 'add': result = a + b; break;
                case 'subtract': result = a - b; break;
                case 'multiply': result = a * b; break;
                case 'divide': result = b === 0 ? 'Error' : a / b; break;
            }
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
