const express       = require("express")
const router        = express.Router()
const mongoose      = require("mongoose")

const Expense   = require("../../model/Expense")


router.get("/expenses",(req,res)=>{
    Expense.find({}).sort({'date':'desc'}).exec((err,results)=>{
        res.send(results)
    })
})

router.post("/expense", (req,res)=>{
    const newExpense = new Expense(req.body) 
    newExpense.save().then((success,err)=>{
        if(!err){
            res.send({message:"saved", success})
        } else {
            res.send(err)
        }
    })
    
})

router.put("/update", (req,res)=>{
    const group1 = req.body.group1
    const group2 = req.body.group2

    Expense.findOneAndUpdate({"group":group1},{group:group2}).then((success,err)=>{
        if(!err){
            res.send({message:`Expense ${success.name ? success.name : success._id} changed from ${group1} to ${group2}`})
        } else {
            res.send(err)
        }
    })
})

router.get("/expenses/:group",(req,res)=>{
    const group = req.params.group
    const total = req.query.total
    if(!total){
        Expense.find({group}).exec((err,results)=>{
            res.send(results)
        })
    } else {
        Expense.aggregate([
            {$match:{group:group}},
            {
                $group:
                    {_id: "$group",
                totalAmount: {$sum: `$amount`}}
            }
        ]).exec((err,results)=>{
            res.send(results)
        })
    }
})


module.exports = router