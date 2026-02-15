const Contact = () => {
  return (
    <section id="contact" className="py-16 text-center">
      <h2 className="text-3xl font-bold mb-6">Contacto</h2>

      <form className="max-w-md mx-auto space-y-4">
        <input
          type="text"
          placeholder="Nombre"
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded"
        >
          Enviar
        </button>
      </form>
    </section>
  )
}

export default Contact
