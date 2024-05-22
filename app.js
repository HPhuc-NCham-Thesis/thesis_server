const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const rdfRoutes = require('./routers/rdfRouter');
const loadRDFFile = require('./config/db');

app.use(bodyParser.json());
app.use('/api', rdfRoutes);

const PORT = process.env.PORT || 3000;

loadRDFFile();

app.use((req, res) => {
  return res.json({
      message: "Not Found"
  })
})
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
