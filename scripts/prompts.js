const mysql = require('mysql2');
const inquirer = require('inquirer');
const { number } = require('yargs');
const cTable = require('console.table');
//Multiple queries for addEmployee function


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
    connection.query('SELECT * FROM role; SELECT * FROM employee;', function(err, results) {
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
                type: 'list',
                name: 'employeeRole',
                message: "What is the employee's role?",
                choices: results[0].map(function(role) {
                    return role.title;
            },
            {
                type: 'list',
                name: 'manager',
                message: "Who is the employee's manager?",
                choices: results[1].map(function(mang) {
                    return mang.lastName;
                }),    
                default: null,                
            })
            },
        ])
        .then (( { firstName, lastName, employeeRole, manager }) => { 
        let role = results[0].find(r => r.title === employeeRole);
        let employee = results[1].find(e => e.lastName === manager);
        const query = connection.query(
            'INSERT INTO employee SET ?',
            {
            first_name: firstName,
            last_name: lastName,
            role_id: role.id,
            manager_id: employee.id
            },
            function(err, res) {
                if (err) throw err;
                console.log(res.affectedRows + ' employee inserted!\n');
                initPrompt(connection);
            }
            );
        })
    });
};

updateEmployee = (connection) => {
    connection.query('SELECT * FROM employee; SELECT * FROM role;', function(err, results) {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'updatedEmployee',
                message: "Which employee are you modifying?",
                choices: results[0].map(function(emp) {
                    return emp.last_name;
                })
            },
            {
                type: 'list',
                name: 'updatedRole',
                message: "What is the employee's new title?",
                choices: results[1].map(function(job) {
                    return job.title;
                })
            }
        ])
        .then(({ updateEmployee, updatedRole }) => {
        let employee = results[0].find(e => e.lastName === updateEmployee);
        let role = results[1].find(r => r.title === updatedRole);
            const query = connection.query(
                'UPDATE employee SET ',  
                        {
                        role_title: role.title,
                        role_salary: role.salary,
                        department_id: role.department_id
                        },
                        'WHERE ',
                        {employee_id: employee.id
                        },               
                function(err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + ' role updated!\n');
                    initPrompt(connection);
                    }
                );
            })
        });
};

module.exports = initPrompt;  