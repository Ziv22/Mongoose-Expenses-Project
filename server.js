const express       = require("express")
const api           = require("./server/routes/api")
const bodyParser    = require("body-parser")
const app           = express()
const port          = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/', api)


app.listen(port,()=>{
    console.log(`Server is runnig on port ${port}`)
})