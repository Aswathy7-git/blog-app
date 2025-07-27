const Express=require("express")
const Cors=require("cors")
const Mongoose=require("mongoose")
const Bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const userModel =require("./models/users")
const postModel = require("./models/posts")

let app=Express()
app.use(Express.json())
app.use(Cors())

Mongoose.connect("mongodb+srv://aswathy_7:aswathy77@cluster0.ovhej8k.mongodb.net/blogAppDb?retryWrites=true&w=majority&appName=Cluster0")

// create a post

app.post("/create",async(req,res)=>{
    let input=req.body
    let token=req.headers.token
    jwt.verify(token,"blogApp",async(error,decoded)=>{
        if (decoded && decoded.email) {

                let result=new postModel(input)
                await result.save()
                res.json({"status":"success"})
        }else{
            res.json({"status":"Invalid authentication"})
        }
    })

})

//view all post
app.post("/viewall",(req,res)=>{
let token=req.headers.token
jwt.verify(token,"blogApp",(error,decoded)=>{

    if(decoded && decoded.email){
        postModel.find().then(
            (items)=>{
                res.json(items)
            }

        ).catch(
            (error)=>{
                res.json({"status":"error"})
            }
        )

    }else{

        res.json({"status":"Invalid Authentication"})
    }


})

})


//sign in
app.post("/signin",async(req,res)=>{
        let input = req.body
        let result=userModel.find({email:req.body.email}).then(
            (items)=>{
                if (items.length>0){
                    
                    const passwordValidator=Bcrypt.compareSync(req.body.password,items[0].password)
                    if (passwordValidator){

                        jwt.sign({email:req.body.email},"blogApp",{expiresIn:"1d"},
                            (error,token)=>{
                                    if(error){
                                        res.json({"status":"error","errorMessage":error})
                                    }
                                    else{
                                        res.json({"status":"success","token":token,"userId":items[0]._id})
                                    }


                            })

                    } else {
                        res.json({"status":"incorrect password"})
                    }   
                }else{
                    res.json({"status":"Invalid email"})
                }
            }
        ).catch()
})



//sign up
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
