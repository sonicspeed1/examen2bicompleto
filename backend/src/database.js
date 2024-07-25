const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://bryan:1234@cluster0.hitasd0.mongodb.net/fruitguard?retryWrites=true&w=majority')
.then(db=>console.log('Database is Connect'))
.catch(err=>console.log(err))