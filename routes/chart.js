var express = require('express');
var router = express.Router();

let bodyParser = require('body-parser')
let urlencodedParser = bodyParser.urlencoded({ extended: false })

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('charter', { title: 'Data Entry' });
});

router.get('/db', function(req, res, next) {
  res.render('db', { title: 'D Query', params: '', vals: '', chart: '' });
});


router.post('/mysql', urlencodedParser, function (req, res) {
  // res.send(req.body.yAxis)
  let hostname = req.body.sqlHost
  let username = req.body.sqlUsername
  let passkey = req.body.sqlPassword
  let db = req.body.sqlDatabase
  let query = req.body.sqlQuery
  let chartType = req.body.chartType
  let xAxis = req.body.xAxis
  let yAxis = req.body.yAxis

  const mysql = require('mysql');

  const con = mysql.createConnection({
    host: hostname,
    user: username,
    password: passkey,
    database: db
  });

  con.connect((err) => {
    if(err){
      console.log('Error connecting to Db');
      return;
    }
    console.log('Connection established');
  });

  let x
  let y

  con.query(query, (err,rows) => {
    if(err) throw err
    console.log(rows)
    if (xAxis != '' && yAxis != '') {
      x = xAxis
      y = yAxis
    } else {
      x = Object.keys(rows[0])[0]
      y = Object.keys(rows[0])[1]
    }
    console.log(x , y)
    let parameters = rows.map(obj => obj[x])
    console.log(parameters)
    
    let values = rows.map(obj => obj[y])
    console.log(values)

    res.render('db', {title: 'DB Q', params: parameters, vals: values, chart: chartType})
  });

  con.end((err) => {
  });
})

module.exports = router;