const   mongoose  = require("mongoose"),
        expenses  = require("../expenses.json"),
        moment    = require("moment") 
        
const Schema = mongoose.Schema
const expenseSchema = new Schema({
    name:   String,
    amount: Number,
    date:   Date,
    group:  String
})

const Expense = mongoose.model("Expense",expenseSchema)

module.exports = Expense

expenses.forEach(e => {
    let currentExpense = new Expense({...e, name: e.item, date: moment(e.date).format("LLLL")})
    currentExpense.save()
})
