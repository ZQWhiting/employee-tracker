INSERT INTO department (name)
VALUES ('Sales'), ('Engineering'), ('Finance'), ('Legal');


INSERT INTO role (title, salary, department_id)
VALUES
    ('Sales Lead', 100000, 1),
    ('Salesperson', 80000, 1),
    ('Lead Engineer', 150000, 2),
    ('Software Engineer', 120000, 2),
    ('Accountant', 125000, 3),
    ('Legal Team Lead', 250000, 4),
    ('Lawyer', 190000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Evalyn', 'Henry', 1, NULL),
    ('Azeem', 'Zhang', 3, NULL),
    ('Poppie', 'Murphy', 6, NULL),
    ('Zaine', 'Kaye', 2, 1),
    ('Charlize', 'Cardenas', 2, 1),
    ('Fintan', 'Christie', 4, 2),
    ('Rhonda', 'Rose', 4, 2),
    ('Zachary', 'Chavez', 5, NULL),
    ('Lance', 'Vincent', 5, NULL),
    ('Lawrence', 'Haworth', 7, 3),
    ('Ananya', 'Robins', 7, 3),
    ('Haya', 'Hutton', 7, 3),
    ('Ishaq', 'Millington', 2, 1),
    ('Dev', 'Campbell', 4, 2);
