const inquirer = require('inquirer');
const { number } = require('yargs');
const departments = [];
const roles = [];
const employees = [];


initPrompt = function() {
inquirer
    .prompt([
        {
            type: 'list',
            name: 'init',
            message: 'What would you like to do?',
            choices: [
                "view all departments", 
                "view all roles", 
                "view all employees", 
                "add a department", 
                "add a role", 
                "add an employee", 
                "update an employee role"
            ]
        }
    ])
    .then(( { init } ) => {
        switch(init.choices) {
            case "view all departments":
                this.viewAllDepartments();
                break;
            case "view all roles":
                this.viewAllRoles();
                break;
            case "view all employees":
                this.viewAllEmployees();
                break;
            case "add a departments":
                this.addDepartments();
                break;
            case "add a role":
                this.addRoles();
                break;
            case "add an employee":
                this.addEmployee();
                break;
            case "update an employee role":
                this.updateRole();
                break;     
        }
    });
}

readDepartments = () => {
    console.log('Selecting all departments...\n');
    connection.query('SELECT * FROM departments', function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.log(res);
      connection.end();
    });
  };

readRoles = () => {
  console.log('Selecting all roles...\n');
  connection.query('SELECT * FROM roles', function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log(res);
    connection.end();
  });
};

readEmployees = () => {
  console.log('Selecting all employees...\n');
  connection.query('SELECT * FROM employees', function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log(res);
    connection.end();
  });
};

addDepartments = function() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'deptName',
                message: 'Name the new department.',
                validate: function(text) {
                    if (text === "") {
                        return "Please enter a name for the department."
                    }
                    return true;
                }
            }
        ])
    let newDepartment = {name:"deptName"};
    console.log(newDepartment + "has been created.");
        
    createDept = (newDepartment) => {
    console.log('Inserting a new department...\n');
    //adding new department to global array for dynamic choices on other ?s
    departments.push(newDepartment);
    const query = connection.query(
        'INSERT INTO department SET ?',
        {
        name: deptName
        },
        function(err, res) {
        if (err) throw err;
        console.log(res.affectedRows + ' department inserted!\n');
        // Call initial prompt AFTER the INSERT completes
        initPrompt();
        }
    )};
};

addRoles = function() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'roleName',
                message: 'Name the new role.',
                validate: function(text) {
                    if (text === "") {
                        return "Please enter a name for the role."
                    }
                    return true;
                }
            },
            {
                type: 'input',
                name: 'roleSalary',
                message: "What is this position's salary?",
                validate: function() {
                    if (number <= 0) {
                        return "Please enter an appropriate annual salary."
                    }
                    return true;
                }
            },
            {
                type: 'input',
                name: 'roleDept',
                message: 'Attach this role to a department.',
                choices: departments
            }
        ])
        let newRole = {name:"roleName", salary:"roleSalary", department:"roleDept"};
        console.log(newRole + "has been created.");

    createRole = (newRole) => {
    console.log('Inserting a new role...\n');
    roles.push(newRole);
    const query = connection.query(
        'INSERT INTO role SET ?',
        {
        name: roleName,
        salary: roleSalary,
        department: roleDept
        },
        function(err, res) {
        if (err) throw err;
        console.log(res.affectedRows + ' role inserted!\n');
        // Call initial prompt AFTER the INSERT completes
        initPrompt();
        }
    )};
};

addEmployees = function() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'firstName',
                message: "What is the employee's first name?",
                validate: function(text) {
                    if (text === "") {
                        return "Please enter a name."
                    }
                    return true;
                }
            },
            {
                type: 'input',
                name: 'lastName',
                message: "What is the employee's last name?",
                validate: function(text) {
                    if (text === "") {
                        return "Please enter a name."
                    }
                    return true;
                }
            },
            {
                type: 'input',
                name: 'employeeRole',
                message: "What is the employee's role?",
                choices: roles
            },
            {
                type: 'input',
                name: 'manager',
                message: "Who is the employee's manager?",
                choices: employees,
                default: null 
            }
        ])
        let newEmployee = {first: "firstName", last: "lastName", role: "employeeRole", manager: "manager"};
        console.log(newEmployee + "has been created!")
        
    createEmployee = (newEmployee) => {
        console.log('Inserting a new employee...\n');
        employees.push(newEmployee);
        const query = connection.query(
            'INSERT INTO employee SET ?',
            {
            first_name: roleName,
            last_name: roleSalary,
            role_id: roles.id,
            manager_id: employees.id
            },
            function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + ' employee inserted!\n');
            // Call initial prompt AFTER the INSERT completes
            initPrompt();
            }
        );
    };
};

updateEmployee = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'updatedEmployee',
                message: "Which employee are you modifying?",
                choices: employees
                //destructure to get first name
            },
            {
                type: 'input',
                name: 'updatedRole',
                message: "What is the employee's new title?",
                choices: roles
            }
        ])
    .then(this.employee)
    console.log("Updating employee's role...\n");
    const query = connection.query(
      'UPDATE employee SET ? WHERE ?',
      [
        {
          id: employee.id
        },
        {
          role: updatedRole
        }
      ],
      function(err, res) {
        if (err) throw err;
        console.log(res.affectedRows + ' role updated!\n');
        // Call initial prompt AFTER the INSERT completes
        initPrompt();
        }
    );
};




//export inquireUser(answers)