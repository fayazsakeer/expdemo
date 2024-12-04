const { User, Todo } = require('../models/model');
const { hashPassword, comparePassword } = require('../auth/auth');
const { generateToken, verifyToken } = require('../auth/auth');

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await hashPassword(password);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.redirect('/login.html');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (user && (await comparePassword(password, user.password))) {
            const token = generateToken(user._id);
            res.cookie('token', token, { httpOnly: true });
            res.redirect('/todo.html');
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        res.status(500).send('Error logging in');
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/login.html');
};

exports.addTodo = async (req, res) => {
    try {
        const token = req.cookies.token;
        const { userId } = verifyToken(token);

        const { task } = req.body;
        const newTodo = new Todo({
            userId,
            task,
        });
        await newTodo.save();
        res.redirect('/todo.html');
    } catch (error) {
        res.status(500).send('Error adding todo');
    }
};

exports.getTodos = async (req, res) => {
    try {
        const token = req.cookies.token;
        const { userId } = verifyToken(token);

        const todos = await Todo.find({ userId });
        res.json(todos);
    } catch (error) {
        res.status(500).send('Error fetching todos');
    }
};

exports.updateTodo = async (req, res) => {
    try {
        const { id, task, completed } = req.body;
        await Todo.findByIdAndUpdate(id, { task, completed });
        res.redirect('/todo.html');
    } catch (error) {
        res.status(500).send('Error updating todo');
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        const { id } = req.body;
        await Todo.findByIdAndDelete(id);
        res.redirect('/todo.html');
    } catch (error) {
        res.status(500).send('Error deleting todo');
    }
};
