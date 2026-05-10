const app= require("./src/app")
const connectodb =require ("./src/db/db")

connectodb()

app.listen(3000,()=>
{

    console.log("SERVER IS LISTENING ON PORT 3000")
})