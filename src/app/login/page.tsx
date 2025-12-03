"use client";

import { useState } from "react";
import { Book } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUsuario } from "@/app/services/loginService";
import { LoginForm, LoginData } from "@/app/components/loginForm";


export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (data: LoginData) => {
    setLoading(true);
    setError(null);
    try {
      const usuario = await loginUsuario(data.email, data.password);
      if (usuario) {
        router.push("/");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-2xl font-bold text-blue-600 hover:text-blue-700"
          >
            <Book className="w-8 h-8" />
            <span>Ticketera</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Inicia sesión en tu cuenta
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <LoginForm onSubmit={handleLogin} loading={loading} />
        </div>

        <div className="text-center text-sm text-gray-500">
          <Link
            href="/"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
