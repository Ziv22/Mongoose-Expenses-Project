const   api           = require("./server/routes/api"),
        bodyParser    = require("body-parser"),
        mongoose      = require("mongoose"),
        express       = require("express"),
        app           = express(),
        port          = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/', api)

mongoose.connect("mongodb://localhost:27017/expensesDB" , {useNewUrlParser: true})

app.listen(port,()=>{
    console.log(`Server is runnig on port ${port}`)
})