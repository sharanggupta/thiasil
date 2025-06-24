import { useCallback, useState } from 'react';

export function useAdminBackups({ setMessage, loadProducts, username, password }) {
  const [backups, setBackups] = useState([]);
  const [selectedBackup, setSelectedBackup] = useState("");
  const [isBackupLoading, setIsBackupLoading] = useState(false);

  // Load backups
  const loadBackups = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/backup-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          password: password,
          action: 'list_backups'
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setBackups(data.backups || []);
      } else {
        setMessage && setMessage('Failed to load backups');
      }
    } catch (error) {
      setMessage && setMessage('Error loading backups');
    }
  }, [setMessage, username, password]);

  // Restore backup
  const restoreBackup = useCallback(async () => {
    if (!selectedBackup) {
      setMessage('Please select a backup file to restore');
      return;
    }
    if (!confirm(`Are you sure you want to restore from backup: ${selectedBackup}? This will overwrite current data.`)) {
      return;
    }
    setIsBackupLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/backup-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          password: password,
          action: 'restore',
          backupFile: selectedBackup
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        loadProducts && loadProducts();
        loadBackups();
        setSelectedBackup("");
      } else {
        setMessage(data.error || 'Failed to restore backup');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setIsBackupLoading(false);
    }
  }, [selectedBackup, setMessage, loadProducts, loadBackups, username, password]);

  // Reset to default
  const resetToDefault = useCallback(async () => {
    if (!confirm('Are you sure you want to reset to default products? This will overwrite all current data and cannot be undone.')) {
      return;
    }
    setIsBackupLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/backup-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          password: password,
          action: 'reset'
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        loadProducts && loadProducts();
        loadBackups();
      } else {
        setMessage(data.error || 'Failed to reset to default');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setIsBackupLoading(false);
    }
  }, [setMessage, loadProducts, loadBackups, username, password]);

  // Cleanup backups
  const cleanupBackups = useCallback(async () => {
    if (!confirm('This will delete old backups, keeping only the 10 most recent ones. Continue?')) {
      return;
    }
    setIsBackupLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/backup-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          password: password,
          action: 'cleanup_backups'
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        loadBackups();
      } else {
        setMessage(data.error || 'Failed to cleanup backups');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setIsBackupLoading(false);
    }
  }, [setMessage, loadBackups, username, password]);

  // Delete backup
  const deleteBackup = useCallback(async (backupFile) => {
    if (!confirm(`Are you sure you want to delete backup: ${backupFile}?`)) {
      return;
    }
    setIsBackupLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/backup-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          password: password,
          action: 'delete_backup',
          backupFile
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        loadBackups();
      } else {
        setMessage(data.error || 'Failed to delete backup');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setIsBackupLoading(false);
    }
  }, [setMessage, loadBackups, username, password]);

  return {
    backups,
    setBackups,
    selectedBackup,
    setSelectedBackup,
    isBackupLoading,
    setIsBackupLoading,
    loadBackups,
    restoreBackup,
    resetToDefault,
    cleanupBackups,
    deleteBackup
  };
} 