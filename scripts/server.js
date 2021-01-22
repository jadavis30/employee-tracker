const mysql = require('mysql2');

const inquirer = require('inquirer');
const initPrompt = require('./prompts')

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  // Your MySQL username
  user: 'root',
  // Your MySQL password
  password: '',
  database: 'ice_creamDB'
});

connection.connect(err => {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId + '\n');
  inquireUser();
});



updateProduct = () => {
  console.log('Updating all Rocky Road quantities...\n');
  const query = connection.query(
    'UPDATE products SET ? WHERE ?',
    [
      {
        quantity: 100
      },
      {
        flavor: 'Rocky Road'
      }
    ],
    function(err, res) {
      if (err) throw err;
      console.log(res.affectedRows + ' products updated!\n');
      // Call deleteProduct() AFTER the UPDATE completes
      deleteProduct();
    }
  );
  // logs the actual query being run
  console.log(query.sql);
};

deleteProduct = () => {
  console.log('Deleting all strawberry ice cream...\n');
  const query = connection.query(
    'DELETE FROM products WHERE ?',
    {
      flavor: 'strawberry'
    },
    function(err, res) {
      if (err) throw err;
      console.log(res.affectedRows + ' products deleted!\n');
      // Call readProducts() AFTER the DELETE completes
      readProducts();
    }
  );
  // logs the actual query being run
  console.log(query.sql);
};

readProducts = () => {
  console.log('Selecting all products...\n');
  connection.query('SELECT * FROM products', function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log(res);
    connection.end();
  });
};
