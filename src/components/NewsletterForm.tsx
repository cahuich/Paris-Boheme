import React, { useState, FormEvent } from "react";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface NewsletterFormProps {
  variant?: "default" | "footer";
}


const API_BASE =
  import.meta.env.VITE_BACKEND_URL ||
  process.env.REACT_APP_BACKEND_URL ||
  "https://paris-boheme-api.onrender.com";

const API = `${API_BASE}/api`;

/* Regex simple pero correcta para email */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const NewsletterForm: React.FC<NewsletterFormProps> = ({
  variant = "default",
}) => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [subscribed, setSubscribed] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  const [website, setWebsite] = useState("");

    e.preventDefault();

    if (!emailRegex.test(email)) {
      toast.error("Por favor ingresa un email válido");
      return;
    }

    setLoading(true);

    try {
      await api.post("/newsletter/subscribe", { email });

      setSubscribed(true);
      setEmail("");

      toast.success(
        "¡Gracias por suscribirte! Recibirás nuestras novedades sobre París."
      );
    } catch (err) {
      const error = err as AxiosError;

      if (error.response?.status === 400) {
        toast.error("Este email ya está suscrito a nuestra newsletter");
      } else {
        toast.error("Hubo un error. Por favor intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= SUCCESS STATE ================= */

  if (subscribed) {
    return (
      <div
        data-testid="newsletter-success"
        className={`flex items-center gap-3 ${
          variant === "footer" ? "text-white" : "text-[#1A2B4C]"
        }`}
      >
        <CheckCircle className="w-6 h-6 text-green-500" />
        <span className="font-medium">¡Gracias por suscribirte!</span>
      </div>
    );
  }

  /* ================= FOOTER VARIANT ================= */

  if (variant === "footer") {
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="email"
              placeholder="Tu correo electrónico"
              data-testid="newsletter-email-footer"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-[#C5A059] focus:ring-[#C5A059]"
              disabled={loading}
              required
            />
          </div>
{/* Honeypot anti-bot */}
   <input
    type="text"
    name="website"
    value={website}
    onChange={(e) => setWebsite(e.target.value)}
    className="hidden"
    tabIndex={-1}
    autoComplete="off"
/>

          <button
            type="submit"
            data-testid="newsletter-submit-footer"
            disabled={loading}
            className="px-4 py-2 bg-[#C5A059] hover:bg-[#D4AF69] text-white rounded-md font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Suscribir"
            )}
          </button>
        </div>

        <p className="text-gray-400 text-xs">
          Recibe consejos de viaje y novedades sobre París
        </p>
      </form>
    );
  }

  /* ================= DEFAULT VARIANT ================= */

  return (
    <div
      data-testid="newsletter-section"
      className="bg-[#F2EFE9] rounded-2xl p-8 md:p-12"
    >
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 bg-[#C5A059]/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-[#C5A059]" />
        </div>

        <h3 className="font-['Playfair_Display'] text-2xl md:text-3xl font-semibold text-[#1A1A1A] mb-3">
          Suscríbete a nuestra Newsletter
        </h3>

        <p className="text-[#666] mb-6">
          Recibe los mejores consejos de viaje, guías exclusivas y novedades
          sobre París directamente en tu correo.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <div className="relative flex-1">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
            <Input
              type="email"
              placeholder="tucorreo@ejemplo.com"
              data-testid="newsletter-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-12 h-12 bg-white border-[#E5E5E5] focus:border-[#C5A059] focus:ring-[#C5A059]"
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            data-testid="newsletter-submit"
            disabled={loading}
            className="h-12 px-8 bg-[#1A2B4C] hover:bg-[#2C3E50] text-white rounded-md font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Enviando...</span>
              </>
            ) : (
              "Suscribirme"
            )}
          </button>
        </form>

        <p className="text-[#999] text-sm mt-4">
          Sin spam. Puedes cancelar cuando quieras.
        </p>
      </div>
    </div>
  );
};
