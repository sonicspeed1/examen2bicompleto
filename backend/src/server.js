const express = require('express');
const cors = require('cors');
const app = express();

require('./database'); 
app.use(cors()); 
app.use(express.json()); 


const userRoutes = require('./rutas/user');
const fruitRoutees= require('./rutas/sensor')


app.use('/users', userRoutes);
app.use('/frutas',fruitRoutees)

app.listen(3000, () => {
    console.log('Server running on port', 3000);
});