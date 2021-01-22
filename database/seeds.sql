INSERT INTO employee (firstName, lastName, role_id, manager_id) values ('George', 'Feeny', 1, NULL);
INSERT INTO employee (firstName, lastName, role_id, manager_id) values ('John', 'Keating', 2, 1);
INSERT INTO employee (firstName, lastName, role_id, manager_id) values ('Jennifer', 'Honey', 4, 1);
INSERT INTO employee (firstName, lastName, role_id, manager_id) values ('Dewey', 'Finn', 6, 1);
INSERT INTO employee (firstName, lastName, role_id, manager_id) values ('John', 'Kimble', 3, 1);
INSERT INTO employee (firstName, lastName, role_id, manager_id) values ('Walter', 'White', 5, 1);

INSERT INTO role (title, salary, department_id) values ('Principal', 1);
INSERT INTO role (title, salary, department_id) values ('Assistant Principal', 1);
INSERT INTO role (title, salary, department_id) values ('Dean of Students', 2);
INSERT INTO role (title, salary, department_id) values ('School Counselor', 4);
INSERT INTO role (title, salary, department_id) values ('ESE Teacher', 3);
INSERT INTO role (title, salary, department_id) values ('Interventionist', 3);

INSERT INTO department (name) value ('Administration');
INSERT INTO department (name) value ('Discipline');
INSERT INTO department (name) value ('Exceptional Student Services');
INSERT INTO department ((name) value ('Counseling');