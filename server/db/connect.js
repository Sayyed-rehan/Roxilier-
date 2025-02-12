const mongoose = require('mongoose')


// mongoose.set('strictQuery', false);

mongoose.connect('mongodb://localhost:27017/Rolexier')
.then((res)=>console.log('mongodb connected'))
.catch((err)=>console.log(err))