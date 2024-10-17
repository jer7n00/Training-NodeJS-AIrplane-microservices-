const express = require('express')
const mongoose = require('mongoose')

const app = express();
const PORT = 3003;
 
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/airlinesdb',{ useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

const Airline = mongoose.model('Airline',{
    a_id:{ type: String, required: true, unique: true },
    a_name:String,
    a_country:String,
    flights: [String]
});


app.get('/airlines',async (req,res)=>{
    try
    {const airlines= await Airline.find();
    res.json(airlines);}
    catch(error)
    { res.status(500).json({error:"error getting airlines"});  }
});

app.get('/airlines/:a_id',async (req,res)=>{
    try{
        const airline =await Airline.findOne({ a_id: req.params.a_id });
        if(airline){
            res.json(airline);
        }
        else{
            res.status(400).json({error:'Airline not Found'});
        }
    }
    catch(error)
    {res.status(500).json({error:'Error retrieving Airline By ID'});}
    
});


app.post('/airlines',async(req,res)=>{
    try{const airline = new Airline(req.body);
    await airline.save();
    res.status(201).json(airline);}

    catch(error)
    {
        res.status(500).json({error:'Error creating Airline '});

    }
});

app.post('/airlines/:a_id/addflight', async (req, res) => {
    const { flight_id } = req.body; // Expecting flight_id in the request body

    try {
        const airline = await Airline.findOne({ a_id: req.params.a_id });
        if (!airline) {
            return res.status(404).json({ error: 'Airline not found' });
        }

        // Update the flights array
        airline.flights.push(flight_id);
        await airline.save();

        res.status(200).json({ message: 'Flight added to Airline DB successfully'});
    } catch (error) {
        res.status(500).json({ error: 'Error adding flight to airline' });
    }
});

app.listen(PORT,()=>{
    console.log(`Airline service is running successfully on ${PORT}`)
});


