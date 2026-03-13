// Central API endpoint helper
// Use VITE_API_URL when set (production deployment URL), else fallback intelligently.
// For devices not on the same machine, local "localhost" is wrong.

const computeApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;

  if (envUrl) {
    return envUrl;
  }

  // Fallback to the known production backend URL
  // This ensures other devices (phones, tablets) connect to the deployed backend
  // instead of trying to hit localhost or their own local IP.
  return "https://attendance-system-9nt4.onrender.com";
};

export const API_URL = computeApiUrl();
