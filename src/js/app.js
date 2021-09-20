const Modal = {
  open() {
    this.registerEventCloseOnFocusOut()
    const modalOverlay = document.querySelector(".modal-overlay");
    modalOverlay.classList.toggle("active")
  },
  close() {
    const modalOverlay = document.querySelector(".modal-overlay");
    modalOverlay.classList.toggle("active")
  },
  registerEventCloseOnFocusOut() {
    const modalOverlay = document.querySelector(".modal-overlay")
    modalOverlay.addEventListener("mouseup", (event) => {
      const modal = document.querySelector(".modal")

      if (!modal.contains(event.target)) {
        this.close()
      }
    })

  }
}

const DOM = {
  transactionsContainer: document.querySelector("#data-table tbody"),
  addTransaction(transaction, index) {
    const tr = document.createElement('tr');
    tr.innerHTML = DOM.innerHTMLTransaction(transaction)
    tr.dataset.index = index
    
    DOM.transactionsContainer.appendChild(tr);
  },
  innerHTMLTransaction(transaction, index) {
    const cssClass = +transaction.amount > 0 ? 'income' : 'expanse'  
    
    const amount = Utils.formatCurrency(transaction.amount);

    const html = `
      <td class="description">${transaction.description}</td>
      <td class="${cssClass}"> ${amount}</td>
      <td class="date">${transaction.date}</td>
      <td>
        <img onclick="Transaction.remove(${index})" src="img/minus.svg" alt="Remover transação">
      </td>
    `
    return html
  },
  updateBalance(){
    document.querySelector("#incomeDisplay")
    .innerHTML = Utils.formatCurrency(Transaction.incomes())

    document.querySelector("#expenseDisplay")
    .innerHTML = Utils.formatCurrency(Transaction.expanses())

    document.querySelector("#totalDisplay")
    .innerHTML = Utils.formatCurrency(Transaction.total())
  },
  clearTransactions(){
    DOM.transactionsContainer.innerHTML = ""
  }
}

const Utils = {
  formatCurrency(value){
    const formattedCurrency = new Intl.NumberFormat('pt-br', 
    {
      style: 'currency',
      currency: 'BRL'
    }
    ).format(value)
    return formattedCurrency
  },
  formatDate(date){
    const formattedDate = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'UTC'
    }).format(date) 
    return formattedDate
  },
  formatAmount(value){
    return Number(value)
  }
}

const Storage = {
  get(){
    return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
  },
  set(transactions) {
    localStorage.setItem("dev.finances:transactions",
      JSON.stringify(transactions)
    )
  }
}

const Transaction = {
  all: Storage.get(),
  add(transaction){
    Transaction.all.push(transaction)
    
    App.reload()
  },
  remove(index){
    Transaction.all.splice(index, 1)
    App.reload()
  },
  incomes() {
    let income = 0

    Transaction.all.forEach(transaction => {
      if (transaction.amount > 0) {
        income += transaction.amount
      }
    })

    return income
  },
  expanses() {
    let expanse = 0

    Transaction.all.forEach(transaction => {
      if (transaction.amount < 0) {
        expanse += transaction.amount
      }
    })

    return expanse
  },
  total() {
    let total = Transaction.incomes() + Transaction.expanses()
    return total
  }
}

const Form = {
  description: document.querySelector("#description"),
  amount: document.querySelector("#amount"),
  date: document.querySelector("#date"),

  getValues(){
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    }
  },

  validadeFields(){
    const {description, amount, date} = Form.getValues()

    if(description.trim() === "" || amount.trim() === "" || date.trim() === ""){
      throw new Error("Por favor preencha todos os campos")
    }
  },
  formatData(){
    let {description, amount, date} = Form.getValues()
    amount = Utils.formatAmount(amount)
    date = Utils.formatDate(new Date(date))

    return {
      description,
      amount,
      date
    }
  },
  saveTransaction(transaction){
    Transaction.add(transaction)
  },
  clearFields(){
    Form.description.value =  ""
    Form.amount.value =  ""
    Form.date.value =  ""
  },
  submit(event){
    event.preventDefault()

    try{
      Form.validadeFields()
      Form.formatData()
      const transaction = Form.formatData()
      Form.saveTransaction(transaction)
      Form.clearFields()
      Modal.close()

    }catch(error){
      const validateElement = document.querySelector(".validade-messages")
      validateElement.innerHTML = error.message
      validateElement.classList.toggle("active")
    }

  }
}

const App = {
  init(){
    Transaction.all.forEach(DOM.addTransaction)
    DOM.updateBalance()

    Storage.set(Transaction.all)
  },
  reload(){
    DOM.clearTransactions()
    App.init()
  }
}



App.init();