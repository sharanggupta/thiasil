import { useCallback, useState, useEffect } from 'react';
import { useAdminApi, AdminCredentials, ADMIN_ENDPOINTS, ADMIN_ACTIONS } from './useAdminApi';
import { useApiGet } from './useApi';

// Types
interface Backup {
  filename: string;
  size: string;
  date: string;
  type: 'manual' | 'automatic';
  status: 'completed' | 'in_progress' | 'failed';
  description?: string;
}

interface LoadingStates {
  loading: boolean;
  creating: boolean;
  restoring: boolean;
  deleting: boolean;
  downloading: boolean;
  uploading: boolean;
}

interface BackupProgress {
  operation: 'create' | 'restore' | 'upload' | null;
  progress: number;
  message: string;
}

interface UseAdminBackupsResult {
  // Data
  backups: Backup[];
  
  // Loading States
  isLoading: boolean;
  isCreating: boolean;
  isRestoring: boolean;
  isDeleting: boolean;
  isDownloading: boolean;
  isUploading: boolean;
  loadingStates: LoadingStates;
  
  // Progress Tracking
  progress: BackupProgress;
  
  // Error Handling
  error: any;
  hasError: boolean;
  
  // File Upload
  selectedBackupFile: File | null;
  
  // Statistics
  totalBackups: number;
  totalBackupSize: string;
  lastBackupDate: string | null;
  oldestBackupDate: string | null;
  
  // Actions
  loadBackups: () => Promise<void>;
  createBackup: (description?: string) => Promise<boolean>;
  restoreBackup: (filename: string) => Promise<boolean>;
  deleteBackup: (filename: string) => Promise<boolean>;
  downloadBackup: (filename: string) => Promise<boolean>;
  uploadAndRestoreBackup: (file: File) => Promise<boolean>;
  bulkDeleteBackups: (filenames: string[]) => Promise<boolean>;
  
  // File Management
  handleBackupFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearSelectedFile: () => void;
  
  // Utilities
  getBackupByFilename: (filename: string) => Backup | undefined;
  getBackupsByType: (type: 'manual' | 'automatic') => Backup[];
  getOldBackups: (days: number) => Backup[];
  formatBackupSize: (backups: Backup[]) => string;
  
  // Error Recovery
  retry: () => Promise<void>;
  clearError: () => void;
}

// Initial states
const initialLoadingStates: LoadingStates = {
  loading: false,
  creating: false,
  restoring: false,
  deleting: false,
  downloading: false,
  uploading: false
};

const initialProgress: BackupProgress = {
  operation: null,
  progress: 0,
  message: ''
};

