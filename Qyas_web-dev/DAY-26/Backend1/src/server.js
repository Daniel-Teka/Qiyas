const express = require("express"); // ይህን መኖሩን ያረጋግጡ
const mongoose = require("mongoose");
require("dotenv").config();

const app = express(); // 1. Express አፕሊኬሽን ይፍጠሩ
app.use(express.json()); // 2. JSON መረጃዎችን ለመቀበል ይሄ አስፈላጊ ነው

// የ Routes ፋይሉን ያስገቡ
const userRoutes = require("./src/routes/userRoutes");
app.use("/", userRoutes); // አድራሻው http://localhost:5000/register እንዲሆን

// ዳታቤዝ ማገናኛ
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("ዳታቤዝ ተገናኝቷል!"))
  .catch((err) => console.log(err));

// 3. አገልጋዩን (Server) ማሰራት
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
