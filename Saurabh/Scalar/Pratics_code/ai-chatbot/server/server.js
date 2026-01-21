import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());
 
app.get("/api/config", (_req, res) => {
  res.json({
    title: process.env.APP_TITLE || "WeatherInfo AI Chatbot",
  });
});


// ✅ Check if message is about weather
function isWeatherQuery(message) {
  return /weather|temperature|temp|forecast/i.test(message);
}

// ✅ Extract city from message
function extractCity(message) {
  // Match "in <city>", "weather <city>", "temp <city>", "temperature <city>" for e.g Temperature in Paris
  // const regex = /(?:in|weather|temp|temperature)\s+'in'+([a-zA-Z\s]+)/i;
  const match = message.match(/\bin\s+([a-zA-Z\s]+)\b/i);
  // const match = message.match(regex);
  // if (!match) return null;
  if (match && match[1]) {
    // Remove trailing punctuation
    return match[1].trim().replace(/[?.,!]/g, "");
  }
  return "London"; // default
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


// ✅ Get weather info
async function getWeather(message) {
  const city = extractCity(message);
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.WEATHER_API_KEY}&units=metric`;

  const response = await fetch(url);
  const data = await response.json();
  const localTimestamp = (data.dt + data.timezone) * 1000;
  const time = formatTime(localTimestamp);
  //const time=new Date().toLocaleTimeString();

  if (data.main) {
    return `The temperature in ${city} is ${data.main.temp}°C with ${data.weather[0].description}. Current time is ${time}.`;
  } else {
    return `Sorry, I couldn’t fetch the weather for ${city} right now.`;
  }
}

// ✅ Chat route
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    // 🧩 Weather query
    if (isWeatherQuery(userMessage)) {
      const weatherInfo = await getWeather(userMessage); // pass message here
      return res.json({ reply: weatherInfo }); // ✅ this return is inside the function
    }

    // 💬 AI Studio API fallback
    const aiResponse = await fetch(
      "https://aistudio.googleapis.com/v1/models/text-bison-001:generateText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.AISTUDIO_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: userMessage,
          temperature: 0.7,
          max_output_tokens: 512,
        }),
      }
    );

    const data = await aiResponse.json();
    const reply =
      data.candidates && data.candidates[0]?.content
        ? data.candidates[0].content
        : "Sorry, I couldn't generate a response.";

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));
