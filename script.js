let input = document.getElementById("input");
let history = document.getElementById("history");
let buttons = document.querySelectorAll("button");
let clear = document.getElementById("clear");
let backspace = document.getElementById("backspace");
let equals = document.getElementById("equals");
let memoryStore = document.getElementById("memory-store");
let memoryRecall = document.getElementById("memory-recall");
let sqrtButton = document.getElementById("sqrt");
let powerButton = document.getElementById("power");
let powerYButton = document.getElementById("power-y");
let piButton = document.getElementById("pi");
let bracketButton = document.getElementById("bracket");
let logButton = document.getElementById("log");
let lnButton = document.getElementById("ln");
let expButton = document.getElementById("exp");
let ansButton = document.getElementById("ans");


let expression = "";
let memoryValue = 0;
let lastResult = 0;
let bracketOpen = false;
let scientificMode = true;

updateDisplay();


buttons.forEach(button => {
    button.addEventListener("click", (e) => {

        button.classList.add("button-press");
        setTimeout(() => {
            button.classList.remove("button-press");
        }, 200);
        

        playButtonSound();
        
        handleButtonClick(e.target);
    });
});


document.addEventListener("keydown", (e) => {
    const key = e.key;
    

    if (key >= "0" && key <= "9" || key === "." || key === "+" || key === "-" || key === "*" || key === "/" || key === "%") {
        appendToExpression(key);
        playButtonSound();
    } else if (key === "Enter" || key === "=") {
        calculateResult();
        playButtonSound();
    } else if (key === "Backspace") {
        removeLastCharacter();
        playButtonSound();
    } else if (key === "Escape" || key === "c" || key === "C") {
        clearAll();
        playButtonSound();
    } else if (key === "(" || key === ")") {
        toggleBracket();
        playButtonSound();
    }
});

function playButtonSound() {

    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.type = "sine";
    oscillator.frequency.value = 600;
    gainNode.gain.value = 0.1;
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.start(0);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.1);
    oscillator.stop(context.currentTime + 0.1);
}

function handleButtonClick(button) {
    const value = button.textContent;
    
    
    if ((value >= "0" && value <= "9") || value === "." || value === "+" || value === "-" || value === "*" || value === "/" || value === "%") {
        appendToExpression(value);
    } 
    
    else if (button.id === "clear") {
        clearAll();
    } else if (button.id === "backspace") {
        removeLastCharacter();
    } else if (button.id === "equals") {
        calculateResult();
    } else if (button.id === "memory-store") {
        storeInMemory();
    } else if (button.id === "memory-recall") {
        recallFromMemory();
    } else if (button.id === "sqrt") {
        calculateSquareRoot();
    } else if (button.id === "power") {
        calculatePower();
    } else if (button.id === "power-y") {
        appendToExpression("**");
    } else if (button.id === "pi") {
        appendPi();
    } else if (button.id === "bracket") {
        toggleBracket();
    } else if (button.id === "log") {
        calculateLog();
    } else if (button.id === "ln") {
        calculateLn();
    } else if (button.id === "exp") {
        appendExponential();
    } else if (button.id === "ans") {
        useLastAnswer();
    } else if (value === "sin") {
        calculateTrig("sin");
    } else if (value === "cos") {
        calculateTrig("cos");
    } else if (value === "tan") {
        calculateTrig("tan");
    }
}

function appendToExpression(value) {
    
    if (value === "." && expression.match(/\.\d*$/)) return;
    
    
    if ("+-*/%".includes(value)) {
    
        if ("+-*/%".includes(expression.slice(-1))) {
            expression = expression.slice(0, -1) + value;
        } else {
            expression += value;
        }
    } else if (value === "**") {
        if (expression.length > 0 && !"+-*/%(".includes(expression.slice(-1))) {
            expression += "**";
        }
    } else {
        expression += value;
    }
    
    updateDisplay();
}

function clearAll() {
    expression = "";
    history.textContent = "0";
    updateDisplay();
}

function removeLastCharacter() {
    if (expression.slice(-2) === "**") {
        expression = expression.slice(0, -2);
    } else {
        expression = expression.slice(0, -1);
    }
    updateDisplay();
}

