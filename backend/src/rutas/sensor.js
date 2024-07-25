const express = require('express');
const router = express.Router();
const SensorData = require('../modelos/sensorSchema');
const { verifyToken} = require('./authMiddleware');

router.post('/datos', async (req, res) => {
    const { temperatura, humedad, amoniaco,monoxidoCarbono, humo} = req.body;
    const nuevoDato = new SensorData({ temperatura, humedad, amoniaco,monoxidoCarbono, humo});
    try {
        await nuevoDato.save();
        res.status(201).send('Datos guardados correctamente');
    } catch (error) {
        res.status(400).send('Error al guardar los datos');
    }
});

router.get('/',verifyToken, async (req, res) => {
    try {
        const datos = await SensorData.find();
        res.json(datos);
    } catch (error) {
        res.status(500).send('Error al obtener los datos');
    }
});

router.get('/temperatura-horaria',verifyToken, async (req, res) => {
    try {
        const resultados = await SensorData.aggregate([
            {
                $group: {
                    _id: {
                        año: { $year: "$fecha" },
                        mes: { $month: "$fecha" },
                        día: { $dayOfMonth: "$fecha" },
                        hora: { $hour: "$fecha" }
                    },
                    temperaturaPromedio: { $avg: "$temperatura" }
                }
            },
            {
                $sort: { "_id.año": 1, "_id.mes": 1, "_id.día": 1, "_id.hora": 1 }
            }
        ]);
        res.json(resultados);
    } catch (error) {
        res.status(500).send('Error al obtener los datos');
    }
});

router.get('/humedad-horaria',verifyToken, async (req, res) => {
    try {
        const resultados = await SensorData.aggregate([
            {
                $group: {
                    _id: {
                        año: { $year: "$fecha" },
                        mes: { $month: "$fecha" },
                        día: { $dayOfMonth: "$fecha" },
                        hora: { $hour: "$fecha" }
                    },
                    humedadPromedio: { $avg: "$humedad" }
                }
            },
            {
                $sort: { "_id.año": 1, "_id.mes": 1, "_id.día": 1, "_id.hora": 1 }
            }
        ]);
        res.json(resultados);
    } catch (error) {
        res.status(500).send('Error al obtener los datos de humedad');
    }
});


router.get('/amoniaco-horario',verifyToken, async (req, res) => {
    try {
        const resultados = await SensorData.aggregate([
            {
                $group: {
                    _id: {
                        año: { $year: "$fecha" },
                        mes: { $month: "$fecha" },
                        día: { $dayOfMonth: "$fecha" },
                        hora: { $hour: "$fecha" }
                    },
                    amoniacoPromedio: { $avg: "$amoniaco" }
                }
            },
            {
                $sort: { "_id.año": 1, "_id.mes": 1, "_id.día": 1, "_id.hora": 1 }
            }
        ]);
        res.json(resultados);
    } catch (error) {
        res.status(500).send('Error al obtener los datos de amoniaco');
    }
});


router.get('/humo-horario',verifyToken, async (req, res) => {
    try {
        const resultados = await SensorData.aggregate([
            {
                $group: {
                    _id: {
                        año: { $year: "$fecha" },
                        mes: { $month: "$fecha" },
                        día: { $dayOfMonth: "$fecha" },
                        hora: { $hour: "$fecha" }
                    },
                    humoPromedio: { $avg: "$humo" }
                }
            },
            {
                $sort: { "_id.año": 1, "_id.mes": 1, "_id.día": 1, "_id.hora": 1 }
            }
        ]);
        res.json(resultados);
    } catch (error) {
        res.status(500).send('Error al obtener los datos de humo');
    }
});


router.get('/monoxido-carbono-horario',verifyToken, async (req, res) => {
    try {
        const resultados = await SensorData.aggregate([
            {
                $group: {
                    _id: {
                        año: { $year: "$fecha" },
                        mes: { $month: "$fecha" },
                        día: { $dayOfMonth: "$fecha" },
                        hora: { $hour: "$fecha" }
                    },
                    monoxidoCarbonoPromedio: { $avg: "$monoxidoCarbono" }
                }
            },
            {
                $sort: { "_id.año": 1, "_id.mes": 1, "_id.día": 1, "_id.hora": 1 }
            }
        ]);
        res.json(resultados);
    } catch (error) {
        res.status(500).send('Error al obtener los datos de monóxido de carbono');
    }
});

module.exports = router;