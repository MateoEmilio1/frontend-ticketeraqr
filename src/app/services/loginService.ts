const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const loginUsuario = async (email: string, password: string) => {
  const res = await fetch(`${baseUrl}/api/usuario/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mail: email, contraseña: password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Credenciales inválidas");
  }

  const json = await res.json();
  return json.data;
};
