const express = require('express');
const axios = require('axios');

const app = express();
const port = 8080;

app.get('/vehiculo', async (req, res) => {
    const { placa } = req.query;

    // Validación de parámetro "placa"
    if (!placa) {
        return res.json({ error: 'Falta el parámetro "placa" o es inválido.' });
    }

    if (placa.length !== 6 && placa.length !== 7) {
        return res.json({ error: 'La longitud de la placa debe ser de 6 o 7 caracteres.' });
    }

    if (!/^[a-zA-Z0-9]+$/.test(placa)) {
        return res.json({ error: 'La placa solo debe contener caracteres alfanuméricos.' });
    }

    // Configuración del request
    const url = `https://servicios.axiscloud.ec/CRV/paginas/datosVehiculo.jsp?empresa=05&identidad=${placa}`;

    try {
        const response = await axios.post(url, {}, {
            headers: {
                'Referer': 'servicios.axiscloud.ec',
                'Host': 'servicios.axiscloud.ec',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Origin': 'https://servicios.axiscloud.ec',
                'Cookie': 'JSESSIONID=99B35E452049A1A64409390378C88E4B.wrkPortalWeb01'
            }
        });

        // Detección de encoding y conversión a UTF-8
        const responseData = response.data;
        let response_utf8 = responseData;
        if (Buffer.isBuffer(responseData)) {
            response_utf8 = responseData.toString('utf8');
        }

        res.send(response_utf8);
    } catch (error) {
        res.json({ error: `Error en la solicitud: ${error.message}` });
    }
});

// Escuchar en todas las interfaces (0.0.0.0)
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor corriendo en todas las interfaces en el puerto ${port}`);
});
