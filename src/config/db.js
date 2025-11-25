// src/config/db.js

// Importa o módulo mysql2 para trabalhar com o MySQL
const mysql = require('mysql2/promise');
// Importa o módulo dotenv para carregar as variáveis de ambiente
require('dotenv').config();

// Configurações de conexão (idealmente carregadas de um arquivo .env para segurança)
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root', // Substitua pelo seu usuário
    password: process.env.DB_PASSWORD || 'sua_senha', // Substitua pela sua senha
    database: process.env.DB_DATABASE || 'db_estoque2', // O nome do banco de dados que você criou
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Cria um pool de conexões. É mais eficiente do que criar uma nova conexão a cada requisição.
const pool = mysql.createPool(dbConfig);

console.log(`Conectado ao banco de dados: ${dbConfig.database} em ${dbConfig.host}`);

// Exporta o pool para ser usado pelos Models
module.exports = pool;