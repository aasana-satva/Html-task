const display = document.getElementById("display");
let expression = "";

/* ---------- DISPLAY ---------- */
function updateDisplay() {
    display.innerText = expression || "0";
}

/* ---------- NUMBER ---------- */
function pressNumber(num) {
    // implicit multiply after %
    if (/%$/.test(expression)) {
        expression += "x";
    }
    expression += num;
    updateDisplay();
}

/* ---------- DECIMAL ---------- */
function pressDecimal() {
    const last = expression.split(/[+\-x÷]/).pop().replace('%','');
    if (!last.includes(".")) {
        expression += ".";
        updateDisplay();
    }
}

/* ---------- OPERATOR ---------- */
function pressOperator(op) {
    if (!expression && op !== "-") return;
    if (/[+\-x÷]$/.test(expression)) {
        expression = expression.slice(0, -1);
    }
    expression += op;
    updateDisplay();
}

/* ---------- % (CORRECT) ---------- */
function pressPercent() {
    const match = expression.match(/(\d+\.?\d*)$/);
    if (!match) return;

    const value = (parseFloat(match[1]) / 100).toString();
    expression = expression.replace(/(\d+\.?\d*)$/, value + "%");
    updateDisplay();
}

/* ---------- EQUAL ---------- */
function pressEqual() {
    if (!expression) return;

    try {
        let evalExpr = expression
            .replace(/x/g, "*")
            .replace(/÷/g, "/")
            .replace(/%/g, ""); // % is display-only

        const result = Function("return " + evalExpr)();
        expression = result.toString();
        updateDisplay();
    } catch {
        display.innerText = "Error";
        expression = "";
    }
}

/* ---------- CLEAR ---------- */
function pressAC() {
    expression = "";
    updateDisplay();
}

/* ---------- KEYBOARD ---------- */
document.addEventListener("keydown", e => {
    if (e.key >= "0" && e.key <= "9") pressNumber(e.key);
    if (e.key === ".") pressDecimal();
    if (["+","-","*","/"].includes(e.key)) {
        pressOperator(e.key === "*" ? "x" : e.key === "/" ? "÷" : e.key);
    }
    if (e.key === "%") pressPercent();
    if (e.key === "Enter") pressEqual();
    if (e.key === "Backspace") {
        expression = expression.slice(0, -1);
        updateDisplay();
    }
});