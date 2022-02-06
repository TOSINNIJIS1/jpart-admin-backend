const express = require('express');
const app  = express()
const mongoose = require('mongoose');
const api = require('./router')
const Cors = require('cors');
const bodyParser = require('body-parser');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json())
app.use(express.json())
app.use(Cors());


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
})

app.use(express.static(__dirname));
app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({error: { message: err.message }})
});


const PORT = process.env.PORT || '1000'

const uri = "mongodb+srv://jeff-art:cheffjeff@jeff-art.jkp4i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
})
.then(() => {
    console.log('Database Connected')
    return app.listen(PORT)
})
.then(() => console.log('Server running on port 1000'))
.catch((err) => console.log(err))


app.get('/', function (req, res) {
    res.send('Connected Successfully')
  })
app.use('/art', api);