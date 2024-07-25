const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
    temperatura: Number,
    humedad: Number,
    amoniaco: Number,
    monoxidoCarbono: Number,
    humo: Number,
    fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SensorData', sensorDataSchema);