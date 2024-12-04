const express = require('express');
const controller = require('../controllers/controller');
const { verifyToken } = require('../auth/auth');
const router = express.Router();

const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.token;
        const decoded = verifyToken(token);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).send('Unauthorized');
    }
};


router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/logout', controller.logout);


router.post('/addTodo', authMiddleware, controller.addTodo);
router.get('/getTodos', authMiddleware, controller.getTodos);
router.post('/updateTodo', authMiddleware, controller.updateTodo);
router.post('/deleteTodo', authMiddleware, controller.deleteTodo);

module.exports = router;
