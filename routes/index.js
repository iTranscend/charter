var express = require("express");
var router = express.Router();
let bodyParser = require("body-parser");
let urlencodedParser = bodyParser.urlencoded({ extended: false });

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('generate_report', { title: 'Express' });
// });
let databaseOptions = require("../utils/db.js");
const mysql = require("mysql");

const conn = mysql.createConnection(databaseOptions);
conn.connect(err => {
  if (err) throw err;
});

router.get("/connection", function(req, res, next) {
  res.render("connection");
});

router.post("/createConnection", urlencodedParser, function(req, res, next) {
  let dbType = req.body.databaseType;
  let host = req.body.host;
  let dbUsername = req.body.dbUsername;
  let dbPassword = req.body.dbPassword;
  let dbName = req.body.dbName;
  let dbPort = req.body.dbPort;

  let sql =
    "INSERT INTO connections(dbtype, hostname, user, password, dbname, port) VALUES (?)";
  let values = [dbType, host, dbUsername, dbPassword, dbName, dbPort];

  conn.query(sql, [values], function(err) {
    if (err) throw err;
  });
  // conn.end()
  res.render("connection", { message: "Connection Saved!" });
});

router.get("/report", function(req, res, next) {
  let sql = "SELECT id, dbtype, dbname, hostname FROM connections";
  conn.query(sql, (err, rows) => {
    if (err) throw err;
    console.log(rows);
    res.render("report", { options: rows });
  });
  // conn.end()
});

router.post("/createReport", urlencodedParser, function(req, res, next) {
  let reportName = req.body.reportName;
  let reportDescription = req.body.reportDescription;
  let connectionID = req.body.connectionID;
  let chartType = req.body.chartType;
  let query = req.body.query;
  let xAxis = req.body.xAxis;
  let yAxis = req.body.yAxis;

  let sql =
    "INSERT INTO reports(name, conn_id, query, description, chart_type, x, y) VALUES (?)";
  let values = [
    reportName,
    connectionID,
    query,
    reportDescription,
    chartType,
    xAxis,
    yAxis
  ];

  conn.query(sql, [values], function(err) {
    if (err) throw err;
  });
  let sql2 = "SELECT id, dbtype, dbname, hostname FROM connections";
  conn.query(sql2, (err, rows) => {
    if (err) throw err;
    console.log(rows);
    res.render("report", { message: "Report Saved!", options: rows });
  });
  // conn.end()
});

router.get("/generate_report", function(req, res, next) {
  let sql = "SELECT id, name, description, chart_type FROM reports";
  conn.query(sql, (err, rows) => {
    if (err) throw err;
    console.log(rows);
    res.render("generate_report", {
      reports: rows,
      vals: "",
      params: "",
      chart: ""
    });
  });
  // conn.end()
});

router.get("/draw/:reportID", function(req, res, next) {
  let reportID = req.params.reportID;
  console.log(reportID);

  // Get connection ID for the report to be generated
  const mysql = require("mysql");
  const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "charter"
  });
  conn.connect();
  let sql = "SELECT conn_id, query, chart_type, x, y FROM reports WHERE id = ?";
  conn.query(sql, reportID, (err, row) => {
    if (err) throw err;
    console.log(row);
    let connID = row[0].conn_id;
    let query = row[0].query;
    let chartType = row[0].chart_type;
    let xAxis = row[0].x;
    let yAxis = row[0].y;

    // Get connection credentials for the connection id retrieved
    const mysql = require("mysql");
    const conn = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "charter"
    });
    conn.connect();
    let sql =
      "SELECT dbtype, hostname, user, password, dbname FROM connections WHERE id = ?";

    // Connect to the specified Database with credentials recieved
    conn.query(sql, connID, (err, row) => {
      if (err) throw err;
      console.log(row);
      let dbtype = row[0].dbtype;
      let hostname = row[0].hostname;
      let username = row[0].user;
      let passKey = row[0].password;
      let dbname = row[0].dbname;
      let port = row[0].port;

      switch (dbtype) {
        case "mysql":
          const connMysql = require("mysql");
          const sqlConn = connMysql.createConnection({
            host: hostname,
            user: username,
            password: passKey,
            database: dbname
          });
          sqlConn.connect(err => {
            if (err) throw err;
          });
          console.log("The query is:" + query);
          sqlConn.query(query, (err, rows) => {
            if (err) throw err;
            console.log(rows);
            let parameters = rows.map(obj => obj[xAxis]);
            console.log(parameters);
            let values = rows.map(obj => obj[yAxis]);
            console.log(values);

            // Get all the existing reports from the reports table
            const mysql = require("mysql");
            const conn = mysql.createConnection({
              host: "localhost",
              user: "root",
              password: "",
              database: "charter"
            });
            conn.connect();
            let sql = "SELECT id, name, description, chart_type FROM reports";
            conn.query(sql, (err, rows) => {
              if (err) throw err;
              console.log(rows);
              res.render("generate_report", {
                reports: rows,
                params: parameters,
                vals: values,
                chart: chartType
              });
            });
            // conn.end()
          });
          break;
        case "postgresql":
          console.log("postgresql");
          const Client = require("pg").Client;
          const client = new Client({
            user: username,
            password: passKey,
            host: hostname,
            port: port,
            database: dbname
          });
          console.log(username);
          console.log(passKey);
          console.log(hostname);
          console.log(xAxis);
          console.log(yAxis);
          console.log(chartType);

          client
            .connect()
            .then(() => console.log("Connection Successful"))
            .then(() => client.query(query))
            .then(function(results) {
              console.log(results.rows);
              let parameters = results.rows.map(obj => obj[xAxis]);
              console.log(parameters);
              let values = results.rows.map(obj => obj[yAxis]);
              console.log(values);

              // Get all the existing reports from the reports table
              let mysql = require("mysql");
              let conn = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "",
                database: "charter"
              });
              conn.connect();
              let sql = "SELECT id, name, description, chart_type FROM reports";
              conn.query(sql, (err, rows) => {
                if (err) throw err;
                console.log(rows);
                res.render("generate_report", {
                  reports: rows,
                  params: parameters,
                  vals: values,
                  chart: chartType
                });
              });
              // conn.end()
            })
            .then()
            .catch(e => console.log)
            .finally(() => client.end());
          break;
        case "mongodb":
          break;
        case "cassandra":
          break;
        case "sqlserver":
          break;
        case "couchbase":
          break;
        case "couchdb":
          break;
        case "neo4j":
          break;
        case "oracle":
          break;
        case "redis":
          break;
        case "sqlite":
          break;
        case "sqlite3":
          break;
        case "elasticsearch":
          break;
        case "leveldb":
          break;
      }
    });
    // conn.end()
  });
  // conn.end()
});

