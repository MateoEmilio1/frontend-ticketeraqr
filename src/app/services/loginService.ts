const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/['"]/g, "");

export const loginUsuario = async (email: string, password: string) => {
  const res = await fetch(`${baseUrl}/api/usuarios/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mail: email, contraseña: password }),
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Credenciales inválidas");
  }

  const json = await res.json();
  return json;
};

export const logoutUsuario = async () => {
  const res = await fetch(`${baseUrl}/api/usuarios/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Error al cerrar sesión");
  }

  const json = await res.json();
  return json;
};

export const checkSession = async () => {
  const res = await fetch(`${baseUrl}/api/usuarios/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("No hay sesión activa");
  }

  const json = await res.json();
  return json;
};
