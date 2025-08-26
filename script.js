const historyDisplay = document.querySelector('.history');
const currentOperationDisplay = document.querySelector('.current-operation');
const calculatorButtons = document.querySelectorAll('.calculator-container button');

let currentOperand = '';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;
let isFunctionMode = false;
let functionName = '';

function operate(op, a, b) {
    switch (op) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '×':
            return a * b;
        case '÷':
            if (b === 0) return 'Error';
            return a / b;
        case '√':
            return Math.sqrt(a);
        case 'xⁿ':
            return Math.pow(a, b);
        case 'sin':
            return Math.sin(a * Math.PI / 180);
        case 'cos':
            return Math.cos(a * Math.PI / 180);
        case 'tan':
            return Math.tan(a * Math.PI / 180);
        case 'log':
            if (b <= 0 || a <= 0) return 'Error';
            return Math.log(b) / Math.log(a);
        default:
            return null;
    }
}

function updateDisplay() {
    if (isFunctionMode) {
        historyDisplay.textContent = `${functionName}(${currentOperand})`;
        currentOperationDisplay.textContent = '';
    } else {
        currentOperationDisplay.textContent = currentOperand;
    }
}

calculatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.action;
        const value = button.textContent;

        if (button.classList.contains('btn-number')) {
            if (waitingForSecondOperand) {
                currentOperand = value;
                waitingForSecondOperand = false;
            } else {
                currentOperand = currentOperand === '' ? value : currentOperand + value;
            }
            updateDisplay();
        }

        if (action === 'decimal') {
            if (!currentOperand.includes('.')) {
                currentOperand += '.';
                updateDisplay();
            }
        }

        if (action === 'clear') {
            currentOperand = '';
            firstOperand = null;
            operator = null;
            waitingForSecondOperand = false;
            isFunctionMode = false;
            functionName = '';
            historyDisplay.textContent = '';
            currentOperationDisplay.textContent = '0';
        }

        if (button.classList.contains('btn-operator') && action !== 'power' && action !== 'sqrt' && action !== 'log' && action !== 'sin' && action !== 'cos' && action !== 'tan') {
            if (firstOperand !== null && operator !== null && !waitingForSecondOperand) {
                const result = operate(operator, firstOperand, parseFloat(currentOperand));
                currentOperand = result;
                firstOperand = result;
            } else {
                firstOperand = parseFloat(currentOperand);
            }
            operator = value;
            waitingForSecondOperand = true;
            historyDisplay.textContent = `${firstOperand} ${operator}`;
            updateDisplay();
        }

        if (action === 'calculate') {
            if (firstOperand !== null && operator !== null) {
                const secondOperand = parseFloat(currentOperand);
                const result = operate(operator, firstOperand, secondOperand);
                currentOperand = result;
                firstOperand = null;
                operator = null;
                waitingForSecondOperand = true;
                historyDisplay.textContent = `${firstOperand} ${operator} ${secondOperand} =`;
                updateDisplay();
            }
        }

        if (action === 'sqrt' || action === 'sin' || action === 'cos' || action === 'tan') {
            if (currentOperand !== '') {
                const result = operate(action, parseFloat(currentOperand));
                currentOperand = result;
                updateDisplay();
            }
        }

        if (action === 'power') {
            firstOperand = parseFloat(currentOperand);
            operator = action;
            waitingForSecondOperand = true;
            historyDisplay.textContent = `${firstOperand}^`;
            currentOperand = '';
        }

        if (action === 'log') {
            firstOperand = parseFloat(currentOperand); // Baza logarytmu
            operator = action;
            waitingForSecondOperand = true;
            historyDisplay.textContent = `log${firstOperand}( )`;
            currentOperand = '';
        }
    });
});