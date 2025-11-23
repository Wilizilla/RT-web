// função para get na raiz do site (requisição e resposta)
exports.productSearch = (req, res, next) => {
    res.render('index');  // aqui vai o nome do template que deve ser renderizado
    next;
};
