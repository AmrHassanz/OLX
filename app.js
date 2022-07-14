require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./DB/connection');
const app = express();
const port = process.env.PORT;
const indexRouter = require('./modules/index.router');
const path = require('path');
const userModel = require('./DB/model/user');
const { initIo } = require('./services/socket');

// cron 1
const productModel = require('./DB/model/product');
const { createInvoice, today } = require('./services/createInvoice');
const moment = require('moment')

app.use(cors());
app.use(express.json());
app.use('/api/v1/auth', indexRouter.authRouter);
app.use('/api/v1/user', indexRouter.userRouter);
app.use('/api/v1/product', indexRouter.productRouter);
app.use('/api/v1/admin', indexRouter.adminRouter);
app.use('/api/v1/comment', indexRouter.commentRouter);
app.use('/api/v1/uploads', express.static(path.join(__dirname, './uploads')));


app.get('/mido', async (req, res) => {
    // const users = await userModel.findOne({phone:'01027179463' });
    const products = await productModel.find({}).populate([
        { path: 'comments' }
    ])
    res.json({ message: 'done', products })
})

const schedule = require('node-schedule');
const sendEmail = require('./services/email');

const job = schedule.scheduleJob('59 59 23 * * *', async function () {

    const products = await productModel.find({
        createdAt: { $gte: moment().startOf('day'), $lte: moment().endOf('day') }
    });

    // // invoice
    const invoiceData = {
        shipping: {
            name: "Amr Hassan",
            address: "New Damietta",
            city: "Damietta",
            state: "Damietta",
            country: "Egypt",
            postal_code: 11055
        },
        items: products,
        subtotal: 8000,
        paid: 0,
        invoice_nr: 1234
    };
    createInvoice(invoiceData, path.join(__dirname, './uploads/PDF/products.pdf'));

    let message = `Products of the day      ${today}`;
    sendEmail('3amr.7assan1993@gmail.com', message, [
        {
            path: path.join(__dirname, './uploads/PDF/products.pdf'),
            filename: 'products.pdf'
        },
    ])
});

connectDB();

const server = app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
const io = initIo(server);

io.on('connection', (socket) => {
    console.log(socket.id);
    socket.on('updateSocketID', async (data) => {
        await userModel.findByIdAndUpdate(data, { socketID: socket.id })
    })
})