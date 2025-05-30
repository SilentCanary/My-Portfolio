const express=require('express');
const body_parser=require('body-parser');
const cors=require('cors');
const mongoose=require('mongoose');
require('dotenv').config();
const app=express();
app.use(cors());
app.use(body_parser.json());

app.use(express.static(path.join(__dirname, '..', 'public')));

const MONGOOSE_URI=process.env.MONGO_URI;

const PORT=3000;

mongoose.connect(MONGOOSE_URI,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{console.log('connected to mongo db');})
.catch((err)=>{console.error(err);});

const message_schema= new mongoose.Schema(
    {
        name:String,
        email:String,
        message:String,
        time:{type:Date,default:Date.now}
    });
const Message=mongoose.model('Message',message_schema);
app.post('/submit',async(req,res)=>{
    const{name,email,message}=req.body;
    try{
        const new_message=new Message({name,email,message});
        await new_message.save();
        res.status(200).json({message:'message saved successfully'});
    }
    catch(err)
    {
        res.status(500).json({error:'failed to save message'});
    }
});

app.get('/get_messages',async(req,res)=>{
    const notes=await Message.find().sort({time:-1});
    res.json(notes);
});

app.listen(PORT,()=>{console.log(`Server listening on http://localhost:${PORT}`);});

