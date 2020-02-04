// Require express to load our app server and create an instance of it
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql'); //mysql connection
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

function getConnection() {
    return mysql.createConnection({
        host: "sql10.freemysqlhosting.net",
        user: "sql10309969",
        password: "VPQAvGvIM4",
        database: "sql10309969"
    });
}
const con = getConnection();
console.log('con---', con);

app.get('/', (req, res) => {
    res.send('<b>My</b> first express http server');
    console.log("responding to localhost:3000")
});

app.post('/api/signup', (req, res) => {
    // console.log('req.body', req.body);
    // const { username, email, password } = req.body;
   bcrypt.hash(req.body.password, 10, function(err, hash) {
      if(err) {
          return res.status(500).json({
              error: err
          });
      } else {
          const user =new User({
              username: req.body.username,
              email: req.body.email,
              password: hash
          });
          con.connect(() => {
            // const sql = `INSERT INTO users(username, email, password) VALUES ("${username}", "${email}", "${password}")`;
            const sql = "INSERT INTO users set ?";
            con.query(sql, user, (err, results) => {
                if (err) {
                    console.log('failed' + err);
                    res.Status(500).send(err);
                    return
                } else {
                    console.log('results->', results, '->');
                    res.json({ 'status': 'success', body: results.body })
                    console.log(results.body);
                    res.end();
                }
            })
         })
       }
    });
});

app.post('/api/login', (req, res) => {
    const password = req.body.password;
    con.query("SELECT * FROM users WHERE username='"+req.body.username+"'", (err, res, fields) => {
        if(err) throw err;
        bcrypt.compare(password, res.password, (err, res) => {
            if(err) throw err;
            const jwtToken = jwt.sign({
                username: user.username
            },
            'secret',//or privateKey
            {
                expiresIn: '2h'//or { algorithm: 'RS256A'}
            });
            return res.status(200).json({
                success: 'Welcome to the jwt Auth!',
                token: jwtToken
            });
        })
    })
})

app.get('/api/users', (req, res) => {
   con.connect((err) => {
        if (err) throw err;
        const queryString = "SELECT * FROM users";
        con.query(queryString, (err, result, fields) => {
        if(err) {
            console.log("failed to query for users:" + err)
            res.status(500).send('server error');
            return;
        }
        res.status(200).send(JSON.stringify(result));
    })
  })
})

// start the server in the port 3000 !
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));