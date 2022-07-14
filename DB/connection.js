const mongoose = require('mongoose');

const connectDB = () => {
    return mongoose.connect(process.env.DBURI)
        .then(res => console.log(`connected DB on URI ....${process.env.DBURI}`))
        .catch(err => console.log('fail to connect'));
};

module.exports = connectDB;





