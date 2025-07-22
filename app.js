const Express=require("express")
const cors=require("cors")
const Mongoose=require("mongoose")
const Bcrypt=require("bcrypt")
const Jwt=require("jsonwebtoken")

let app=Express()

app.get("/",(req,res)=>{
    res.send("hello")

})

app.listen(3030,()=>{
    console.log("server started")
})
