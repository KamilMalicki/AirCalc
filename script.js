const calculator = document.querySelector('.calculator');
const calculatorScreen = calculator.querySelector('.calculator-screen');
const buttons = calculator.querySelector('.calculator-buttons');

let currentValue = '0';
let firstValue = null;
let operator = null;
let waitingForSecondValue = false;

function updateScreen() {
    calculatorScreen.value = currentValue;
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(currentValue);

    if (operator && waitingForSecondValue) {
        operator = nextOperator;
        return;
    }

    if (firstValue === null) {
        firstValue = inputValue;
    } else if (operator) {
        const result = operate(firstValue, inputValue, operator);
        currentValue = String(result);
        firstValue = result;
    }

    waitingForSecondValue = true;
    operator = nextOperator;
    updateScreen();
}

function operate(num1, num2, op) {
    if (op === '+') return num1 + num2;
    if (op === '-') return num1 - num2;
    if (op === '*') return num1 * num2;
    if (op === '/') return num1 / num2;
}

function handleNumber(number) {
    if (waitingForSecondValue === true) {
        currentValue = number;
        waitingForSecondValue = false;
    } else {
        currentValue = currentValue === '0' ? number : currentValue + number;
    }
    updateScreen();
}

function handleDecimal(dot) {
    if (waitingForSecondValue) return;
    if (!currentValue.includes(dot)) {
        currentValue += dot;
    }
    updateScreen();
}

function resetCalculator() {
    currentValue = '0';
    firstValue = null;
    operator = null;
    waitingForSecondValue = false;
    updateScreen();
}

buttons.addEventListener('click', (event) => {
    const { target } = event;
    if (!target.matches('button')) {
        return;
    }

    const value = target.value;

    switch (value) {
        case '+':
        case '-':
        case '*':
        case '/':
            handleOperator(value);
            break;
        case '.':
            handleDecimal(value);
            break;
        case 'all-clear':
            resetCalculator();
            break;
        case '=':
            if (firstValue === null || operator === null) {
                return;
            }
            const secondValue = parseFloat(currentValue);
            const result = operate(firstValue, secondValue, operator);
            currentValue = String(result);
            firstValue = null;
            operator = null;
            waitingForSecondValue = true;
            updateScreen();
            break;
        default:
            handleNumber(value);
    }
});

updateScreen();