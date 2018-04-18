//require('./config/config.js');

const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT;

const io = socketIO(server);

app.use(express.static('./public'));
app.use(bodyParser.json());

const { MongoClient, ObjectID } = require('mongodb');
var dbs;
const url = process.env.MONGO_URI;
console.log(port);
console.log(url);
MongoClient.connect(url, (err, db) => {
    if (err) {
        return console.log("error in connecting mongo db " + err);
    }
    console.log("Connected to mongodb");
    dbs = db.db('kush')

    io.on('connection', (socket) => {
        console.log("new user connected");
        socket.on('submitUSer', (message) => {
            dbs.collection('users').insertOne(message.fetchValues, (err, response) => {
                console.log(response.ops);
                io.emit('newMessage', response.ops)
            });
        })
        socket.on('deleteAll',(msz)=>{
            console.log("all deleted");
            dbs.collection('users').remove({}).then((result) => {
                console.log(result.result.n);
                io.emit('deleted',`${result.result.n} user(s) deleted`);
             });
        });
        socket.on('deleteUser',(data)=>{
            console.log(data);
             let id =new ObjectID(data);
            dbs.collection('users').findOneAndDelete({ _id: id }).then((result) => {
                // res.status(200).send(result);
                io.emit('deletedUser',result);
            })
        })
        socket.on('updateUser',(data)=>{
             console.log(data.id);
            dbs.collection('users').findOneAndUpdate(
            {
                _id: ObjectID(data.id)
            }, {
                $set: {
                    name: data.name,
                    mobile: data.mobile,
                    address: data.address,
                }
            }, {
                returnOriginal: false
            }).then((result) => {
                io.emit('updatedUser',result);
            })
        })

    })

    app.post('/save', (req, res) => {
        dbs.collection('users').insertOne(req.body, (err, response) => {
            console.log(response.ops);
            if (err)
                res.status(404).send("unable to insert " + err);
            res.send(response.ops);
        });
    });
    app.get('/users', (req, res) => {
        dbs.collection('users').find().toArray().then((response) => {
            if (response) {
                res.status(200).send(response);
            }
            res.status(400).send("Unable t find user");
        });
    });
    app.get('/deleteAll', (req, res) => {
        dbs.collection('users').remove({}).then((result) => {
            console.log(result.result.n);
            res.status(200).send(`${result.result.n} user(s) deleted`);
        })
    })
    app.post('/delete', (req, res) => {
        console.log(req.body)
        let id = ObjectID(req.body._id);
        dbs.collection('users').findOneAndDelete({ _id: id }).then((result) => {
            res.status(200).send(result);
        })
    })
    app.post('/findUser', (req, res) => {
        console.log(req.body);
        dbs.collection('users').find({ _id: ObjectID(req.body._id) }).toArray().then((result) => {
            console.log(result);
            res.send(result);
        })
    });

    app.post('/updateUser', (req, res) => {
        console.log(req.body.id);
        dbs.collection('users').findOneAndUpdate(
            {
                _id: ObjectID(req.body.id)
            }, {
                $set: {
                    name: req.body.name,
                    mobile: req.body.mobile,
                    address: req.body.address,
                }
            }, {
                returnOriginal: false
            }).then((result) => {
                console.log(result);
                res.send(result);
            })
    })


});
server.listen(port, () => {
    console.log(`server is up on port ${port}`)
})
