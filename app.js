const express = require('express');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'system',
  database: 'users',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use(express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/submit', (req, res) => {
  const { name, email, message } = req.body;

  const query = 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)';

  connection.query(query, [name, email, message], (err, results) => {
    if (err) throw err;
    console.log('Data inserted successfully!');
    res.redirect('/'); 
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
