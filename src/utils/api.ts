export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenFromCookie()}`,
    },
  });

  if (!res.ok) throw new Error("Request failed");
  return res.json();
};

// contoh ambil token dari localStorage (kalau bukan cookie)
function getTokenFromCookie() {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/token=([^;]+)/);
  return match ? match[1] : "";
}
