const mongoose      = require("mongoose")
const expenses      = require("../expenses.json")

mongoose.connect("mongodb://localhost:27017/expensesDB" , {useNewUrlParser: true})

const Schema = mongoose.Schema
const expenseSchema = new Schema({
    name:   String,
    amount: Number,
    date:   Date,
    group: String
})

const Expense = mongoose.model("Expense",expenseSchema)

// expenses.forEach(e => {
//     let currentExpense = new Expense(e)
//     currentExpense.save()
// })


module.exports = Expense

