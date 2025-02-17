// Sarkar-MD
import express from "express";
import axios from "axios";

const app = express();
const port = process.env.PORT || 3000;

// Set EJS as the view engine
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Home Route
app.get("/", (req, res) => {
  res.render("index", { video: null, error: null });
});

// Video Download Route
app.post("/download", async (req, res) => {
  const videoUrl = req.body.videoUrl;
  const apiUrl = `https://api.davidcyriltech.my.id/download/tiktok?url=${videoUrl}`;

  try {
    const response = await axios.get(apiUrl);
    const videoData = response.data;

    // Checking if response is valid
    if (videoData.success && videoData.result) {
      res.render("index", { video: videoData.result, error: null });
    } else {
      res.render("index", { video: null, error: "Invalid or unsupported TikTok video link." });
    }
  } catch (error) {
    console.error("API Error:", error.message);
    res.render("index", { video: null, error: "Server error. Try again later!" });
  }
});

// Force Download Route
app.get("/force-download", async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).send("Invalid video URL.");
  }

  try {
    const response = await axios({
      url: videoUrl,
      method: "GET",
      responseType: "stream",
    });

    res.setHeader("Content-Disposition", 'attachment; filename="tiktok_video.mp4"');
    res.setHeader("Content-Type", "video/mp4");

    response.data.pipe(res);
  } catch (error) {
    console.error("Download Error:", error.message);
    res.status(500).send("Error downloading the video.");
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
// POWERED BY BANDAHEALI
