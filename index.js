// index.js (backend Node.js)

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware para leer JSON
app.use(express.json());

// Servir archivos estáticos desde /public
app.use(express.static('public'));

// Ruta POST para recibir la fecha y actualizar contador.txt
app.post('/api/contar', (req, res) => {
    const { fechaFormateada } = req.body;
    const filePath = path.join(__dirname, 'contador.txt');

    fs.readFile(filePath, 'utf8', (err, data) => {
        let lineas = data ? data.split('\n') : [];
        let encontrada = false;

        const nuevasLineas = lineas.map(linea => {
            if (linea.startsWith(fechaFormateada)) {
                encontrada = true;
                const partes = linea.split(':');
                const contador = parseInt(partes[1].trim(), 10) + 1;
                return `${fechaFormateada}: ${contador}`;
            }
            return linea;
        });

        if (!encontrada) {
            nuevasLineas.push(`${fechaFormateada}: 1`);
        }

        fs.writeFile(filePath, nuevasLineas.join('\n'), 'utf8', err => {
            if (err) return res.status(500).send("Error al escribir el archivo.");
            res.send("Contador actualizado.");
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
});
