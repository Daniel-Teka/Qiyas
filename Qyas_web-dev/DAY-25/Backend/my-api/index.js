const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running smoothly index!');
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
