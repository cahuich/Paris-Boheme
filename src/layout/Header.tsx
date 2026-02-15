import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white shadow p-4">
      <nav className="space-x-4">
        <Link to="/" className="text-blue-600 hover:underline">
          Inicio
        </Link>
        <Link to="/articles" className="text-blue-600 hover:underline">
          Artículos
        </Link>
      </nav>
    </header>
  );
}
