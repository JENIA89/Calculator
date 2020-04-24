const generateId = () => `calc${Math.round(Math.random() * 1e8).toString(16)}`;

const totalBalance = document.querySelector(".total__balance"),
  totalMoneyIncome = document.querySelector(".total__money-income"),
  totalMoneyExpenses = document.querySelector(".total__money-expenses"),
  historylist = document.querySelector(".history__list"),
  form = document.getElementById("form"),
  operationName = document.querySelector(".operation__name"),
  operationAmount = document.querySelector(".operation__amount");

let dbOperation = JSON.parse(localStorage.getItem("calc")) || [];

const renderOperation = (operation) => {
  const className =
    operation.amount < 0 ? "history__item-minus" : "history__item-plus";

  const listItem = document.createElement("li");

  listItem.classList.add("history__item");
  listItem.classList.add(className);
  listItem.innerHTML = `${operation.description} <span class="history__money">${operation.amount}</span>
    <button class="history_delete" data-id='${operation.id}'>x</button>`;

  historylist.append(listItem);
};

const updateBalance = () => {
  const resultIncome = dbOperation
    .filter((item) => item.amount > 0)
    .reduce((result, item) => result + item.amount, 0);

  const resultExpenses = dbOperation
    .filter((item) => item.amount < 0)
    .reduce((result, item) => result + item.amount, 0);

  totalMoneyIncome.textContent = resultIncome + " $";
  totalMoneyExpenses.textContent = resultExpenses + " $";
  totalBalance.textContent = resultIncome + resultExpenses + " $";
};

const addOperation = (event) => {
  event.preventDefault();

  const operationNameValue = operationName.value;
  const operatonAmountValue = operationAmount.value;

  if (operationNameValue !== "" && operatonAmountValue !== "") {
    const operation = {
      id: generateId(),
      description: operationNameValue,
      amount: +operatonAmountValue,
    };

    dbOperation.push(operation);
    init();
  } else {
    if (!operationNameValue) operationName.style.borderColor = "red";
    if (!operatonAmountValue) operationAmount.style.borderColor = "red";
  }
  operationName.value = "";
  operationAmount.value = "";
};

const deleteOperation = (event) => {
  console.log(event);
  const target = event.target;
  if (target.classList.contains("history_delete")) {
    dbOperation = dbOperation.filter(
      (operation) => operation.id !== target.dataset.id
    );

    init();
  }
};

const init = () => {
  historylist.textContent = " ";

  dbOperation.forEach(renderOperation);
  updateBalance();
  localStorage.setItem("calc", JSON.stringify(dbOperation));
};

form.addEventListener("submit", addOperation);

historylist.addEventListener("click", deleteOperation);

init();
