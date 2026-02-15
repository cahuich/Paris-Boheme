const { execSync } = require("child_process");
const fs = require("fs");

// Detectar entorno
const isVercel = process.env.VERCEL === "1";

// Configurar basename automáticamente
let basename = "/";
if (isVercel) {
  basename = "/";
  console.log("Deploy en Vercel, basename:", basename);
} else {
  // GH Pages
  const repoName = require("./package.json").name;
  basename = `/${repoName}`;
  console.log("Deploy en GitHub Pages, basename:", basename);
}

// Crear .env.production temporal
fs.writeFileSync(
  "./.env.production",
  `VITE_BACKEND_URL=${process.env.VITE_BACKEND_URL || "https://tu-backend.vercel.app"}\nREACT_APP_BASENAME=${basename}`
);

// Build
console.log("Generando build...");
execSync("npm run build", { stdio: "inherit" });

// Deploy
if (isVercel) {
  console.log("Deploy en Vercel listo. Sube automáticamente desde Vercel Dashboard.");
} else {
  console.log("Deploy en GitHub Pages...");
  execSync("npx gh-pages -d dist -b gh-pages", { stdio: "inherit" });
  console.log("Deploy en GitHub Pages completado.");
}

// Limpiar .env.production temporal
fs.unlinkSync("./.env.production");
