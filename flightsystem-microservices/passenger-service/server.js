const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3003;


app.use(express.json());

mongoose.connect('mongodb://mongodb:27017/passengerdb');

const Passenger = mongoose.model('Passenger',{
    pId: String,
    pName: String,
    pAge: Number,
    fId: String
});

app.get('/passengers', async(req,res)=>{
    try{
        const passengers = await Passenger.find();
        res.json(passengers);
    }
    catch(err){
        res.status(500).json({ error: 'Error fetching products' });
    }
});


app.get('/passengers/:id', async (req, res) => {
    try {
      const passenger = await Passenger.findOne({pId:req.params.id});
      if (passenger) {
        res.json(passenger);
      } else {
        res.status(404).json({ error: 'Passenger not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching passenger' });
    }
  });

app.get('/passengers/flights/:id', async(req,res)=>{

    try{
        //const fId = req.params.id;
        const passengers = await Passenger.find({fId: req.params.id});
        res.json(passengers);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching passengers' });
      }
});

app.post('/passengers', async (req, res) => {
    try {
      const passenger = new Passenger(req.body);
      await passenger.save();
      res.status(201).json(passenger);
    } catch (error) {
      res.status(500).json({ error: 'Error creating passenger' });
    }
  });

app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`);
})