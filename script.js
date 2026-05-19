let expression = '';
let justCalculated = false;
let history = [];

const display = document.getElementById('result');
const expressionDisplay = document.getElementById('expression');
const historyList = document.getElementById('historyList');

function updateDisplay(value) {
  display.textContent = value || '0';
}

function appendValue(value) {
  if (justCalculated && !isNaN(value)) {
    expression = '';
    justCalculated = false;
  }
  if (justCalculated && isNaN(value)) {
    justCalculated = false;
  }
  expression += value;
  expressionDisplay.textContent = expression;
  updateDisplay(expression);
}

function clearAll() {
  expression = '';
  expressionDisplay.textContent = '';
  updateDisplay('0');
}

function deleteLast() {
  expression = expression.slice(0, -1);
  expressionDisplay.textContent = expression;
  updateDisplay(expression || '0');
}

function calculate() {
  try {
    const sanitized = expression.replace(/×/g, '*').replace(/÷/g, '/');
    const result = Function('"use strict"; return (' + sanitized + ')')();
    const historyEntry = { expr: expression, result: result };
    history.unshift(historyEntry);
    updateHistoryUI();
    expressionDisplay.textContent = expression + ' =';
    expression = String(result);
    updateDisplay(result);
    justCalculated = true;
  } catch {
    updateDisplay('Error');
    expression = '';
  }
}

function updateHistoryUI() {
  if (history.length === 0) {
    historyList.innerHTML = '<p class="no-history">No calculations yet!</p>';
    return;
  }
  historyList.innerHTML = history.map(item => `
    <div class="history-item">
      <span class="history-expr">${item.expr} =</span>
      <span class="history-result">${item.result}</span>
    </div>
  `).join('');
}

function clearHistory() {
  history = [];
  updateHistoryUI();
}

document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') appendValue(e.key);
  else if (['+', '-', '*', '/', '%'].includes(e.key)) appendValue(e.key);
  else if (e.key === '.') appendValue('.');
  else if (e.key === 'Enter') calculate();
  else if (e.key === 'Backspace') deleteLast();
  else if (e.key === 'Escape') clearAll();
});

document.getElementById('themeToggle').addEventListener('change', function () {
  document.documentElement.setAttribute('data-theme', this.checked ? 'dark' : 'light');
});