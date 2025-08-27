document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.display');
    const buttons = document.querySelectorAll('.btn');
    const settingsButton = document.getElementById('btn-settings');
    let settingsPanel = null;

    let currentInput = '0';
    let firstOperand = null;
    let operator = null;
    let waitingForSecondOperand = false;

    // Aktualizuje wyświetlacz kalkulatora
    const updateDisplay = () => {
        display.textContent = currentInput;
    };

    // Obsługa dynamicznego panelu konfiguracji
    const createSettingsPanel = () => {
        if (settingsPanel) {
            // Jeśli panel już istnieje, po prostu go pokaż
            settingsPanel.style.display = 'flex';
            return;
        }

        settingsPanel = document.createElement('div');
        settingsPanel.classList.add('settings-panel');
        settingsPanel.innerHTML = `
            <h3>Konfiguracja</h3>
            <label for="calc-bg-color">Tło kalkulatora:</label>
            <input type="color" id="calc-bg-color" value="#ffffff">
            <label for="btn-bg-color">Kolor przycisków:</label>
            <input type="color" id="btn-bg-color" value="#f0f0f0">
            <label for="op-btn-color">Kolor operatorów:</label>
            <input type="color" id="op-btn-color" value="#ff9500">
            <button id="close-settings-btn">Zamknij</button>
        `;
        document.body.appendChild(settingsPanel);

        const closeSettingsBtn = document.getElementById('close-settings-btn');
        closeSettingsBtn.addEventListener('click', () => {
            settingsPanel.style.display = 'none';
        });

        const calcBgColor = document.getElementById('calc-bg-color');
        calcBgColor.addEventListener('input', (e) => {
            document.querySelector('.calculator-layout').style.backgroundColor = e.target.value;
        });

        const btnBgColor = document.getElementById('btn-bg-color');
        btnBgColor.addEventListener('input', (e) => {
            document.querySelectorAll('.btn-number, .btn-decimal, .btn-clear, .btn-negate').forEach(btn => {
                btn.style.backgroundColor = e.target.value;
            });
        });

        const opBtnColor = document.getElementById('op-btn-color');
        opBtnColor.addEventListener('input', (e) => {
            document.querySelectorAll('.btn-operator, .btn-equal').forEach(btn => {
                btn.style.backgroundColor = e.target.value;
            });
        });
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

    // Obsługuje kliknięcia przycisków operatorów (+, -, ×, ÷)
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
        '+': (first, second) => first + second
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

    // Obsługuje operację procentową (%)
    const handlePercent = () => {
        currentInput = (parseFloat(currentInput) / 100).toString();
        if (firstOperand) {
            const inputValue = parseFloat(currentInput);
            const result = performCalculation[operator](firstOperand, inputValue);
            currentInput = `${parseFloat(result.toFixed(7))}`;
            firstOperand = parseFloat(currentInput);
            operator = null;
        }
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
            } else if (button.id === 'btn-clear') {
                handleClear();
            } else if (button.id === 'btn-negate') {
                handleNegate();
            } else if (button.id === 'btn-percent') {
                handlePercent();
            } else if (button.id === 'btn-settings') {
                createSettingsPanel();
            } else if (button.classList.contains('btn-operator')) {
                if (['sin', 'cos', 'tg', 'ctg', 'x²', '√x'].includes(buttonText)) {
                    const formula = button.getAttribute('data-formula');
                    if (formula) {
                        handleSideOperation(formula);
                    }
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

    // Obsługa klawiatury
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        if (settingsPanel && settingsPanel.style.display !== 'none') {
            return; // Wyjdź, jeśli panel ustawień jest otwarty
        }

        if (/\d/.test(key)) {
            handleNumber(key);
        } else if (key === '.') {
            handleDecimal();
        } else if (key === '+' || key === '-') {
            e.preventDefault();
            handleOperator(key);
        } else if (key === '*' || key.toLowerCase() === 'x') {
            e.preventDefault();
            handleOperator('×');
        } else if (key === '/') {
            e.preventDefault();
            handleOperator('÷');
        } else if (key === 'Enter') {
            handleEquals();
        } else if (key === 'Backspace') {
            currentInput = currentInput.slice(0, -1) || '0';
            updateDisplay();
        } else if (key === 'Escape') {
            handleClear();
        }
    });

    updateDisplay();
});