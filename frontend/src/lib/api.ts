const API_BASE = "https://tu-backend.vercel.app/api";

export async function getArticles() {
  const res = await fetch(`${API_BASE}/articles`);
  return res.json();
}

export async function getCategories() {
  const res = await fetch(`${API_BASE}/categories`);
  return res.json();
}

export const api = { getArticles, getCategories };
