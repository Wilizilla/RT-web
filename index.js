const express = require ('express');
const app = express();
const port = 3303; // a porta normal seria 3000

app.listen (3303, (error) => {
    if(error) {
        console.log("Erro: servidor offline")
        return;
    }
    console.log("Sucesso: servidor online");
})