const router = require('express').Router();
const passport = require('passport');

router.use('/', require('./swagger'));
router.use('/users', require('./users'));
router.use('/products', require('./products'));

/*router.get('/', (req, res) => {
    //#swagger.tags=['こんにちは、世界！']
    res.send('こんにちは、世界！');
});*/

router.get('/login', passport.authenticate('github'), (req, res) => {});

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;