const express = require("express");
const urlRoute = require("./routes/url");
const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");
const dotenv = require("dotenv");


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

connectToMongoDB(process.env.MONGO_URI).then(() => {
  console.log("Connected to MongoDB");
});

app.use(express.json());

app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectUrl);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
