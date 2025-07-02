import { useCallback, useEffect, useState } from 'react';
import { sanitizeInput } from '../validation';

const SESSION_TIMEOUT = 30 * 60 * 1000;
const LOCKOUT_DURATION = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

interface AdminSessionState {
  isAuthenticated: boolean;
  username: string;
  setUsername: (username: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loginAttempts: number;
  isLocked: boolean;
  lockTimeRemaining: number;
  message: string;
  setMessage: (message: string) => void;
  isLoading: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  handleLogin: (e?: React.FormEvent) => Promise<boolean>;
  handleLogout: () => void;
  setIsLoading: (loading: boolean) => void;
}

export function useAdminSession(): AdminSessionState {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);
  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const session = localStorage.getItem('adminSession');
    if (session) {
      const { timestamp, username: savedUsername, password: savedPassword } = JSON.parse(session);
      const now = Date.now();
      if (now - timestamp < SESSION_TIMEOUT) {
        setIsAuthenticated(true);
        setUsername(savedUsername);
        setPassword(savedPassword);
        startSessionTimer();
      } else {
        localStorage.removeItem('adminSession');
      }
    }
    // eslint-disable-next-line
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearSessionTimer();
    // eslint-disable-next-line
  }, [sessionTimer]);

  const startSessionTimer = useCallback(() => {
    const timer = setTimeout(() => {
      handleLogout();
      setMessage("Session expired. Please login again.");
    }, SESSION_TIMEOUT);
    setSessionTimer(timer);
  }, []);

  const clearSessionTimer = useCallback(() => {
    if (sessionTimer) {
      clearTimeout(sessionTimer);
      setSessionTimer(null);
    }
  }, [sessionTimer]);

  const handleLogin = useCallback(async (e: React.FormEvent<Element>): Promise<boolean> => {
    e.preventDefault();
    if (isLocked) {
      setMessage("Account is temporarily locked. Please try again later.");
      return false;
    }
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedPassword = sanitizeInput(password);
    if (!sanitizedUsername || !sanitizedPassword) {
      setMessage("Please enter both username and password.");
      return false;
    }
    setIsLoading(true);
    setMessage("");
    try {
      const response = await fetch('/api/admin/update-prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: sanitizedUsername,
          password: sanitizedPassword,
          category: 'all',
          priceChangePercent: 0
        }),
      });
      if (response.status === 401) {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        if (newAttempts >= MAX_ATTEMPTS) {
          setIsLocked(true);
          setTimeout(() => {
            setIsLocked(false);
            setLoginAttempts(0);
          }, LOCKOUT_DURATION);
          setMessage("Too many failed attempts. Account locked for 15 minutes.");
        } else {
          setMessage(`Invalid credentials. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`);
        }
        return false;
      } else if (response.ok) {
        setIsAuthenticated(true);
        setLoginAttempts(0);
        setIsLocked(false);
        setUsername(sanitizedUsername);
        setPassword(sanitizedPassword);
        const session = {
          timestamp: Date.now(),
          username: sanitizedUsername,
          password: sanitizedPassword
        };
        localStorage.setItem('adminSession', JSON.stringify(session));
        startSessionTimer();
        return true;
      } else {
        const data = await response.json();
        setMessage(data.error || "Login failed");
        return false;
      }
    } catch (error) {
      console.error('Error during login:', error);
      setMessage("Network error. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [username, password, isLocked, loginAttempts, startSessionTimer]);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
    setLoginAttempts(0);
    setIsLocked(false);
    clearSessionTimer();
    localStorage.removeItem('adminSession');
  }, [clearSessionTimer]);

  return {
    isAuthenticated,
    username,
    setUsername,
    password,
    setPassword,
    loginAttempts,
    isLocked,
    lockTimeRemaining,
    message,
    setMessage,
    isLoading,
    setIsLoading,
    handleLogin,
    handleLogout,
    setIsAuthenticated
  };
} 