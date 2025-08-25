const display = document.getElementById('display');
const buttons = document.querySelector('.buttons');
let currentInput = '';
let operator = null;
let firstOperand = null;
let shouldResetDisplay = false;

function operate(op, a, b) {
    a = parseFloat(a);
    b = parseFloat(b);
    if (op === '+') return a + b;
    if (op === '-') return a - b;
    if (op === '*') return a * b;
    if (op === '/') return a / b;
    return b;
}

function updateDisplay() {
    display.innerText = currentInput || '0';
}

function handleNumber(number) {
    if (shouldResetDisplay) {
        currentInput = number;
        shouldResetDisplay = false;
    } else {
        currentInput += number;
    }
}

function handleOperator(op) {
    if (firstOperand === null) {
        firstOperand = currentInput;
    } else if (operator) {
        firstOperand = operate(operator, firstOperand, currentInput);
        updateDisplay();
    }
    operator = op;
    shouldResetDisplay = true;
}

function handleEquals() {
    if (operator === null || shouldResetDisplay) return;
    const result = operate(operator, firstOperand, currentInput);
    currentInput = result.toString();
    firstOperand = null;
    operator = null;
    shouldResetDisplay = true;
    updateDisplay();
}

buttons.addEventListener('click', (e) => {
    const target = e.target;
    if (!target.classList.contains('btn')) return;

    if (target.classList.contains('btn-number')) {
        handleNumber(target.innerText);
    } else if (target.classList.contains('btn-decimal')) {
        if (!currentInput.includes('.')) {
            currentInput += '.';
        }
    } else if (target.classList.contains('btn-operator')) {
        const op = target.dataset.op;
        if (op === 'backspace') {
            currentInput = currentInput.slice(0, -1) || '0';
            shouldResetDisplay = false;
        } else {
            handleOperator(op);
        }
    } else if (target.classList.contains('btn-equals')) {
        handleEquals();
    } else if (target.classList.contains('btn-clear')) {
        currentInput = '';
        firstOperand = null;
        operator = null;
        shouldResetDisplay = false;
    }

    updateDisplay();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      console.log('Service Worker registered! 😎', reg);
    }).catch(err => {
      console.log('Service Worker registration failed: 😥', err);
    });
  });
}