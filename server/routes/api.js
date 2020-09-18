const express       = require("express")
const router        = express.Router()
const mongoose      = require("mongoose")
const moment        = require('moment');

const Expense   = require("../../model/Expense")

const formatDate = date =>{
    return moment(date).format("LLLL")
}

router.get("/expenses",(req,res)=>{
    let q = {}
    const   group = req.query.group,
            total = req.query.total,
            d1    = req.query.d1,
            d2    = req.query.d2

    if(group){
        if(total) {
            Expense.aggregate([
                {$match:{group}},
                {
                    $group:
                        {_id: "$group",
                    totalAmount: {$sum: `$amount`}}
                }
            ]).exec((err,results)=>{
                res.send(results)
            })
        } else {
            Expense.find({group}).exec((err,results)=>{
                res.send(results)
            })
        }
    } else if(d1 || d2){
        if(d1 && d2){
            Expense.find({$and:[
                {date : {$gt:d1}},
                {date : {$lt:d2}}
            ]})
            .sort({'date':'desc'})
            .exec((err,results)=>{
                res.send(results)
            })
        } else{
            Expense.find({$and:[
                    {date:{$gt:d1 || d2}},
                    {date:{$lt:Date.now()}}
            ]})
            .sort({'date':'desc'})
            .exec((err,results)=>{
                res.send(results)
            })
        }

    }else{
        Expense.find({}).sort({'date':'desc'}).exec((err,results)=>{
            res.send(results)
        })
    }
})

router.post("/expense", (req,res)=>{
    let expenseData = {...req.body}
    expenseData.date =  this ? moment(expenseData.date).format("LLLL") : moment().format('LLLL')
    const newExpense = new Expense(expenseData) 
    newExpense.save().then((expense,err)=>{
        if(!err){
            console.log(`You payed ${expense.amount} for a ${expense.name}`)
            res.send(expense)

        } else {
            res.send(err)
        }
    })
})

router.put("/expense/:id/:group", (req,res)=>{
    const id = req.params.id
    const group = req.params.group

    Expense.findByIdAndUpdate(id,{group}).then((success,err)=>{
        if(!err){
            res.send({message:`Expense ${success.nam} changed from ${success.group} to ${group}`})
        } else {
            res.send(err)
        }
    })
})



module.exports = router