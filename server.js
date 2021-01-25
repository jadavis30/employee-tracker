const mysql = require('mysql2');
const initPrompt = require('./scripts/prompts');

const connection = mysql.createConnection({
  multipleStatements: true,
  host: 'localhost',
  port: 3306,
  // Your MySQL username
  user: 'root',
  // Your MySQL password
  password: '#904DuvalLadybird16!',
  database: 'company_db'
});

connection.connect(err => {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId + '\n');
  console.log(`Welcome to the Employee Tracker! Let's Begin.\n`)
  initPrompt(connection);
});
