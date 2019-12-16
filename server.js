const express = require("express");
const connectDB = require("./config/db");
const app = express();

const PORT = process.env.PORT || 5000;

// Database Connection
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
  res.json({ msg: "Hi there PostMan!" });
});

// Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/contacts", require("./routes/contacts"));

app.listen(PORT, () => {
  console.log(`Server is correctly running on PORT ${PORT}`);
});
