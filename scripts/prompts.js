const mysql = require('mysql2');
const inquirer = require('inquirer');
const { number } = require('yargs');
const cTable = require('console.table');

initPrompt = function(connection) {
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
            switch(init) {
                case "view all departments":
                    readDepartments(connection);
                    break;
                case "view all roles":
                    readRoles(connection);
                    break;
                case "view all employees":
                    readEmployees(connection);
                    break;
                case "add a department":
                    addDepartments(connection);
                    break;
                case "add a role":
                    addRoles(connection);
                    break;
                case "add an employee":
                    addEmployee(connection);
                    break;
                case "update an employee role":
                    updateEmployee(connection);
                    break;     
            }    
    });
}

readDepartments = (connection) => {
    console.log('Selecting all departments...\n');
    connection.query('SELECT * FROM department', function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        initPrompt(connection);
    });
};

readRoles = (connection) => {
    console.log('Selecting all roles...\n');
    connection.query('SELECT * FROM role', function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        initPrompt(connection);
    });
};
    
readEmployees = (connection) => {
    console.log('Selecting all employees...\n');
    connection.query('SELECT * FROM employee', function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        initPrompt(connection);
    });
};
    
addDepartments = (connection) => {
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
        .then (( { deptName }) => {
            //adding new department to global array for dynamic choices on other ?s
            const query = connection.query(
                'INSERT INTO department SET ?',
                {
                name: deptName
                },
                function(err, res) {
                if (err) throw err;
                console.table(res.affectedRows + ' department inserted!\n');
                initPrompt(connection);
                }
            );
        })
};

addRoles = function(connection) {
    connection.query('SELECT * FROM department', function(err, departments) {
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
                type: 'list',
                name: 'roleDept',
                message: 'Attach this role to a department.',
                choices: departments.map(function(dept) {
                    return dept.name;
                })
            }
        ])
        .then (( { roleName, roleSalary, roleDept }) => { 
            let department = departments.find(d => d.name === roleDept);      
            const query = connection.query(
                'INSERT INTO role SET ?',
                {
                title: roleName,
                salary: roleSalary,
                department_id: department.id
                },
                function(err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + ' role inserted!\n');
                    initPrompt(connection);
                }
                );
            })
    });
    
};

addEmployee = function(connection) {
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
            }
        );
    };
};

updateEmployee = (connection) => {
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
        }
    );
};
    

queryDepartments = (connection) => {
    connection.query('SELECT * FROM department', function(err, res) {
        if (err) throw err;
        return res;
    });
}
module.exports = initPrompt;  