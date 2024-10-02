const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const csrf = require('csurf');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const csrfProtection = csrf({ cookie: true });
const parseForm = bodyParser.urlencoded({ extended: false });


app.use(cookieParser());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(bodyParser.urlencoded({ extended: false })); 
app.use(csrfProtection);

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));
  
const db = mysql.createConnection({
  host: 'localhost',
  user: '',
  password: '',
  database: ''
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

app.get('/', (req, res) => {
  res.render('index', { csrfToken: req.csrfToken() });
});

app.get('/form', (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});

app.post('/submit', parseForm, (req, res) => {
  const { data } = req.body;
  // Save `data` to the database
  db.query('INSERT INTO table_name (data) VALUES (?)', [data], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving data to database');
    } else {
      res.send('Form data received and saved to database');
    }
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
