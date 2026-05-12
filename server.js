const app= require("./src/app")
const connectodb =require ("./src/db/db")    ##connecting with database

connectodb()
#3000 is port number
app.listen(3000,()=>
{

    console.log("SERVER IS LISTENING ON PORT 3000")
})