export function useAdminBackups(
  credentials: AdminCredentials,
  setMessage?: (message: string) => void
): UseAdminBackupsResult {
  // Data fetching with enhanced error handling - NO immediate loading
  const {
    data: backupsData,
    isLoading: isLoadingBackups,
    error: loadError,
    execute: refetchBackups,
    retry: retryLoad
  } = useApiGet<Backup[]>('/api/admin/backup-management', {
    immediate: false, // Never load automatically
    cacheKey: 'admin_backups_data',
    retryAttempts: 3,
    retryDelay: 2000,
    onError: (error) => {
      setMessage?.(`Failed to load backups: ${error.message}`);
    }
  });

  // Admin API hooks for backup operations
  const backupOperationsApi = useAdminApi({
    endpoint: ADMIN_ENDPOINTS.BACKUP_MANAGEMENT,
    method: 'POST',
    retryAttempts: 1, // Backup operations are usually one-time
    retryDelay: 3000,
    onSuccess: (data) => {
      setMessage?.(data?.message || 'Operation completed successfully!');
      refetchBackups();
    },
    onError: (error) => {
      setMessage?.(`Backup operation failed: ${error.details?.error || error.message}`);
    }
  });

  // Local state
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loadingStates, setLoadingStates] = useState<LoadingStates>(initialLoadingStates);
  const [progress, setProgress] = useState<BackupProgress>(initialProgress);
  const [selectedBackupFile, setSelectedBackupFile] = useState<File | null>(null);

  // Manual loading only - remove automatic triggers

  // Update backups when data is loaded
  useEffect(() => {
    if (backupsData) {
      setBackups(Array.isArray(backupsData) ? backupsData : []);
    }
  }, [backupsData]);

  // Computed values
  const totalBackups = backups.length;
  const sortedBackups = [...backups].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const lastBackupDate = sortedBackups.length > 0 ? sortedBackups[0].date : null;
  const oldestBackupDate = sortedBackups.length > 0 ? sortedBackups[sortedBackups.length - 1].date : null;

  // Helper functions
  const parseBackupSize = (size: string): number => {
    const match = size.match(/(\d+(?:\.\d+)?)\s*(KB|MB|GB)/i);
    if (!match) return 0;
    
    const value = parseFloat(match[1]);
    const unit = match[2].toUpperCase();
    
    switch (unit) {
      case 'GB': return value * 1024 * 1024 * 1024;
      case 'MB': return value * 1024 * 1024;
      case 'KB': return value * 1024;
      default: return value;
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalBackupSize = formatBytes(
    backups.reduce((total, backup) => total + parseBackupSize(backup.size), 0)
  );

  // Utility functions (defined early for use in actions)
  const getBackupByFilename = useCallback((filename: string): Backup | undefined => {
    return backups.find(backup => backup.filename === filename);
  }, [backups]);

  // Progress simulation for long operations
  const simulateProgress = useCallback((operation: 'create' | 'restore' | 'upload', duration: number = 5000) => {
    setProgress({ operation, progress: 0, message: `Starting ${operation}...` });
    
    const steps = 20;
    const interval = duration / steps;
    let currentStep = 0;
    
    const progressInterval = setInterval(() => {
      currentStep++;
      const progressPercent = (currentStep / steps) * 100;
      
      setProgress(prev => ({
        ...prev,
        progress: Math.min(progressPercent, 95), // Never show 100% until actually complete
        message: getProgressMessage(operation, progressPercent)
      }));
      
      if (currentStep >= steps) {
        clearInterval(progressInterval);
      }
    }, interval);
    
    return () => clearInterval(progressInterval);
  }, []);

  const getProgressMessage = (operation: string, progress: number): string => {
    if (progress < 20) return `Initializing ${operation}...`;
    if (progress < 40) return `Processing data...`;
    if (progress < 60) return `${operation === 'create' ? 'Creating' : operation === 'restore' ? 'Restoring' : 'Uploading'} backup...`;
    if (progress < 80) return `Finalizing ${operation}...`;
    return `Almost complete...`;
  };

  // Enhanced Actions
  const loadBackups = useCallback(async () => {
    setLoadingStates(prev => ({ ...prev, loading: true }));
    try {
      await refetchBackups();
    } finally {
      setLoadingStates(prev => ({ ...prev, loading: false }));
    }
  }, [refetchBackups]);

  const createBackup = useCallback(async (description?: string): Promise<boolean> => {
    setLoadingStates(prev => ({ ...prev, creating: true }));
    const clearProgress = simulateProgress('create', 8000);
    
    // Optimistic update - add backup immediately to UI
    const now = new Date();
    const optimisticBackup: Backup = {
      filename: `manual_backup_${now.getTime()}.json`,
      size: 'Calculating...',
      date: now.toISOString(),
      type: 'manual',
      status: 'in_progress',
      description: description || `Manual backup created on ${now.toLocaleDateString()}`
    };

    setBackups(prev => [optimisticBackup, ...prev]);
    
    try {
      await backupOperationsApi.executeAsAdmin(credentials, {
        action: ADMIN_ACTIONS.CREATE_BACKUP,
        description: description || `Manual backup created on ${new Date().toLocaleDateString()}`
      });
      
      setProgress({ operation: null, progress: 100, message: 'Backup created successfully!' });
      setTimeout(() => setProgress(initialProgress), 2000);
      clearProgress();
      
      // Update the optimistic backup to completed status
      setBackups(prev => prev.map(backup => 
        backup.filename === optimisticBackup.filename 
          ? { ...backup, status: 'completed' as const, size: 'Unknown' }
          : backup
      ));
      
      // Refetch to get real backup data
      setTimeout(() => refetchBackups(), 1000);
      return true;
    } catch (error) {
      clearProgress();
      setProgress(initialProgress);
      // Remove the optimistic backup on error
      setBackups(prev => prev.filter(b => b.filename !== optimisticBackup.filename));
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, creating: false }));
    }
  }, [backupOperationsApi, credentials, simulateProgress, refetchBackups]);

  const restoreBackup = useCallback(async (filename: string): Promise<boolean> => {
    setLoadingStates(prev => ({ ...prev, restoring: true }));
    const clearProgress = simulateProgress('restore', 10000);
    
    try {
      await backupOperationsApi.executeAsAdmin(credentials, {
        action: ADMIN_ACTIONS.RESTORE_BACKUP,
        filename
      });
      
      setProgress({ operation: null, progress: 100, message: 'Backup restored successfully!' });
      setTimeout(() => setProgress(initialProgress), 2000);
      clearProgress();
      return true;
    } catch (error) {
      clearProgress();
      setProgress(initialProgress);
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, restoring: false }));
    }
  }, [backupOperationsApi, credentials, simulateProgress]);

  const deleteBackup = useCallback(async (filename: string): Promise<boolean> => {
    // Store the backup for potential rollback
    const backupToDelete = getBackupByFilename(filename);
    if (!backupToDelete) return false;

    // Optimistic update - remove backup immediately from UI
    setBackups(prev => prev.filter(b => b.filename !== filename));
    setLoadingStates(prev => ({ ...prev, deleting: true }));
    
    try {
      await backupOperationsApi.executeAsAdmin(credentials, {
        action: ADMIN_ACTIONS.DELETE_BACKUP,
        filename
      });
      // Success - no need to refetch, optimistic update was correct
      return true;
    } catch (error) {
      // Rollback optimistic update on error
      setBackups(prev => [...prev, backupToDelete]);
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, deleting: false }));
    }
  }, [backupOperationsApi, credentials, getBackupByFilename]);

  const downloadBackup = useCallback(async (filename: string): Promise<boolean> => {
    setLoadingStates(prev => ({ ...prev, downloading: true }));
    
    try {
      // Create download request
      const response = await fetch('/api/admin/backup-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
          action: 'download_backup',
          filename
        }),
      });

      if (response.ok) {
        // Handle file download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        setMessage?.('Backup downloaded successfully!');
        return true;
      } else {
        const data = await response.json();
        setMessage?.(data.error || 'Failed to download backup');
        return false;
      }
    } catch (error) {
      setMessage?.('Network error. Please try again.');
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, downloading: false }));
    }
  }, [credentials, setMessage]);

  const uploadAndRestoreBackup = useCallback(async (file: File): Promise<boolean> => {
    if (!file) return false;

    setLoadingStates(prev => ({ ...prev, uploading: true }));
    const clearProgress = simulateProgress('upload', 12000);
    
    try {
      const formData = new FormData();
      formData.append('backup', file);
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);
      formData.append('action', 'upload_and_restore');

      const response = await fetch('/api/admin/backup-management', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProgress({ operation: null, progress: 100, message: 'Backup uploaded and restored successfully!' });
        setTimeout(() => setProgress(initialProgress), 2000);
        setMessage?.(data.message || 'Backup uploaded and restored successfully!');
        await refetchBackups();
        clearProgress();
        return true;
      } else {
        const data = await response.json();
        setMessage?.(data.error || 'Failed to upload and restore backup');
        clearProgress();
        setProgress(initialProgress);
        return false;
      }
    } catch (error) {
      setMessage?.('Network error. Please try again.');
      clearProgress();
      setProgress(initialProgress);
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, uploading: false }));
      setSelectedBackupFile(null);
    }
  }, [credentials, setMessage, refetchBackups, simulateProgress]);

  const bulkDeleteBackups = useCallback(async (filenames: string[]): Promise<boolean> => {
    // Store backups for potential rollback
    const backupsToDelete = filenames.map(filename => getBackupByFilename(filename)).filter(Boolean) as Backup[];
    
    // Optimistic update - remove all backups immediately from UI
    setBackups(prev => prev.filter(b => !filenames.includes(b.filename)));
    setLoadingStates(prev => ({ ...prev, deleting: true }));
    
    try {
      const deletePromises = filenames.map(filename => 
        backupOperationsApi.executeAsAdmin(credentials, {
          action: ADMIN_ACTIONS.DELETE_BACKUP,
          filename
        })
      );
      
      await Promise.all(deletePromises);
      setMessage?.(`Successfully deleted ${filenames.length} backups`);
      // Success - no need to rollback, optimistic update was correct
      return true;
    } catch (error) {
      // Rollback optimistic update on error
      setBackups(prev => [...prev, ...backupsToDelete]);
      setMessage?.('Some backups failed to delete');
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, deleting: false }));
    }
  }, [backupOperationsApi, credentials, setMessage, getBackupByFilename]);

  // File management
  const handleBackupFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['.sql', '.zip', '.tar.gz', '.backup'];
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      
      if (!allowedTypes.some(type => file.name.toLowerCase().endsWith(type))) {
        setMessage?.('Invalid file type. Please select a .sql, .zip, .tar.gz, or .backup file.');
        return;
      }
      
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        setMessage?.('File too large. Maximum size is 100MB.');
        return;
      }
      
      setSelectedBackupFile(file);
    }
  }, [setMessage]);

  const clearSelectedFile = useCallback(() => {
    setSelectedBackupFile(null);
  }, []);

  // Additional utility functions
  const getBackupsByType = useCallback((type: 'manual' | 'automatic'): Backup[] => {
    return backups.filter(backup => backup.type === type);
  }, [backups]);

  const getOldBackups = useCallback((days: number): Backup[] => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return backups.filter(backup => new Date(backup.date) < cutoffDate);
  }, [backups]);

  const formatBackupSize = useCallback((backupList: Backup[]): string => {
    const totalBytes = backupList.reduce((total, backup) => total + parseBackupSize(backup.size), 0);
    return formatBytes(totalBytes);
  }, []);

  // Error recovery
  const retry = useCallback(async () => {
    await retryLoad();
  }, [retryLoad]);

  const clearError = useCallback(() => {
    backupOperationsApi?.reset?.();
    setProgress(initialProgress);
  }, [backupOperationsApi]);

  // Combined error state
  const combinedError = loadError || backupOperationsApi?.error;
  const hasError = Boolean(combinedError);

  return {
    // Data
    backups,
    
    // Loading States
    isLoading: isLoadingBackups || loadingStates.loading,
    isCreating: loadingStates.creating,
    isRestoring: loadingStates.restoring,
    isDeleting: loadingStates.deleting,
    isDownloading: loadingStates.downloading,
    isUploading: loadingStates.uploading,
    loadingStates,
    
    // Progress Tracking
    progress,
    
    // Error Handling
    error: combinedError,
    hasError,
    
    // File Upload
    selectedBackupFile,
    
    // Statistics
    totalBackups,
    totalBackupSize,
    lastBackupDate,
    oldestBackupDate,
    
    // Actions
    loadBackups,
    createBackup,
    restoreBackup,
    deleteBackup,
    downloadBackup,
    uploadAndRestoreBackup,
    bulkDeleteBackups,
    
    // File Management
    handleBackupFileSelect,
    clearSelectedFile,
    
    // Utilities
    getBackupByFilename,
    getBackupsByType,
    getOldBackups,
    formatBackupSize,
    
    // Error Recovery
    retry,
    clearError
  };
}