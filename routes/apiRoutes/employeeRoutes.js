const router = require('express').Router();
const db = require('../../db/database');
const inputCheck = require('../../utils/inputCheck');

router.get('/employees', (req, res) => {

    const sql = `
    SELECT
        e.id,
        e.first_name,
        e.last_name,
        role.title AS Role,
        role.salary,
        department.name AS department,
        CONCAT(m.first_name, ' ', m.last_name) AS manager

    FROM employee e

    LEFT JOIN (role, department)
        ON (role.id = e.role_id AND department.id = role.department_id)

    LEFT JOIN employee m
        ON m.id = e.manager_id
    `;

    const params = [];

    db.execute(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        res.json({
            message: 'success',
            data: rows
        });
    });
});

router.get('/employees/manager/:id', (req, res) => {

    const sql = `
    SELECT
        e.id,
        e.first_name,
        e.last_name,
        CONCAT(m.first_name, ' ', m.last_name) AS manager

    FROM employee e

    LEFT JOIN employee m
        ON m.id = e.manager_id

    WHERE e.manager_id = ?
    `;

    const params = [req.params.id]

    db.execute(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        res.json({
            message: 'success',
            data: rows
        });
    });
});

router.get('/employees/department/:id', (req, res) => {

    const sql = `
    SELECT
        employee.id,
        employee.first_name,
        employee.last_name,
        department.name AS department

    FROM employee

    LEFT JOIN (role, department)
        ON (role.id = employee.role_id AND role.department_id = department.id)

    WHERE department.id = ?
    `;

    const params = [req.params.id]

    db.execute(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        res.json({
            message: 'success',
            data: rows
        });
    });
});

router.post('/employee', ({body}, res) => {

    const errors = inputCheck(body, 'first_name', 'last_name', 'role_id', 'manager_id');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `
    INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES (?,?,?,?)
    `;

    const params = [body.first_name, body.last_name, body.role_id, body.manager_id]

    db.execute(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        res.json({
            message: 'success',
            data: body,
            id: result.insertId
        });
    });
});

router.put('/employee/:update/:id', (req, res) => {
    let idType;
    let newId;

    if (req.params.update === 'manager') {
        idType = 'manager_id';
        newId = req.body.manager_id;
    } else {
        idType = 'role_id'
        newId = req.body.role_id;
    }

    const errors = inputCheck(req.body, idType);
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `
    UPDATE employee

    SET ${idType} = ?

    WHERE id = ?
    `;

    const params = [newId, req.params.id];

    db.execute(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        res.json({
            message: 'success',
            data: req.body,
            changes: result.affectedRows
        });
    });
});

router.delete('/employee/:id', (req, res) => {

    const sql = `
    DELETE

    FROM employee

    WHERE id = ?
    `;

    const params = [req.params.id];

    db.execute(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: res.message });
            return;
        }

        res.json({
            message: 'successfully deleted',
            changes: result.affectedRows
        });
    });
});

module.exports = router;