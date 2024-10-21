const express= require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
const PORT = 3001;

app.use(express.json());

mongoose.connect('mongodb://mongodb:27017/airlinedb');

const Airline = mongoose.model('airline',{
    aId: String,
    aName: String,
});


app.get('/airlines',async(req,res)=>{
    try{
        const airlines = await Airline.find();
        res.json(airlines);
    }
    catch(err){
        res.status(500).json('Cannot find airline');
    }
});

// app.get('/airline/:id', async(req,res)=>{
//     try{
//         const airline = await Airline.findOne({aId:req.params.id});
//         res.json(airline);
//     }
//     catch(err){
//         res.status(500).json('Cannot find airlines');
//     }
// });

app.get('/airlines/:id', async(req,res)=>{
    try{
        const aId = req.params.id;
        const airline = await Airline.findOne({aId:aId});
        const response = await axios.get(`http://flight:3002/flights/airlines/${aId}`);
        const flights = response.data;
        res.json({airline,flights});
    }
    catch(err){
        res.status(500).json('Cannot find airlines');
    }
});


app.post('/airlines', async(req,res)=>{
    try{
        const airline = new Airline(req.body);
        await airline.save();
    }
    catch(err){
        res.status(500).json('Cannot post airline');
    }
});

app.listen(PORT, ()=>{
    console.log(`Server connected to port ${PORT}`);
});