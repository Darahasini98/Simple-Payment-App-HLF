var express = require("express");
var bodyParser = require("body-parser");
var app = express();
const Joi = require('joi');
const InitLedger = require('./InitLedger');
const GetAllAccounts = require('./GetAllAccounts');
const GetAccountStatement = require('./GetAccountStatement');
const RegisterUserAccount = require('./RegisterUserAccount');
const Balance = require('./Balance');
const Transfer = require('./Transfer');
const fabricNetwork = require("./fabricNetwork");

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


app.get('/api/InitLedger/:user', async (req,res)=>{

    const schema = Joi.object({
       // userPwd: Joi.string().min(3).required(),
    });
    
    const result = schema.validate(req.body);
    
    console.log(result);
    
    if (result.error) {
        return res.status(400).send(result.error);
    }

    if(!req.params.user ){
        return res.status(400).send("Input validation error w.r.t user");
    }

    let response = await InitLedger(req.params.user);
    if(response && response.success){

        console.log(`Invoke was Success: ${response.message}`);

        res.status(201).json(response);
    }else{
        console.log(`Invoke was Failure: ${response.message}`);
        res.status(401).json(response);
    }
});
app.post('/api/RegisterUserAccount/:user/:accId/:name/:bank/:accBal/:isKYCdone', async (req,res)=>{

    const schema = Joi.object({
       // userPwd: Joi.string().min(3).required(),
    });
    
    const result = schema.validate(req.body);
    
    if (result.error) {
        return res.status(400).send(result.error);
    }

    if(!req.params.user ){
        return res.status(400).send("Input validation error w.r.t user");
    }

    let response = await RegisterUserAccount(req.params.user,req.params.accId,req.params.name,req.params.bank,req.params.accBal,req.params.isKYCdone);
    if(response && response.success){

        console.log(`Enroll was Success: ${response.message}`);

        res.status(201).json(response);
    }else{
        console.log(`Enroll was Failure: ${response.message}`);
        res.status(401).json(response);
    }
});

app.get('/api/GetAllAccounts/:user', async (req,res)=>{

    const schema = Joi.object({
       // userPwd: Joi.string().min(3).required(),
    });
    const result = schema.validate(req.body); 
    console.log(result);
    
    if (result.error) {
        return res.status(400).send(result.error);
        
    }
    if(!req.params.user ){
        return res.status(400).send("Input validation error w.r.t user");
    }

    let response = await GetAllAccounts(req.params.user);
    if(response && response.success){

        console.log(`Enroll was Success: ${response.message}`);

        res.status(201).json(response);
    }else{
        console.log(`Enroll was Failure: ${response.message}`);
        res.status(401).json(response);
    }
});

app.get('/api/GetAccountStatement/:user/:accId', async (req,res)=>{

    const schema = Joi.object({
       // userPwd: Joi.string().min(3).required(),
    });
    const result = schema.validate(req.body); 
    console.log(result);
    
    if (result.error) {
        return res.status(400).send(result.error);
    }
    if(!req.params.user ){
        return res.status(400).send("Input validation error w.r.t user");
    }

    let response = await GetAccountStatement(req.params.user);
    if(response && response.success){

        console.log(`Enroll was Success: ${response.message}`);

        res.status(201).json(response);
    }else{
        console.log(`Enroll was Failure: ${response.message}`);
        res.status(401).json(response);
    }
});


app.post('/api/Transfer/:user/:benId/:remId/:amt', async (req,res)=>{

    const schema = Joi.object({
       // userPwd: Joi.string().min(3).required(),
    });
    const result = schema.validate(req.body);
    console.log(result);
    
    if (result.error) {
        return res.status(400).send(result.error);
    }
    if(!req.params.user ){
        return res.status(400).send("Input validation error w.r.t user");
    }

    let response = await Transfer(req.params.user,req.params.benId,req.params.remId,req.params.amt);
    if(response && response.success){

        console.log(`Enroll was Success: ${response.message}`);

        res.status(201).json(response);
    }else{
        console.log(`Enroll was Failure: ${response.message}`);
        res.status(401).json(response);
    }
});

app.get('/api/Balance/:user/:args', async (req,res)=>{

    const schema = Joi.object({
       // userPwd: Joi.string().min(3).required(),
    }); 
    const result = schema.validate(req.body);
    console.log(result);
    
    if (result.error) {
        return res.status(400).send(result.error);
    }
    if(!req.params.user ){
        return res.status(400).send("Input validation error w.r.t user");
    }

    let response = await Balance(req.params.user,req.params.args);
    if(response && response.success){

        console.log(`Enroll was Success: ${response.message}`);

        res.status(201).json(response);
    }else{
        console.log(`Enroll was Failure: ${response.message}`);
        res.status(401).json(response);
    }
});


app.listen(3000, () => {
  console.log("***********************************");
  console.log("API server listening at localhost:3000");
  console.log("***********************************");
});
