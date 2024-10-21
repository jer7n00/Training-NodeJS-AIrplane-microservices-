const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
const PORT=3002;

app.use(express.json());

mongoose.connect('mongodb://mongodb:27017/flightdb');

const Flight = mongoose.model('flight',{
    fId: String,
    fName: String,
    aId: String
});


app.get('/flights', async(req,res)=>{
    try{
        const flights = await Flight.find();
        res.json(flights);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});

app.get('/flights/:id', async(req,res)=>{
    try{

        const flight = await Flight.findOne({ fId: req.params.id } );
        res.json(flight);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});


app.post('/flights', async(req,res)=>{
    try{
        const flight = new Flight(req.body);
        await flight.save();
        res.status(201).json(flight);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});

app.get('/flights/passengers/:id', async(req,res)=>{
    try{
        const fId = req.params.id;
        const passengers = await axios.get(`http://passenger:3003/passengers/flights/${fId}`);
        res.json(passengers.data);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
});

app.get('/flights/airlines/:id', async(req,res)=>{
    try{
        const aId = req.params.id;
        const flights = await Flight.find({aId:aId});
        res.json(flights);
    }
    catch(err){
        res.status(500),json('Cannot find');
    }
});

app.listen(PORT, ()=>{
    console.log(`Server connected to port ${PORT}`);
});;