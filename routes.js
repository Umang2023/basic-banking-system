// require('Mate')
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

const { mongourl } = require('./config/keys')
const Transactions = require('./models/Transaction')
// const Wish = require('./models/wish')
const Customers = require('./models/Customer')
// mongoose.connect(mongourl);
mongoose.connect(mongourl, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = (app) => {
    //get routes
    app.get('/landing', (req, res) => {
        res.sendFile(__dirname + '/public/index.html');
    })
    app.get('/home', (req, res) => {

        res.render('home')

    })

    app.get('/customers', (req, res) => {
        Customers.find({}).then(data => {

            res.render('customers', { customers: data });
        })

    })
    app.get('/transactions', (req, res) => {
        Transactions.find({}).then(data => {
            res.render('transactions', { transactions: data });
        })
    })
    app.get('/transfer', (req, res) => {

        res.render('transfer');
    })

    app.post('/transferred', (req, res) => {
        let data = req.body;
        console.log(data);
        let acc1 = Number(data.Acc1);

        let acc2 = Number(data.Acc2);
        let amount = Number(data.amount);

        Customers.findOne({ accNumber: acc1 })
            .then((sender) => {
                if (!sender) {
                    return res.status(400).json({
                        error: true,
                        sender: true,
                        receiver: false,
                        notFound: true,
                        areSame: false,
                        inSufficientAmount: false
                    })
                }

                if (sender.currBalance < amount) {
                    return res.status(400).json(
                        {
                            error: true,
                            sender: true,
                            receiver: false,
                            notFound: false,
                            areSame: false,
                            inSufficientAmount: true
                        }
                    )
                }

                Customers.findOne({ accNumber: acc2 }).then((receiver => {
                    if (!receiver) {
                        return res.status(400).json({
                            error: true,
                            sender: false,
                            receiver: true,
                            notFound: true,
                            areSame: false,
                            inSufficientAmount: false
                        })
                    }
                    if (sender.accNumber === receiver.accNumber) {
                        return res.status(400).json({
                            error: true,
                            sender: true,
                            receiver: true,
                            notFound: false,
                            areSame: true,
                            inSufficientAmount: false
                        })
                    }

                    sender.currBalance = sender.currBalance - amount;
                    receiver.currBalance = receiver.currBalance + amount;
                    sender.save()
                        .then((savedSender) => {
                            receiver.save()
                                .then((savedReceiver) => {
                                    const Transaction = new Transactions({
                                        Name1: sender.name,
                                        Acc1: sender.accNumber,
                                        Name2: receiver.name,
                                        Acc2: receiver.accNumber,
                                        transferred: amount,
                                    })

                                    Transaction.save().then(data => {
                                        console.log("Transaction saved")

                                        return res.status(200).json({
                                            error: false,
                                            updatedSenderData: savedSender,
                                            updatedReceiverData: savedReceiver
                                        })
                                    }).catch(err => {
                                        throw err;
                                    })
                                })
                        })
                }))

            })

    })

    // app.post('/sent', (req, res) => {

    //     const Transaction = new Transactions({
    //         Name1: 'Umang',
    //         Acc1: 072412,
    //         Name2: 'Vikas',
    //         Acc2: 141035,
    //         transferred: 13042
    //     })
    //     Transaction.save().then(data => {
    //         console.log('saved');

    //     }).catch(err => {
    //         throw err;
    //     })

    // })

    app.get('*', function (req, res) {
        res.redirect('/home');
    });


}