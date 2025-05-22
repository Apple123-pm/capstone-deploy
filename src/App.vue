<template>
  <div id="app">
    <h1>ข้อมูลจากฐานข้อมูล</h1>
    <section>
      <h1>Factory 4.0</h1>
      <h2>Station: {{ firstname }}</h2>
      <h3>Station: {{ name }}</h3>
    </section>
    <ul>
      <li v-for="(item, index) in items" :key="index">
        No: {{ item.No }}
        Date: {{ item.date }} 
        Timestamp: {{ item.timestamp }} 
        Cycle Time: {{ item.cycletime }} sec
        
      </li>
    </ul>
    <ul>
      <li v-for="(item, index) in items" :key="index">
        No: {{ item.No }}
        Date: {{ item.date }} 
        Timestamp: {{ item.timestamp }} 
        Cycle Time: {{ item.cycletime }} sec
        
      </li>
    </ul>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "App",
  data() {
    return {
      items: [], // Data fetched from the database
      firstname: "Station_1", // Station name
    };
  },
  
  created() {
    // Fetch data from the Node.js backend
    axios
    .get("http://localhost:3000/fetchall") // เปลี่ยนจาก .post เป็น .get
    .then((response) => {
      this.items = response.data; // Store the fetched data in items
      console.log("✅ Data fetched:", this.items); // เพิ่ม Log เช็กข้อมูล
    })
    .catch((error) => {
      console.error("❌ Error fetching data:", error);
    });

  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #00ff1a;
  margin-top: 60px;
}
section {
  padding: 20px;
  background-color: #e61010;
}
ul {
  padding: 20px;
  background-color: #f9fbfc;
  list-style: none;
}
li {
  font-size: 1.2rem;
  color: #971c1c;
}
h1 {
  font-size: 2rem;
  color: #010d15;
}

table td, table th {
  text-align: center;     /* จัดกลางแนวนอน */
  vertical-align: middle; /* จัดกลางแนวตั้ง */
}

.col-No { width: 5%; }
.col-Date { width: 10%; }
.col-Timestamp { width: 10%; }
.col-Cycle { width: 5%; }

</style>