const router = require('express').Router();
const db = require('../../db/database');
const inputCheck = require('../../utils/inputCheck');


// id, title, salary, department_id
router.get('/roles', (req, res) => {
    const sql = `TABLE role`
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

// add role
router.post('/role', ({body}, res) => {

    const errors = inputCheck(body, 'title', 'salary', 'department_id');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `
    INSERT INTO role (title, salary, department_id)
        VALUES (?,?,?)
    `;

    const params = [body.title, body.salary, body.department_id]

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

// delete role
router.delete('/role/:id', (req, res) => {

    const sql = `
    DELETE

    FROM role

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