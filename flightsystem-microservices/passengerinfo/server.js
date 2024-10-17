const express = require('express')
const mongoose = require('mongoose')

const app = express();
const PORT = 3001;
 
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/passengerdb',{ useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

const Passenger = mongoose.model('Passenger',{
    p_name:String,
    p_id:Number,
    p_flight:String,
    p_airline:String
});

app.get('/passengers',async (req,res)=>{
    try
    {const passengers = await Passenger.find();
    res.json(passengers);}
    catch(error)
    { res.status(500).json({error:"error getting passengers"});  }
});

app.get('/passengers/:p_id',async (req,res)=>{
    try{
        const passenger =await Passenger.findOne({ p_id: req.params.p_id });
        if(passenger){
            res.json(passenger);
        }
        else{
            res.status(400).json({error:'Passenger not Found'});
        }
    }
    catch(error)
    {res.status(500).json({error:'Error retrieving Passenger By ID'});}
    
});


app.post('/passengers',async(req,res)=>{
    try{const passenger = new Passenger(req.body);
    await passenger.save();
    res.status(201).json(passenger);
    
    try {
        const flightResponse = await axios.post('http://localhost:3002/flights/addpassenger', {
            p_id: passenger.p_id,
            p_flight: passenger.p_flight,
            p_airline: passenger.p_airline
        });

        // Return the response from the external API if needed
        res.status(201).json({ passenger, flightResponse: flightResponse.data });
    } catch (axiosError) {
        console.error('Error calling external API:', axiosError);
        res.status(500).json({ error: 'Passenger created, but failed to notify external API' });
    }


}

    catch(error)
    {
        res.status(500).json({error:'Error creating Passenger '});

    }
});


app.listen(PORT,()=>{
    console.log(`Passenger Service is running at ${PORT}`);
});