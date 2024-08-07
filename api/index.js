const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const loadRDFFile = require("../config/db");
const cors = require("cors");

const PORT = 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Learning Analytics Platform"));

// Sử dụng router được định nghĩa trong router.js
require("../routers/index")(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

(async () => {
  try {
    const store = await loadRDFFile();
    app.locals.store = store; // Lưu store vào app.locals để có thể truy cập từ mọi nơi trong app
  } catch (error) {
    console.error("Failed to load RDF data:", error);
    process.exit(1); // Thoát nếu không thể nạp dữ liệu RDF
  }
})();

module.exports = app;
