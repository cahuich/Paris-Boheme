import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center p-4 space-x-4">
      <Link to="/" className="text-blue-600 hover:underline">
        Inicio
      </Link>
      <Link to="/articles" className="text-blue-600 hover:underline">
        Artículos
      </Link>
      <div className="mt-2">© 2026 Paris Boheme</div>
    </footer>
  );
}
