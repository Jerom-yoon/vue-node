const express = require('express')
const app = express()
const port = 3000
const bodyparser = require('body-parser')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
app.use(cookieParser());
app.use(bodyparser.json());

const members = [
    {
        id:3,
        name:"library",
        loginId:"lbi",
        loginPw:'africa'
    },
    {
        id:4,
        name:"library1",
        loginId:"lbi1",
        loginPw:'africa1'
    }
]
const memos = ['memo1','memo2','memo3','memo4','memo5'];
app.use(bodyparser.json())
app.get('/api/memos',(req,res)=>{
    res.send(memos);
})
app.post('/api/memos',(req,res)=>{
    memos.push(req.body.content);
    res.send(memos);
})
app.get('/api/account', (req,res)=>{

    if(req.cookies && req.cookies.token){
        jwt.verify(req.cookies.token,"abc1234567", (err,decoded)=>{
            if(err){
                console.log(decoded);
                return res.send(401);  
            }  
            console.log(err);
            res.send(decoded);
        });

        // const memb = JSON.parse(req.cookies.account);

        // if(memb.id){
        //     return res.send(memb);
        // }
    }
    else res.send(401);
})
app.post('/api/account', (req,res)=>{
    const loginId = req.body.loginId;
    const loginPw = req.body.loginPw;

    const memb =  members.find( m=>m.loginId == loginId && m.loginPw==loginPw);

    if(memb){
        const options = {
            domain:"localhost",
            path:"/",
            httpOnly:true
        }
        console.log(loginId, loginPw);
        const token = jwt.sign(
            {id:memb.id,
            name:memb.name}
            ,
            "abc1234567",
            {expiresIn:"15m",
            issuer:"library"}
            );
        res.cookie("token",token, JSON.stringify(memb));
        res.send(memb);
    }
    else{
        res.send(404);
    }
})

app.listen(port,()=>{
    console.log(`Example app listening`);
})