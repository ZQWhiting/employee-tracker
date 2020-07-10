const router = require('express').Router();
const db = require('../../db/database');
const inputCheck = require('../../utils/inputCheck');

router.get('/departments', (req, res) => {
    const sql = `TABLE department`
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

//View the total utilized budget of a department—
//i.e., the combined salaries of all employees in that department.
router.get('/departments/salary/:id', (req, res) => {

    const sql = `
    SELECT
        department.name AS department,
        SUM(role.salary) AS 'utilized budget'

    FROM employee

    LEFT JOIN (role, department)
        ON (role.id = employee.role_id AND department.id = role.department_id)

    WHERE department_id = ?
    ;`

    const params = [req.params.id];

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

router.post('/department', ({body}, res) => {

    const errors = inputCheck(body, 'name');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `
    INSERT INTO department (name)
        VALUES (?)
    `;

    const params = [body.name]

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

router.delete('/department/:id', (req, res) => {

    const sql = `
    DELETE

    FROM department

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