const router = require('express').Router();

router.use('/', require('./swagger'));
router.get('/', (req, res) => {
    //#swagger.tags=['こんにちは、世界！']
    res.send('こんにちは、世界！');
});

router.use('/users', require('./users'));
router.use('/products', require('./products'));

module.exports = router;