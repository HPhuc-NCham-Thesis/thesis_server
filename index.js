const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const loadRDFFile = require('./config/db');
const cors = require('cors');

const PORT = 3000;
(async () => {
  try {
      const store = await loadRDFFile();
      app.locals.store = store;  // Lưu store vào app.locals để có thể truy cập từ mọi nơi trong app

      app.use(cors());

      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));

      // Sử dụng router được định nghĩa trong router.js
      require("./routers/index")(app);

      app.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}`);
      });
  } catch (error) {
      console.error("Failed to load RDF data:", error);
      process.exit(1); // Thoát nếu không thể nạp dữ liệu RDF
  }
})();

module.exports = app;
