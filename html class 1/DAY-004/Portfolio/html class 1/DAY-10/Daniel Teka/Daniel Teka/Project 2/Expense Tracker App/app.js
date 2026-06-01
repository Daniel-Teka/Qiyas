// DOM Element Targets
const balanceEl = document.getElementById('total-balance');
const incomeEl = document.getElementById('summary-income');
const expenseEl = document.getElementById('summary-expense');
const formEl = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const historyFeed = document.getElementById('history-feed');

const toggleIncomeBtn = document.getElementById('type-income');
const toggleExpenseBtn = document.getElementById('type-expense');

// State tracking variables
let selectedType = 'income'; 
let transactions = JSON.parse(localStorage.getItem('ledger_transactions')) || [];

// Custom Segment Toggle Selector Interactions
toggleIncomeBtn.addEventListener('click', () => {
    selectedType = 'income';
    toggleIncomeBtn.classList.add('active');
    toggleExpenseBtn.classList.remove('active');
});

toggleExpenseBtn.addEventListener('click', () => {
    selectedType = 'expense';
    toggleExpenseBtn.classList.add('active');
    toggleIncomeBtn.classList.remove('active');
});

// Format Numbers beautifully to safe money display notation
function formatCurrencyString(value, forcePrefix = false, prefixType = 'income') {
    const absoluteVal = Math.abs(value).toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    });
    
    if (forcePrefix) {
        return (prefixType === 'income' ? '+' : '-') + '$' + absoluteVal;
    }
    
    return (value < 0 ? '-' : '') + '$' + absoluteVal;
}

// Compute balance card states reactively
function updateBalances() {
    let totalBalance = 0;
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(tx => {
        if (tx.type === 'income') {
            totalIncome += tx.amount;
            totalBalance += tx.amount;
        } else {
            totalExpense += tx.amount;
            totalBalance -= tx.amount;
        }
    });

    balanceEl.textContent = formatCurrencyString(totalBalance, false);
    incomeEl.textContent = formatCurrencyString(totalIncome, true, 'income');
    expenseEl.textContent = formatCurrencyString(totalExpense, true, 'expense');
}

/*

This code snippet is a loop-based accumulator that processes an array of transaction objects to calculate three specific financial metrics: total income, total expenses, and the final net balance.

Logic Breakdown
1. Iteration (transactions.forEach)

The code uses the .forEach() method to traverse every element (tx) in the transactions array exactly once. This is an $O(n)$ complexity operation, where $n$ is the number of transactions.

2. Conditional Branching (if...else)

The logic splits the processing based on the type property of the current transaction:

- Scenario A: Income (tx.type === 'income')

- totalIncome += tx.amount: Increases the running sum of all incoming money.
- totalBalance += tx.amount: Increases the overall liquid capital.
- Result: The money is treated as a positive inflow.

- Scenario B: Expense (The else block)

- totalExpense += tx.amount: Increases the running sum of all spent money.
- totalBalance -= tx.amount: Decreases the overall liquid capital.
- Result: The money is treated as a negative outflow.

Mathematical Summary

At the end of the loop, the variables represent these formulas:

- Total Income = $\sum \text{amounts where type is 'income'}$
- Total Expense = $\sum \text{amounts where type is NOT 'income'}$
- Total Balance = $\text{Total Income} - \text{Total Expense}$

Key Technical Observations

- Implicit Categorization: The else block acts as a "catch-all." It assumes that if a transaction isn't 'income', it must be an expense. This is efficient but --risky-- if the data contains unexpected types (e.g., 'transfer' or typos).
- State Mutation: The code relies on external variables (totalIncome, totalExpense, totalBalance) defined outside the loop. These variables are mutated (changed) during each iteration.
- Purpose: This is a standard pattern for generating a Financial Summary or a Dashboard Snapshot from a raw list of ledger entries.

*/
//----------------------------------
// Render ledger items dynamically
function renderLedger() {
    historyFeed.innerHTML = '';

    if (transactions.length === 0) {
        historyFeed.innerHTML = '<div class="empty-ledger">No recorded ledger statements yet.</div>';
        return;
    }

    transactions.forEach(tx => {
        const row = document.createElement('div');
        row.className = `history-item ${tx.type === 'income' ? 'inc-type' : 'exp-type'}`;

        row.innerHTML = `
            <span class="tx-title">${tx.description}</span>
            <span class="tx-val">${formatCurrencyString(tx.amount, true, tx.type)}</span>
        `;
        historyFeed.appendChild(row);
    });

    // Auto scroll down to focus on latest updates
    historyFeed.scrollTop = historyFeed.scrollHeight;
}

// Sync values to localStorage seamlessly
function syncStorage() {
    localStorage.setItem('ledger_transactions', JSON.stringify(transactions));
    updateBalances();
    renderLedger();
}

// Form Submission Event Block
formEl.addEventListener('submit', (e) => {
    e.preventDefault();

    const text = descriptionInput.value.trim();
    const value = parseFloat(amountInput.value);

    if (!text || isNaN(value) || value <= 0) return;

    const newTx = {
        id: Date.now().toString(),
        description: text,
        amount: value,
        type: selectedType
    };

    transactions.push(newTx);
    syncStorage();

    // Reset input fields securely
    descriptionInput.value = '';
    amountInput.value = '';
    
    // Set baseline state variables back nicely
    selectedType = 'income';
    toggleIncomeBtn.classList.add('active');
    toggleExpenseBtn.classList.remove('active');
});

// App Bootstrap execution entry points
updateBalances();
renderLedger();
