const Express=require("express")
const Cors=require("cors")
const Mongoose=require("mongoose")
const Bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const userModel =require("./models/users")

let app=Express()
app.use(Express.json())
app.use(Cors())

Mongoose.connect("mongodb+srv://aswathy_7:aswathy77@cluster0.ovhej8k.mongodb.net/blogAppDb?retryWrites=true&w=majority&appName=Cluster0")


app.post("/signup",async(req,res)=>{

    let input=req.body
    let hashedPassword=Bcrypt.hashSync(req.body.password,10)
    console.log(hashedPassword)
    req.body.password=hashedPassword

    let check = userModel.find({email:req.body.email}).then(
        (items)=>{


            if (items.length>0) {
            
           res.json({"status":"email id already exist"}) 
        }
        else
            {
                let result=new userModel(input)
                result.save()
                res.json({"status":"success"})
        }

        }
    ).catch()
        
    

})

app.listen(3030,()=>{
    console.log("server started")
})
