const express = require('express')
const connectDB = require('./config/db') 

require("dotenv").config({ path: "./.env" }); // Used for setting environment variables

const app = express()
app.use(express.json()); // Used for Raw JSON Format
// app.use(express.urlencoded({ extended: false })); // Used for x-www-form-urlencoded

require("./app/user/routesDefinations/user.routeDefs")(app); //IIFE

app.listen(process.env.PORT, () => {
  console.log(`ServerUp on port: ${process.env.PORT}`)
  connectDB();
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/fawad',(req,res) => {
    console.log(req.body)
    res.send('Hello Fawad')
})