router.get("/group_reports", function(req, res, next) {
  conn.query("SELECT id, name FROM pages", (err, rows) => {
    if (err) throw err;
    console.log(rows);
    conn.query("SELECT id, name FROM reports", (err, reportRows) => {
      if (err) throw err;
      console.log(reportRows);
      res.render("group_reports", { options: rows, reportOptions: reportRows });
    });
  });
});

router.post("/createPage", urlencodedParser, function(req, res, next) {
  let group = req.body.groupName;
  conn.query("INSERT INTO pages (name) VALUES (?)", group, function(err) {
    if (err) throw err;
  });
  conn.query("SELECT id, name FROM pages", (err, rows) => {
    if (err) throw err;
    console.log(rows);
    conn.query("SELECT id, name FROM reports", (err, reportRows) => {
      if (err) throw err;
      console.log(reportRows);
      res.render("group_reports", { options: rows, reportOptions: reportRows });
    });
  });
});

router.post("/groupReport", urlencodedParser, function(req, res, next) {
  let groupID = req.body.group;
  let reportID = req.body.report;
  let height = req.body.height;
  let width = req.body.width;
  let unit = req.body.unit;
  let sequence = req.body.sequence;
  let vals = [reportID, width, height, unit, groupID, sequence];

  conn.query(
    "INSERT INTO reports_config (report_id, width, height, unit, page_id, sequence) VALUES (?)",
    [vals],
    function(err) {
      if (err) throw err;
    }
  );

  conn.query("SELECT id, name FROM pages", (err, rows) => {
    if (err) throw err;
    console.log(rows);
    conn.query("SELECT id, name FROM reports", (err, reportRows) => {
      if (err) throw err;
      console.log(reportRows);
      res.render("group_reports", { options: rows, reportOptions: reportRows });
    });
  });
});

router.get("/generate_pages", function(req, res, next) {
  let sql = "SELECT id, name FROM pages";
  conn.query(sql, (err, rows) => {
    if (err) throw err;
    console.log(rows);
    res.render("generate_pages", { pages: rows });
  });
  // conn.end()
});

router.get("/page/:pageId", function(req, res, next) {
  let pageId = req.params.pageId;
  console.log(pageId);

  let reportGroup = [];
  conn.query("SELECT name FROM pages WHERE id = ?", pageId, (err, pageName) => {
    if (err) throw err;
    console.log(pageName);
    conn.query(
      "SELECT name, conn_id, dbtype, hostname, user, password, dbname, port, query, description, chart_type, x, y, report_id, width, height, unit, sequence FROM reports_config rc JOIN reports r ON rc.report_id = r.id JOIN connections c ON r.conn_id = c.id WHERE page_id = ? ORDER BY sequence ASC",
      pageId,
      (err, pageReports) => {
        if (err) throw err;

        // console.log(pageReports)
        pageReports.forEach(element => {
          let dbtype = element.dbtype;
          let hostname = element.hostname;
          let username = element.user;
          let passKey = element.password;
          let dbname = element.dbname;
          let port = element.port;
          let query = element.query;
          let xAxis = element.x;
          let yAxis = element.y;
          let chartType = element.chart_type;
          let reportName = element.name;
          let description = element.description;
          let width = element.width;
          let height = element.height;
          console.log(dbtype);

          var knex = require("knex")({
            client: dbtype,
            connection: {
              host: hostname,
              user: username,
              password: passKey,
              database: dbname,
              port: port
            }
          });

          knex
            .raw(query)
            .then(rows => {
              let parameters;
              let values;
              if (dbtype == "mysql") {
                // console.log(rows[0])
                parameters = rows[0].map(obj => obj[xAxis]);
                console.log(parameters);
                values = rows[0].map(obj => obj[yAxis]);
                console.log(values);
              } else if (dbtype == "pg") {
                // console.log(rows.rows)
                parameters = rows.rows.map(obj => obj[xAxis]);
                console.log(parameters);
                values = rows.rows.map(obj => obj[yAxis]);
                console.log(values);
              }
              let results = [parameters, values];
              return results;
            })
            .then(results => {
              let parameters = results[0];
              let values = results[1];
              console.log(parameters);
              console.log(values);

              reportGroup.push({
                chart_type: chartType,
                name: reportName,
                description: description,
                params: parameters,
                vals: values,
                height,
                width
              });
            })
            .catch(e => console.log(e));
        });

        setTimeout(function() {
          console.log(reportGroup);
          stringedReportGroup = JSON.stringify(reportGroup);
          console.log(stringedReportGroup);
          console.log("timeout completed");
          // res.send(stringedReportGroup);
          res.render("page", { reports: stringedReportGroup });
        }, 1000);
      }
    );
  });
});

module.exports = router;
