document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.display');
    const buttons = document.querySelectorAll('.btn');
    const powerToggleButton = document.getElementById('btn-power-toggle');

    let currentInput = '0';
    let expression = '';
    let isExponentMode = false;
    let base = null;

    // Aktualizuje wyświetlacz kalkulatora
    const updateDisplay = () => {
        if (isExponentMode) {
            display.innerHTML = `${base}<sup>${currentInput}</sup>`;
        } else {
            // Zamiana symboli operatorów na te widoczne dla użytkownika
            let displayExpression = expression.replace(/\*\*/g, '^').replace(/\*/g, '×').replace(/\//g, '÷');
            display.textContent = displayExpression + currentInput;
            if (expression === '' && currentInput === '0') {
                 display.textContent = '0';
            }
        }
    };

    // Obsługuje kliknięcia przycisków numerycznych
    const handleNumber = (number) => {
        if (isExponentMode) {
            currentInput += number;
        } else {
            if (currentInput === '0' && number !== '.') {
                currentInput = number;
            } else {
                currentInput += number;
            }
        }
        updateDisplay();
    };

    // Obsługuje operatory matematyczne (+, -, *, /)
    const handleOperator = (op) => {
        if (isExponentMode) {
            expression += `**${currentInput}`;
            isExponentMode = false;
            powerToggleButton.textContent = 'x^y';
        } else {
            expression += currentInput;
        }
        expression += op;
        currentInput = '0';
        updateDisplay();
    };

    // Obsługuje przycisk równości
    const handleEquals = () => {
        if (isExponentMode) {
            expression += `**${currentInput}`;
            isExponentMode = false;
            powerToggleButton.textContent = 'x^y';
        } else {
             expression += currentInput;
        }
       
        try {
            // Obliczenie wyrażenia, zamieniając symbole na format JS
            const result = eval(expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/\^/g, '**'));
            currentInput = result.toString();
            expression = '';
            updateDisplay();
        } catch (e) {
            currentInput = 'Error';
            expression = '';
            updateDisplay();
        }
    };

    // Obsługuje przycisk czyszczenia (AC)
    const handleClear = () => {
        currentInput = '0';
        expression = '';
        isExponentMode = false;
        base = null;
        powerToggleButton.textContent = 'x^y';
        updateDisplay();
    };

    // Obsługuje przycisk zmiany znaku (+/-)
    const handleNegate = () => {
        currentInput = (parseFloat(currentInput) * -1).toString();
        updateDisplay();
    };

    // Obsługa operacji bocznych (sin, cos, tg, itd.)
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
        expression = '';
        isExponentMode = false;
        base = null;
        powerToggleButton.textContent = 'x^y';
        updateDisplay();
    };

    // Obsługa przełącznika potęgi
    const handlePowerToggle = () => {
        if (!isExponentMode) {
            if (currentInput !== '0') {
                base = currentInput;
                isExponentMode = true;
                currentInput = '';
                powerToggleButton.textContent = 'x↓';
                updateDisplay();
            }
        } else {
            // Wychodzenie z trybu wykładnika
            expression += `${base}**${currentInput}`;
            isExponentMode = false;
            currentInput = '0';
            base = null;
            powerToggleButton.textContent = 'x^y';
            updateDisplay();
        }
    };

    // Dodaje nasłuchiwacze zdarzeń kliknięcia do wszystkich przycisków
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const buttonText = button.textContent;
            
            if (button.classList.contains('btn-number')) {
                handleNumber(buttonText);
            } else if (button.id === 'btn-dot') {
                handleNumber('.');
            } else if (button.id === 'btn-clear') {
                handleClear();
            } else if (button.id === 'btn-calculate') {
                handleEquals();
            } else if (button.id === 'btn-power-toggle') {
                handlePowerToggle();
            } else if (button.classList.contains('btn-operator')) {
                 if (['sin', 'cos', 'tg', 'ctg', '√x'].includes(buttonText)) {
                    const formula = button.getAttribute('data-formula');
                    if (formula) {
                        handleSideOperation(formula);
                    }
                } else if (button.id === 'btn-negate') {
                    handleNegate();
                } else {
                    handleOperator(buttonText);
                }
            }
        });
    });

    updateDisplay();
});