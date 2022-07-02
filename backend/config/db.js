const mongoose = require('mongoose');

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGOURI,{
            useNewUrlParser: true
            
        })

        console.log(`Mongoose Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error : ${error.message}`);
    }
}

module.exports=connectDB