function calculateResult() {
    try {
        
        history.textContent = expression;
        
        
        let processedExpression = expression;
        
        
        let result = eval(processedExpression);
        
        
        if (result === undefined) {
            expression = "0";
        } else if (!isFinite(result)) {
            expression = "Error";
            input.classList.add("error");
            setTimeout(() => {
                input.classList.remove("error");
            }, 1000);
        } else {
           
            if (Number.isInteger(result)) {
                expression = result.toString();
            } else {
           
                if (Math.abs(result) > 1e10 || (Math.abs(result) < 1e-10 && result !== 0)) {
                    expression = result.toExponential(6);
                } else {
           
                    expression = parseFloat(result.toFixed(8)).toString();
                }
            }
            lastResult = result;
        }
    } catch (e) {
        expression = "Error";
        input.classList.add("error");
        setTimeout(() => {
            input.classList.remove("error");
        }, 1000);
    }
    
    updateDisplay();
}

function updateDisplay() {
    input.textContent = expression || "0";
}

function storeInMemory() {
    try {
        if (expression) {
            memoryValue = eval(expression);
            
                    input.textContent += " M";
            setTimeout(() => {
                updateDisplay();
            }, 500);
        }
    } catch (e) {
        
    }
}

function recallFromMemory() {
    expression = memoryValue.toString();
    updateDisplay();
}

function calculateSquareRoot() {
    try {
        let value;
        
        if (expression) {
            value = eval(expression);
        } else {
            value = 0;
        }
        
        if (value < 0) {
            expression = "Error";
            input.classList.add("error");
            setTimeout(() => {
                input.classList.remove("error");
            }, 1000);
        } else {
            history.textContent = `√(${expression})`;
            expression = Math.sqrt(value).toString();
        }
        
        updateDisplay();
    } catch (e) {
        expression = "Error";
        updateDisplay();
    }
}

function calculatePower() {
    try {
        if (expression) {
            history.textContent = `(${expression})²`;
            let value = eval(expression);
            expression = (value * value).toString();
        } else {
            expression = "0";
        }
        
        updateDisplay();
    } catch (e) {
        expression = "Error";
        updateDisplay();
    }
}

function appendPi() {
    expression += Math.PI.toString();
    updateDisplay();
}

function toggleBracket() {
    if (!bracketOpen) {
        expression += "(";
        bracketOpen = true;
    } else {
        expression += ")";
        bracketOpen = false;
    }
    
    updateDisplay();
}

function calculateTrig(func) {
    try {
        let value;
        
        if (expression) {
            value = eval(expression);
        } else {
            value = 0;
        }
        
        
        const radians = value * (Math.PI / 180);
        let result;
        
        if (func === "sin") {
            history.textContent = `sin(${expression})`;
            result = Math.sin(radians);
        } else if (func === "cos") {
            history.textContent = `cos(${expression})`;
            result = Math.cos(radians);
        } else if (func === "tan") {
            history.textContent = `tan(${expression})`;
            result = Math.tan(radians);
        }
        
        expression = result.toFixed(10).toString();
        updateDisplay();
    } catch (e) {
        expression = "Error";
        updateDisplay();
    }
}

function calculateLog() {
    try {
        let value;
        
        if (expression) {
            value = eval(expression);
        } else {
            value = 0;
        }
        
        if (value <= 0) {
            expression = "Error";
            input.classList.add("error");
            setTimeout(() => {
                input.classList.remove("error");
            }, 1000);
        } else {
            history.textContent = `log(${expression})`;
            expression = Math.log10(value).toString();
        }
        
        updateDisplay();
    } catch (e) {
        expression = "Error";
        updateDisplay();
    }
}

function calculateLn() {
    try {
        let value;
        
        if (expression) {
            value = eval(expression);
        } else {
            value = 0;
        }
        
        if (value <= 0) {
            expression = "Error";
            input.classList.add("error");
            setTimeout(() => {
                input.classList.remove("error");
            }, 1000);
        } else {
            history.textContent = `ln(${expression})`;
            expression = Math.log(value).toString();
        }
        
        updateDisplay();
    } catch (e) {
        expression = "Error";
        updateDisplay();
    }
}

function appendExponential() {
    if (expression && !"+-*/%(".includes(expression.slice(-1))) {
        expression += "e";
    }
    updateDisplay();
}

function useLastAnswer() {
    expression += lastResult.toString();
    updateDisplay();
}