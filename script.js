document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.display');
    const buttons = document.querySelectorAll('.btn');
    const sideOps = document.querySelectorAll('.side-ops .btn');

    let currentInput = '0';
    let firstOperand = null;
    let operator = null;
    let waitingForSecondOperand = false;

    // Updates the calculator display
    const updateDisplay = () => {
        display.textContent = currentInput;
    };

    // Handles number button clicks
    const handleNumber = (number) => {
        if (waitingForSecondOperand) {
            currentInput = number;
            waitingForSecondOperand = false;
        } else {
            currentInput = currentInput === '0' ? number : currentInput + number;
        }
        updateDisplay();
    };

    // Handles decimal point button click
    const handleDecimal = () => {
        if (waitingForSecondOperand) {
            currentInput = '0.';
            waitingForSecondOperand = false;
            updateDisplay();
            return;
        }
        if (!currentInput.includes('.')) {
            currentInput += '.';
        }
        updateDisplay();
    };

    // Handles operator button clicks (+, -, ×, ÷)
    const handleOperator = (nextOperator) => {
        const inputValue = parseFloat(currentInput);

        if (operator && waitingForSecondOperand) {
            operator = nextOperator;
            return;
        }

        if (firstOperand === null) {
            firstOperand = inputValue;
        } else if (operator) {
            const result = performCalculation[operator](firstOperand, inputValue);
            currentInput = `${parseFloat(result.toFixed(7))}`;
            firstOperand = parseFloat(currentInput);
        }

        waitingForSecondOperand = true;
        operator = nextOperator;
        updateDisplay();
    };

    // Object containing calculation functions
    const performCalculation = {
        '÷': (first, second) => second === 0 ? 'Error' : first / second,
        '×': (first, second) => first * second,
        '-': (first, second) => first - second,
        '+': (first, second) => first + second,
        '%': (first, second) => first % second,
    };

    // Handles the equals button
    const handleEquals = () => {
        if (operator && !waitingForSecondOperand) {
            const secondOperand = parseFloat(currentInput);
            const result = performCalculation[operator](firstOperand, secondOperand);
            currentInput = `${parseFloat(result.toFixed(7))}`;
            firstOperand = null;
            operator = null;
            waitingForSecondOperand = false;
            updateDisplay();
        }
    };

    // Handles the clear button (AC)
    const handleClear = () => {
        currentInput = '0';
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
        updateDisplay();
    };

    // Handles the negate button (+/-)
    const handleNegate = () => {
        currentInput = (parseFloat(currentInput) * -1).toString();
        updateDisplay();
    };

    // Handles the trigonometric and other side operations
    const handleSideOperation = (formula) => {
        let x = parseFloat(currentInput);
        let result;
        try {
            // Replaces the placeholder 'x' with the current input value
            const evaluatedFormula = formula.replace(/x/g, x);
            // Uses eval() to execute the mathematical formula string
            result = eval(evaluatedFormula);
            if (result === Infinity || result === -Infinity || isNaN(result)) {
                result = 'Error';
            } else {
                result = parseFloat(result.toFixed(7));
            }
        } catch (e) {
            result = 'Error';
        }
        currentInput = result.toString();
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
        updateDisplay();
    };

    // Adds click event listeners to all buttons
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('btn-number')) {
                handleNumber(button.textContent);
            } else if (button.id === 'btn-dot') {
                handleDecimal();
            } else if (button.id === 'btn-clear') {
                handleClear();
            } else if (button.id === 'btn-negate') {
                handleNegate();
            } else if (button.classList.contains('btn-operator')) {
                if (button.id === 'btn-percent') {
                    handleOperator('%');
                } else if (button.id === 'btn-divide') {
                    handleOperator('÷');
                } else if (button.id === 'btn-multiply') {
                    handleOperator('×');
                } else if (button.id === 'btn-subtract') {
                    handleOperator('-');
                } else if (button.id === 'btn-add') {
                    handleOperator('+');
                }
            } else if (button.id === 'btn-calculate') {
                handleEquals();
            }
        });
    });

    // Adds click event listeners to the side operations buttons
    sideOps.forEach(button => {
        button.addEventListener('click', () => {
            const formula = button.getAttribute('data-formula');
            if (formula) {
                handleSideOperation(formula);
            }
        });
    });

    // Initial display update
    updateDisplay();
});