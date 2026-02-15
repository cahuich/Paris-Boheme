import React from 'react'

const Home = () => {
  return (
    <div>
      {/* Root container */}
      <div id="root-container">

        {/* Ejemplo: sección principal */}
        <section className="p-8">
          <h1 className="text-4xl font-bold mb-4">Bienvenido a mi sitio</h1>
          <p className="text-lg">
            Este contenido viene del bloque HTML de Emergent.
          </p>

          {/* Imagen de ejemplo */}
          <img
            src="./assets/images/logo.png"
            alt="Logo"
            className="mt-4 w-32 h-32"
          />
        </section>

        {/* Badge Emergent adaptado */}
        <a
          id="emergent-badge"
          target="_blank"
          rel="noopener noreferrer"
          href="https://app.emergent.sh/?utm_source=emergent-badge"
          className="inline-flex items-center gap-2 fixed bottom-4 right-4 px-3 py-2 bg-black text-white rounded-full z-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M15.5702 8.13142C15.7729 8.0412 16.0007 8.18878 15.9892 8.4103C15.8374 11.3192 14.0965 14.0405 11.2531 15.3065C8.40964 16.5725 5.2224 16.0453 2.95912 14.2117C2.78676 14.072 2.82955 13.804 3.03219 13.7137L4.95677 12.8568C5.04866 12.8159 5.15446 12.823 5.24204 12.8725C6.73377 1
