import { useCallback, useEffect, useState } from 'react';
import { APP_CONFIG, ERROR_MESSAGES } from '../constants';
import { clearSession, isSessionValid, saveSession } from '../session';
import { sanitizeInput } from '../validation';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [sessionTimer, setSessionTimer] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const session = localStorage.getItem('adminSession');
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        if (isSessionValid(sessionData)) {
          setIsAuthenticated(true);
          setUsername(sessionData.username);
          startSessionTimer();
        } else {
          clearSession();
        }
      } catch (error) {
        console.error('Error parsing session:', error);
        clearSession();
      }
    }
  }, []);

  // Session timer management
  const startSessionTimer = useCallback(() => {
    const timer = setTimeout(() => {
      handleLogout();
      setMessage(ERROR_MESSAGES.SESSION_EXPIRED);
    }, APP_CONFIG.SESSION_TIMEOUT);
    setSessionTimer(timer);
  }, []);

  const clearSessionTimer = useCallback(() => {
    if (sessionTimer) {
      clearTimeout(sessionTimer);
      setSessionTimer(null);
    }
  }, [sessionTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearSessionTimer();
  }, [clearSessionTimer]);

  const handleLogin = useCallback(async (e) => {
    e?.preventDefault();
    
    if (isLocked) {
      setMessage(ERROR_MESSAGES.ACCOUNT_LOCKED);
      return false;
    }

    const sanitizedUsername = sanitizeInput(username);
    const sanitizedPassword = sanitizeInput(password);

    if (!sanitizedUsername || !sanitizedPassword) {
      setMessage('Please enter both username and password.');
      return false;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/update-prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: sanitizedUsername,
          password: sanitizedPassword,
          category: 'all',
          priceChangePercent: 0 // Just for authentication
        }),
      });

      if (response.status === 401) {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        
        if (newAttempts >= APP_CONFIG.MAX_LOGIN_ATTEMPTS) {
          setIsLocked(true);
          setTimeout(() => {
            setIsLocked(false);
            setLoginAttempts(0);
          }, APP_CONFIG.LOCKOUT_DURATION);
          setMessage(ERROR_MESSAGES.TOO_MANY_ATTEMPTS);
        } else {
          setMessage(ERROR_MESSAGES.LOGIN_FAILED);
        }
        return false;
      } else if (response.ok) {
        setIsAuthenticated(true);
        setLoginAttempts(0);
        setIsLocked(false);
        
        // Save session
        saveSession(sanitizedUsername, sanitizedPassword);
        startSessionTimer();
        
        return true;
      } else {
        setMessage(ERROR_MESSAGES.LOGIN_FAILED);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage(ERROR_MESSAGES.NETWORK_ERROR);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [username, password, loginAttempts, isLocked, startSessionTimer]);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setMessage('');
    clearSession();
    clearSessionTimer();
  }, [clearSessionTimer]);

  return {
    // State
    isAuthenticated,
    username,
    password,
    loginAttempts,
    isLocked,
    isLoading,
    message,
    
    // Actions
    setUsername,
    setPassword,
    setMessage,
    handleLogin,
    handleLogout,
  };
}; 