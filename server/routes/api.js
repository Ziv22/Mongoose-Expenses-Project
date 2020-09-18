const express       = require("express")
const router        = express.Router()
const mongoose      = require("mongoose")
const moment        = require('moment');

const Expense   = require("../../model/Expense")

router.get("/expenses",(req,res)=>{
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
            Expense.find().and([{date:{$gte:d1}},{date:{$lte:d2}}]).exec((err,results)=>{
            // Expense.find({date:{$lt:d1}}).exec((err,results)=>{
                console.log(`here 34`)
                // res.send({date:moment(results.date).format("YYYY-MM-DD"),...results})
                res.send(results)
            })
        } else{
            Expense.find().and([{$or:[{date:{$gt:d1}},{date:{$gt:d2}}]},{date:{$lt:Date.now()}}]).exec((err,results)=>{
                res.send(results)
                // res.send({...results,date:moment(results.date).format("YYYY-MM-DD")})
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
    expenseData.date =  this ?  moment(expenseData.date).format("LLLL") : moment().format('LLLL')

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