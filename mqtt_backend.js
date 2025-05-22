const mqtt = require('mqtt');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

let latestData = null;
let a = 0;
let b = 0;

const client = mqtt.connect('mqtts://c2fc8627c3e04cbabc2a46e56ffabf92.s1.eu.hivemq.cloud', {
  port: 8883,
  username: 'CapstoneG04',
  password: 'CapstoneG04'
});

client.on('connect', () => {
  console.log('✅ Connected to HiveMQ');

  // Subscribe ครอบคลุมทั้ง order และ station5/asrs/token
  client.subscribe(['order', 'station5/asrs/token'], (err) => {
    if (err) console.error('❌ Subscribe failed');
    else console.log('📡 Subscribed to topics: order, station5/asrs/token');
  });
});

client.on('message', (topic, message) => {
  const payload = message.toString().trim().toLowerCase();

  try {
    latestData = {
      topic,
      data: JSON.parse(payload),
      aValue: a,
      bValue: b,
      status: 'JSON',
      time: new Date().toISOString()
    };
    console.log('📥 Received JSON:', latestData);
  } catch (e) {
    console.log('📥 Received message:', payload);

    if (payload === 'order') {
      a += 1;
      b += 1;
      console.log(`🟢 Order received. a = ${a}, b = ${b}`);
    } else if (payload === 'complete') {
      a = Math.max(0, a - 1);
      console.log(`🔵 Complete received. a = ${a}, b = ${b}`);
    } else {
      console.log(`❓ Unknown message: ${payload}`);
    }

    latestData = {
      topic,
      data: payload,
      aValue: a,
      bValue: b,
      status: payload === 'order' ? 'Ordered' : payload === 'complete' ? 'Completed' : 'Unknown',
      time: new Date().toISOString()
    };
  }

  client.publish('station5/response', JSON.stringify({ a, b }));
});

client.on('error', (err) => {
  console.error('❌ MQTT connection error:', err);
});

app.get('/api/data', (req, res) => {
  if (latestData) {
    res.json(latestData);
  } else {
    res.status(204).send('No data yet');
  }
});

app.get('/api/a-value', (req, res) => {
  res.json({ aValue: a });
});

app.get('/api/b-value', (req, res) => {
  res.json({ bValue: b });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});


  
  

  