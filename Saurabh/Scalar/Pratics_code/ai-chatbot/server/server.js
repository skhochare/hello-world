import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// ---------- HELPERS ----------

function isWeatherQuery(message) {
  return /weather|temperature|temp|forecast/i.test(message);
}

function isPopulationQuery(message) {
  return /population|people|how many people|citizens/i.test(message);
}

function extractCity(message) {
  return message
    .toLowerCase()
    .replace(/population|people|how many people|citizens|temp|temperature|weather|forecast|of|in|is|what|the|\?/gi, "")
    .replace(/[^a-z\s]/gi, "")
    .trim()
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleString("en-IN", {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

// ---------- WEATHER ----------

async function getWeather(message) {
  const cityText = extractCity(message);
  if (!cityText) return "Please specify a city name.";

  const attempts = [cityText, `${cityText},US`, `${cityText},IN`, `${cityText},GB`];

  for (const city of attempts) {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${process.env.WEATHER_API_KEY}&units=metric`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.cod === 200) {
        const localTimestamp  = (data.dt + data.timezone) * 1000;
        const time = formatTime(localTimestamp);
        return `The temperature in ${data.name} is ${data.main.temp}°C with ${data.weather[0].description}. Current time is ${time}.`;
      }
    } catch {}
  }

  return "Sorry, I couldn’t fetch the weather right now.";
}

// ---------- POPULATION ----------

async function getCityPopulation(cityText) {
  const city = cityText.split(" ")[0];

  const query = `
    SELECT ?population WHERE {
      ?city rdfs:label "${city}"@en.
      ?city wdt:P1082 ?population.
    } LIMIT 1
  `;

  const url = `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(query)}`;

  const res = await fetch(url, {
    headers: { "User-Agent": "city-population-bot" },
  });

  const data = await res.json();
  const population = data?.results?.bindings?.[0]?.population?.value;

  if (!population) {
    return `Sorry, I couldn’t find population data for ${cityText}.`;
  }

  return `The population of ${cityText} is approximately ${Number(population).toLocaleString()}.`;
}

// ---------- CHAT ROUTE ----------

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    if (isWeatherQuery(userMessage)) {
      return res.json({ reply: await getWeather(userMessage) });
    }

    if (isPopulationQuery(userMessage)) {
      const city = extractCity(userMessage);
      if (!city) {
        return res.json({ reply: "Please specify a city name." });
      }
      return res.json({ reply: await getCityPopulation(city) });
    }

    // Gemini fallback
    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }],
        }),
      }
    );

     const data = await aiResponse.json();
    // const reply =
    //   data?.candidates?.[0]?.content?.parts?.map(p => p.text).join("") ||
    //   "Hi! How can I help you?";
    // 🔍 Always log while debugging
    console.log("🧠 RAW GEMINI RESPONSE:", JSON.stringify(data, null, 2));

    let reply = "Sorry, I couldn't generate a response.";

    if (data?.candidates?.length > 0) {
      const candidate = data.candidates[0];

      if (candidate.content?.parts?.length > 0) {
        reply = candidate.content.parts
          .map(p => p.text)
          .join("");
      } else if (candidate.output) {
        reply = candidate.output;
      }
    }

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ---------- START ----------

app.listen(5000, () => console.log("✅ Server running on port 5000"));