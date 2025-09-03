// server.js
import express from "express";
import cors from "cors";
import axios from "axios";
import * as cheerio from "cheerio";


const app = express();
const PORT = 5000;

app.use(cors());

app.get("/yatri-news", async (req, res) => {
  try {
    const { data } = await axios.get("https://yatrirailways.com/live-railway-announcements");
    const $ = cheerio.load(data);
    const announcements = [];

    $(".card-box").each((_, el) => {
      const title = $(el).find(".text-capitalize.font-weight-bold").text().trim();
      const time = $(el).find(".text-capitalize.text-warning").text().trim();
      const detail = $(el).find(".font-14.text-capitalize.font-weight-normal").text().trim();

      announcements.push({ title, time, detail });
    });

    res.json({ announcements });
  } catch (err) {
    console.error("Scraper error:", err);
    res.json({ announcements: [] });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
