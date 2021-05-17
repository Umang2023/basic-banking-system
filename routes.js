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
        // Wish.find({}).then(data => {
        // console.log(data);
        res.render('home')
        // })
    })

    app.get('/customers', (req, res) => {
        Customers.find({}).then(data => {
            // console.log(data);
            res.render('customers', { customers: data });
        })

    })
    app.get('/transactions', (req, res) => {
        Transactions.find({}).then(data => {
            res.render('transactions', { transactions: data });
        })
    })
    app.get('/transfer', (req, res) => {
        // Customers.findOne({})
        // let accn = req.params.id;
        // console.log(accn);
        res.render('transfer');
    })
    //post routes
    app.post('/transferred', (req, res) => {
        let data = req.body;
        console.log(data);
        let acc1 = Number(data.Acc1);
        // acc1 = Number(acc1);
        let acc2 = Number(data.Acc2);
        let amount = Number(data.amount);
        // console.log(typeof (acc1));
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
                                    // return res.status(200).json({
                                    //     error: false,
                                    //     updatedSenderData: savedSender,
                                    //     updatedReceiverData: savedReceiver
                                    // })
                                    Transaction.save().then(data => {
                                        console.log("Transaction saved")
                                        // res.render('/transactions', { transactions: data });
                                        return res.status(200).json({
                                            error: false,
                                            updatedSenderData: savedSender,
                                            updatedReceiverData: savedReceiver
                                        })
                                    }).catch(err => {
                                        throw err;
                                    })
                                    // Transactions.find({}).then(data => {
                                    //     res.render('transactions', { transactions: data });
                                    // })

                                })
                        })
                }))

            })

    })

    app.post('/sent', (req, res) => {

        // Customers.findOne({ accNumber: acc1 }).then((foundCustomer) => {
        //     if (!foundCustomer) {
        //         return res.status(400).json({ error: "No such user found" })
        //     }
        //     if (foundCustomer.amount < amount) {
        //         return res.status(400).json({ error: "In sufficient amount" })
        //     }
        // })
        const Transaction = new Transactions({
            Name1: 'Umang',
            Acc1: 072412,
            Name2: 'Vikas',
            Acc2: 141035,
            transferred: 13042
        })
        Transaction.save().then(data => {
            console.log('saved');
            // console.log(data);

        }).catch(err => {
            throw err;
        })
        // const Customer = new Customers({
        //     name: "Shivank Maheshwari",
        //     id: "golumahesh420@gmail.com",
        //     accNumber: 1392743,
        //     currBalance: 200000,
        // })
        // Customer.save().then(data => {
        //     console.log("saved");
        //     // wish.push(Item.wish);
        //     // res.send(wish);
        // }).catch(err => {
        //     throw err;
        // })
        // Item.then(
        // // console.log(req.body.item);
        // wish.push(Item.wish);
        // res.send(data);
        // );
    })

    //delete routes

    // app.delete('/remove/:id', (req, res) => {
    //     // console.log(req.params);
    //     // console.log(req.params.id);
    //     // wish = wish.map((item)=>{
    //     //     if( item != req.params.id )
    //     //         return item;
    //     // })
    //     // res.send(wish);
    //     Wish.findOneAndRemove({ wish: req.params.id }).then(data => {
    //         // console.log("deleted")
    //         res.send(data)
    //     })

    // })
    app.get('*', function (req, res) {
        res.redirect('/home');
    });


}