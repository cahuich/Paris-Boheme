import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Habilitar CORS solo para el frontend en Vercel
app.use(cors({
  origin: "https://paris-boheme.vercel.app"
}));

app.use(express.json());

// Rutas de ejemplo
app.get("/api/featured-articles", (_, res) => {
  res.json([
    { id: 1, title: "Artículo Destacado 1", summary: "Resumen 1" },
    { id: 2, title: "Artículo Destacado 2", summary: "Resumen 2" }
  ]);
});

app.get("/api/articles", (_, res) => {
  res.json([
    { id: 1, title: "Artículo 1", summary: "Resumen A" },
    { id: 2, title: "Artículo 2", summary: "Resumen B" }
  ]);
});

app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});
