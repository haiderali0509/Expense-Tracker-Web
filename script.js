const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
const formatter = new Intl.NumberFormat("ur-PK", {
  style: "currency",
  currency: "PKR",
  signDisplay: "always",
});
const balanceFormatter = new Intl.NumberFormat("ur-PK", {
  style: "currency",
  currency: "PKR",
  signDisplay: "never", // Change signDisplay to "never"
});
const list = document.getElementById("transactionList");
const status = document.getElementById("status");
const form = document.getElementById("transactionForm");
form.addEventListener("submit", addTransaction);
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const balance = document.getElementById("balance");

// Update Total
function updateTotal() {
  const incomeTotal = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);
  const expenseTotal = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);
  const balanceTotal = incomeTotal - expenseTotal;
  income.textContent = formatter.format(incomeTotal);
  expense.textContent = formatter.format(expenseTotal * -1);
  balance.textContent = balanceFormatter.format(balanceTotal);
}

// Show List
function renderList() {
  list.innerHTML = "";
  if (transactions.length === 0) {
    status.textContent = "No Transactions";
    return;
  }
  status.textContent = "";
  transactions.forEach(({ name, amount, date, type }) => {
    const sign = type === "income" ? 1 : -1;
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="name">
        <h4>${name}</h4>
        <p>${new Date(date).toLocaleDateString()}</p>
      </div>
      <div class="amount ${type}">
        <span>${formatter.format(amount * sign)}</span>
      </div>
    `;
    list.appendChild(li);
  });
}

// Add Transaction
function addTransaction(e) {
  e.preventDefault();
  const formData = new FormData(this);
  transactions.push({
    id: transactions.length + 1,
    name: formData.get("name"),
    amount: parseFloat(formData.get("amount")),
    date: new Date(formData.get("date")),
    type: "on" === formData.get("type") ? "income" : "expense",
  });
  this.reset();
  saveTransactions();
  updateTotal();
  renderList();
}

function saveTransactions() {
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

renderList();
updateTotal();