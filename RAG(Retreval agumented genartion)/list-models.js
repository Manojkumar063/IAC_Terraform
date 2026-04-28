import "dotenv/config";

const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
);
const data = await res.json();

console.log("\n✅ Models supporting embedContent:");
data.models
  ?.filter(m => m.supportedGenerationMethods?.includes("embedContent"))
  .forEach(m => console.log(" -", m.name));

console.log("\n📋 All available models:");
data.models?.forEach(m => console.log(" -", m.name, "|", m.supportedGenerationMethods?.join(", ")));
