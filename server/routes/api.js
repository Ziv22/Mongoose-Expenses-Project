const   Expense       = require("../../model/Expense"),
        express       = require("express"),
        moment        = require('moment'),
        router        = express.Router()

router.get("/expenses",async (req,res)=>{
    const   group = req.query.group,
            total = req.query.total,
            d1    = req.query.d1,
            d2    = req.query.d2

    let     goesOn = true,
            query = {}

    query["$and"] = []

    if(group && total){        
        try{
            const expenses = await Expense.aggregate([
                {$match:{group}},
                {
                    $group:
                        {_id: "$group",
                    totalAmount: {$sum: `$amount`}}
                }
            ])

            goesOn = false
            res.send(expenses)
            res.end()
        }
        catch(err){
            res.send(err)
            res.end()
        }
    }

    if(group){
        query["$and"].push({group})
    }

    if(d1 || d2){
        if(d1 && d2){
            query["$and"].push(
                {date : {$gt:d1}},
                {date : {$lt:d2}})
        } else {
            query["$and"].push(
                {date:{$gt:d1 || d2}},
                {date:{$lt:Date.now()}})
        }
    }

    if(goesOn){
        try{
            const expenses = await Expense.find(query).sort({'date':'desc'})
            res.send(expenses)
            res.end()
        }
        catch(err){
            res.send(err)
            res.end()
        }
    }
})

router.post("/expense", (req,res)=>{
    let expenseData     = {...req.body}
    expenseData.date    =  expenseData.date ? moment(expenseData.date).format("LLLL") : moment().format('LLLL')
    const newExpense    = new Expense(expenseData) 
    newExpense.save()
        .then( expense =>{
            console.log(`You payed ${expense.amount} for a ${expense.name}`)
            res.send(expense)
            res.end()
        })
        .catch(err =>{
            res.send(err)
            res.end()
        })
})

router.put("/expense/:id/:group", (req,res)=>{
    const   id    = req.params.id,
            group = req.params.group

    Expense.findByIdAndUpdate(id,{group})
        .then(expense =>{
            console.log({message:`Expense ${expense.name} changed from ${expense.group} to ${group}`})
            res.send(expense)
            res.end()
        }) 
        .catch(err =>{
            res.send(err)
            res.end()
        })
})

module.exports = router