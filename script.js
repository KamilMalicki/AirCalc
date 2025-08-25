const calculator = document.querySelector('.calculator');
const calculatorScreen = calculator.querySelector('.calculator-screen');
const buttons = calculator.querySelector('.calculator-buttons');

let previousValue = '';
let operator = null;
let currentValue = '0';
let waitingForSecondValue = false;

const updateScreen = () => {
    calculatorScreen.value = currentValue;
};

const handleButtonClick = (event) => {
    const { value } = event.target;
    if (event.target.tagName !== 'BUTTON') {
        return;
    }

    if (event.target.classList.contains('operator')) {
        handleOperator(value);
        updateScreen();
        return;
    }

    if (event.target.classList.contains('decimal')) {
        handleDecimal(value);
        updateScreen();
        return;
    }

    if (event.target.classList.contains('all-clear')) {
        handleAllClear();
        updateScreen();
        return;
    }

    handleNumber(value);
    updateScreen();
};

const handleNumber = (number) => {
    if (waitingForSecondValue) {
        currentValue = number;
        waitingForSecondValue = false;
    } else {
        currentValue = currentValue === '0' ? number : currentValue + number;
    }
};

const handleDecimal = (dot) => {
    if (waitingForSecondValue) return;

    if (!currentValue.includes(dot)) {
        currentValue += dot;
    }
};

const handleOperator = (nextOperator) => {
    const inputValue = parseFloat(currentValue);

    if (operator && waitingForSecondValue) {
        operator = nextOperator;
        return;
    }

    if (previousValue === '') {
        previousValue = inputValue;
    } else if (operator) {
        const result = calculate(previousValue, inputValue, operator);
        currentValue = `${parseFloat(result.toFixed(7))}`;
        previousValue = result;
    }
    
    waitingForSecondValue = true;
    operator = nextOperator;
};

const calculate = (firstValue, secondValue, operator) => {
    if (operator === '+') {
        return firstValue + secondValue;
    }
    if (operator === '-') {
        return firstValue - secondValue;
    }
    if (operator === '*') {
        return firstValue * secondValue;
    }
    if (operator === '/') {
        return firstValue / secondValue;
    }
    return secondValue;
};

const handleAllClear = () => {
    previousValue = '';
    operator = null;
    currentValue = '0';
    waitingForSecondValue = false;
};

buttons.addEventListener('click', handleButtonClick);