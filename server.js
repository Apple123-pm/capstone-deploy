require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
const port = process.env.PORT || 3000;


const mqtt = require("mqtt");

let a = 0;
let b = 0;

const client = mqtt.connect(process.env.MQTT_HOST, {
  port: parseInt(process.env.MQTT_PORT, 10),
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD
});

client.on('connect', () => {
  console.log('✅ Connected to HiveMQ');
  client.subscribe(['order', 'complete'], (err) => {
    if (err) console.error('❌ Subscribe failed');
  });
});

client.on('message', (topic, message) => {
  const payload = message.toString().trim().toLowerCase();

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
});

app.use(cors());
app.use(bodyParser.json());

// ใช้ createPool แทน createConnection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to the database.");
    connection.release(); // ปล่อย Connection กลับเข้า Pool
  }
});

const fetchStationData = (stationName) => (req, res) => {
  const query = `SELECT * FROM ${stationName} ORDER BY No DESC`;

  db.getConnection((err, connection) => {
    if (err) {
      console.error("❌ Database connection error:", err);
      return res.status(500).json({ error: "Database connection failed" });
    }

    connection.query(query, (err, results) => {
      connection.release();
      if (err) {
        console.error(`❌ Error fetching data from ${stationName}:`, err);
        return res.status(500).json({ error: `Database query failed for ${stationName}` });
      }
      res.json(results);
    });
  });
};

// เพิ่ม API สำหรับแต่ละ Station
app.get("/", (req, res) => {
  res.send(`
    <h2>✅ Capstone API is running!</h2>
    <ul>
      <li><a href="/api/a-value">/api/a-value</a></li>
      <li><a href="/station1_CONWIP">/station1_CONWIP</a></li>
      <li><a href="/available-dates">/available-dates</a></li>
    </ul>
  `);
});
app.get("/station_1_MRP", fetchStationData("Station_1_MRP"));
app.get("/station2_MRP", fetchStationData("Station_2_MRP"));
app.get("/station3_MRP", fetchStationData("Station_3_MRP"));
app.get("/station4_MRP_NG", fetchStationData("Station_4_NG_MRP"));
app.get("/station4_MRP_OK", fetchStationData("Station_4_OK_MRP"));
app.get("/station5_MRP", fetchStationData("Station_5_MRP"));
app.get("/station1_CONWIP", fetchStationData("Station_1"));
app.get("/station2_CONWIP", fetchStationData("Station_2"));
app.get("/station3_CONWIP", fetchStationData("Station_3"));
app.get("/station4_CONWIP_NG", fetchStationData("Station_4_NG"));
app.get("/station4_CONWIP_OK", fetchStationData("Station_4_OK"));
app.get("/station5_CONWIP", fetchStationData("Station_5"));
app.get('/api/a-value', (req, res) => {
  res.json({ aValue: a });
});

app.get('/api/b-value', (req, res) => {
  res.json({ bValue: b });
});


// ตัวอย่าง Express API
app.get("/available-dates", async (req, res) => {
    const [rows] = await db.promise().query(`
      SELECT DISTINCT DATE(timestamp) AS date
      FROM Station_1
      ORDER BY date DESC
`);

    const dates = rows.map(r => r.date.toISOString().slice(0, 10));
    res.json(dates);
});











// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});




// API ดึงข้อมูลจาก Station_1
// app.get("/fetchall", (req, res) => {
  // const query = "SELECT * FROM Station_1 ORDER BY No DESC";

  // db.getConnection((err, connection) => {
    // if (err) {
      // console.error("❌ Database connection error:", err);
      // return res.status(500).json({ error: "Database connection failed" });
    // }

    // connection.query(query, (err, results) => {
      // connection.release(); // ✅ ปล่อย Connection หลังใช้งานเสร็จ
      // if (err) {
        // console.error("❌ Error fetching data:", err);
        // return res.status(500).json({ error: "Database query failed" });
      // }
      // res.json(results);
    // });
  // });
// });

// Generic function สำหรับดึงข้อมูลจากตาราง