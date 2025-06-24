export const saveSession = (username, password) => {
  const session = {
    timestamp: Date.now(),
    username,
    password,
  };
  localStorage.setItem('adminSession', JSON.stringify(session));
};

export const clearSession = () => {
  localStorage.removeItem('adminSession');
};

export const isSessionValid = (session) => {
  if (!session) return false;
  const { timestamp } = session;
  const now = Date.now();
  const timeout = 30 * 60 * 1000; // 30 minutes
  return now - timestamp < timeout;
}; 