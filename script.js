document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.display');
    const buttons = document.querySelectorAll('.btn');

    let currentInput = '0';
    let firstOperand = null;
    let operator = null;
    let waitingForSecondOperand = false;

    // Aktualizuje wyświetlacz kalkulatora
    const updateDisplay = () => {
        display.textContent = currentInput;
    };

    // Obsługuje kliknięcia przycisków numerycznych
    const handleNumber = (number) => {
        if (waitingForSecondOperand) {
            currentInput = number;
            waitingForSecondOperand = false;
        } else {
            currentInput = currentInput === '0' ? number : currentInput + number;
        }
        updateDisplay();
    };

    // Obsługuje kliknięcie przycisku z kropką dziesiętną
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

    // Obsługuje kliknięcia przycisków operatorów (+, -, ×, ÷, %)
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

    // Obiekt zawierający funkcje obliczeniowe
    const performCalculation = {
        '÷': (first, second) => second === 0 ? 'Error' : first / second,
        '×': (first, second) => first * second,
        '-': (first, second) => first - second,
        '+': (first, second) => first + second,
        '%': (first, second) => first % second,
    };

    // Obsługuje przycisk równości
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

    // Obsługuje przycisk czyszczenia (AC)
    const handleClear = () => {
        currentInput = '0';
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
        updateDisplay();
    };

    // Obsługuje przycisk zmiany znaku (+/-)
    const handleNegate = () => {
        currentInput = (parseFloat(currentInput) * -1).toString();
        updateDisplay();
    };

    // Obsługuje operacje boczne (sin, cos, tg, itd.)
    const handleSideOperation = (formula) => {
        let x = parseFloat(currentInput);
        let result;
        try {
            const evaluatedFormula = formula.replace(/x/g, x);
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

    // Dodaje nasłuchiwacze zdarzeń kliknięcia do wszystkich przycisków
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const buttonText = button.textContent;
            
            if (button.classList.contains('btn-number')) {
                handleNumber(buttonText);
            } else if (button.id === 'btn-dot') {
                handleDecimal();
            } else if (button.classList.contains('btn-operator')) {
                if (['sin', 'cos', 'tg', 'ctg', 'x²', '√x'].includes(buttonText)) {
                    const formula = button.getAttribute('data-formula');
                    if (formula) {
                        handleSideOperation(formula);
                    }
                } else if (button.id === 'btn-percent') {
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
            } else if (button.id === 'btn-clear') {
                handleClear();
            } else if (button.id === 'btn-negate') {
                handleNegate();
            }
        });
    });

    updateDisplay();
});