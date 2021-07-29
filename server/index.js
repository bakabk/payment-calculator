const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');

const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();

const monthSlicesSchema = new Schema({
    id: Number,
    title: String,
    date: Number,
    waterData: Number,
    waterPrice: Number,
    electricityData: Number,
    electricityPrice: Number,
    gasPrice: Number,
    rentPrice: Number,
    serviceRentPrice: Number
}, {versionKey: false});

const monthPayment = mongoose.model('Monthslice', monthSlicesSchema);

app.use(express.static('/'));
app.use(cors({
    origin: 'http://localhost:3000'
}));

mongoose.connect('mongodb://localhost:27017/payment',{
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
    }, (err) => {
        if (err) console.log(err);
        app.listen(3001, () => {
            console.log('Server listen on port 3001...');
        });
});

app.get('/api/data/', (req, res) => {
    monthPayment.find({}, (err, data) => {
        if (err) return console.warn(err);
        setTimeout(() => {
            res.send(data);
            // res.status(500).send('Something broke!');
        }, 2000);
    })
});

app.post('/api/add/', jsonParser, (req, res) => {
    if (!req.body) return res.sendStatus(400);

    const data = new monthPayment({...req.body});

    data.save((err) => {
        if (err) return console.log(err);
        res.send(data);
    })
});