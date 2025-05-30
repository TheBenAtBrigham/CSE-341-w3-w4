const isAuthenticated = (req, res, next) => {
    if (req.session.user === undefined || eq.session.user === null) {
        return res.status(401).json('You do not have access.');
    }
    next();
};

module.exports = {
    isAuthenticated
};