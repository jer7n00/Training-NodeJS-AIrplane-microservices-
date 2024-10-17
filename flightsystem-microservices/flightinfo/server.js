const express = require('express');
const mysql = require('mysql2')
const axios = require('axios')

const app =express();
const PORT = 3002;

app.use(express.json());

function connectWithRetry(){
    const connection = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'pass@word1',
        database:'flightsdb',
        port:3306
    });

    connection.connect((err)=>{
        if(err){
            console.error('Failed to connect with MySql...Retrying in 5 seconds',err);
            setTimeout(connectiWthRetry,5000);}
            else{
                console.log('Connected to MySQL successfully!');
                setupRoutes(connection);
            }
            });

            connection.on('error', (err) => {
                console.error('MySQL connection error:', err);
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                  connectWithRetry();
                } else {
                  throw err;
                }
              });
            }

            async function setupRoutes(db) {
                app.get('/flights', (req, res) => {
                  db.query('SELECT * FROM flights', (err, results) => {
                    if (err) {
                      res.status(500).json({ error: 'Error fetching Flight data' });
                    } else {
                      res.json(results);
                    }
                  });
                });



                //Add one flight
                 app.post('/flights', async (req, res) => {
                    const { flight_id, flight_name, airline_id ,capacity} = req.body;
            
                   

                 try {
                    const response = await axios.post(`http://localhost:3003/airlines/${airline_id}/addflight`, {
                        flight_id
                    });

                // res.status(201).json({
                //     message: 'Flight added successfully',
                //     flight_id,
                //     externalResponse: response.data
                // });
                const sql = 'INSERT INTO flights (flight_id, flight_name, airline_id,capacity) VALUES (?, ?, ?,?)';
                db.query(sql, [flight_id, flight_name, airline_id,capacity], (err, results) => {
                    if (err) {
                        console.error('Error inserting flight:', err);
                        return res.status(500).json({ error: 'Error adding flight' });
                    }
                    res.status(201).json({ message: 'Flight added successfully', flight_id });
                });
            } catch (error) {
                console.error('Error calling external API:', error);
                return res.status(500).json({ error: 'Flight added, but failed to call external API' });
            }

          
        });


         // POST route to add passenger to a flight
    app.post('/flights/addpassenger', async (req, res) => {
        const { flight_id, passenger_id } = req.body;

        const sql = 'UPDATE flights SET passengers = JSON_ARRAY_APPEND(passengers, "$", ?) WHERE flight_id = ?';
        db.query(sql, [passenger_id, flight_id], (err, results) => {
            if (err) {
                console.error('Error updating flight passengers:', err);
                return res.status(500).json({ error: 'Error adding passenger to flight' });
            }

            res.status(200).json({ message: 'Passenger added to flight successfully', flight_id });
        });
    });

               


                app.listen(PORT, () => {
                    console.log(`Sales service running on port ${PORT}`);
                  });
                }
               
                
                connectWithRetry();