// middleware global, todas requisições do site passam por ela

module.exports = (req, res, next) => {
    console.log('Middleware Global: teste');
    next ();
};