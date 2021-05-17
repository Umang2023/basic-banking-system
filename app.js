const express = require('express');
const app = express();
const port = process.env.PORT || 5000

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'))


require('./routes')(app);

app.set('view engine', 'ejs')

app.listen(port, () => {
  console.log("server is running on port " + port)
})