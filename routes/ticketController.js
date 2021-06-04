const ticket = require('../controllers/ticket/lib.js');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const config = require('../config/config');

const authenticateJWT = (req, res, next) => {
    const token = req.session.token;

    if (token) {

        jwt.verify(token, config.secret, (err, user) => {
            if (err) {
                return res.status(200).render('account/login', {title: 'Connexion'});
            }

            req.user = user;
            next();
        });
    } else {
        res.status(200).render('account/login', {title: 'Connexion'});
    }
};

router.get('/create', authenticateJWT, ticket.createForm);
router.post('/create', authenticateJWT, ticket.create);
router.get('/:id', authenticateJWT, ticket.show);
router.get('/:id/edit', authenticateJWT, ticket.edit);
router.post('/:id/update', authenticateJWT, ticket.update);
router.get('/', authenticateJWT, ticket.list);

module.exports = router;