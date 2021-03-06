DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;
USE company_db;

CREATE TABLE employee(
  id INTEGER(11) AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INTEGER(11),
  manager_id INTEGER(11),
  PRIMARY KEY (id)
  CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles(id) 
  CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(manager_id) ON DELETE SET NULL
);

CREATE TABLE role(
  id INTEGER(11) AUTO_INCREMENT NOT NULL,
  title VARCHAR(100),
  salary VARCHAR(100),
  department_id INTEGER(11),
  PRIMARY KEY (id)
  CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE department(
    id INTEGER(11) AUTO_INCREMENT NOT NULL,
    name VARCHAR(30),
    PRIMARY KEY (id)
);