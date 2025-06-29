"use client";
import { GlassButton, GlassCard } from "../Glassmorphism";

export default function BackupManagement({
  backups,
  selectedBackup,
  setSelectedBackup,
  isBackupLoading,
  restoreBackup,
  resetToDefault,
  cleanupBackups,
  deleteBackup
}) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
        <span>💾</span>
        Backup Management
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/5 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Backup Actions</h3>
          <div className="space-y-4">
            <GlassButton
              onClick={restoreBackup}
              variant="accent"
              size="large"
              className="w-full"
              disabled={isBackupLoading || !selectedBackup}
            >
              {isBackupLoading ? (
                <span>Restoring...</span>
              ) : (
                <>
                  <span>Restore Backup</span>
                  <span>↩️</span>
                </>
              )}
            </GlassButton>
            
            <GlassButton
              onClick={resetToDefault}
              variant="secondary"
              size="large"
              className="w-full"
              disabled={isBackupLoading}
            >
              {isBackupLoading ? (
                <span>Resetting...</span>
              ) : (
                <>
                  <span>Reset to Default</span>
                  <span>🔄</span>
                </>
              )}
            </GlassButton>
            
            <GlassButton
              onClick={cleanupBackups}
              variant="secondary"
              size="large"
              className="w-full"
              disabled={isBackupLoading}
            >
              {isBackupLoading ? (
                <span>Cleaning...</span>
              ) : (
                <>
                  <span>Cleanup Old Backups</span>
                  <span>🧹</span>
                </>
              )}
            </GlassButton>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Available Backups</h3>
          {backups.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {backups.map((backup) => (
                <div
                  key={backup.filename}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedBackup === backup.filename
                      ? 'bg-[#3a8fff]/20 border-[#3a8fff]'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => setSelectedBackup(backup.filename)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white truncate">
                        {backup.filename}
                      </div>
                      <div className="text-xs text-white/60">
                        {new Date(backup.created).toLocaleString()} • {(backup.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                    <GlassButton
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteBackup(backup.filename);
                      }}
                      variant="secondary"
                      size="small"
                      disabled={isBackupLoading}
                    >
                      <span>🗑️</span>
                    </GlassButton>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-white/60 py-8">
              <div className="text-4xl mb-2">💾</div>
              <p>No backups available</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-4">
        <h4 className="text-lg font-semibold text-white mb-3">Backup Information</h4>
        <div className="space-y-2 text-sm text-white/80">
          <p>• <strong>Auto-backup:</strong> Backups are automatically created before any changes</p>
          <p>• <strong>Restore:</strong> Select a backup and click "Restore Backup" to revert changes</p>
          <p>• <strong>Reset:</strong> Reset to the original default product data</p>
          <p>• <strong>Cleanup:</strong> Automatically removes old backups, keeping only the last 10</p>
          <p>• <strong>Manual Delete:</strong> Click the trash icon to delete specific backups</p>
        </div>
      </div>
    </div>
  );
}