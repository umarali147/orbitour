const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// dotenv configuration
dotenv.config();
app.get('/',(req,res)=>{
res.send('testin')
})

// Database connection
mongoose.connect(process.env.DB_CONNECT,function(){
    console.log('connected')
})

// Import Routes
const authRoute = require('./routes/auth');

// middlewares 
app.use(express.json())

// Routes middlewares
app.use('/api/user', authRoute);

app.listen(8080,()=>{
    console.log('server up');
})