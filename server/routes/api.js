const express   = require("express")
const router    = express.Router()
const mongoose  = require("mongoose")

const Expense   = require("../../model/Expense")


router.get("/expenses",(req,res)=>{
    Expense.find({}).exec((err,results)=>{
        res.send(results)
    })

})

module.exports = router