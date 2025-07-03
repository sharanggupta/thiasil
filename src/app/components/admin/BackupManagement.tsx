"use client";
import { GlassButton, GlassCard, GlassContainer } from "@/app/components/Glassmorphism";

export default function BackupManagement({
  backups,
  selectedBackup,
  setSelectedBackup,
  isBackupLoading,
  restoreBackup,
  resetToDefault,
  cleanupBackups,
  deleteBackup,
  analyzeImages,
  cleanupImages,
  imageAnalysis
}) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
        <span>💾</span>
        Backup Management
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <GlassContainer>
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
        </GlassContainer>

        <GlassContainer>
          <h3 className="text-xl font-bold text-white mb-4">Image Management</h3>
          <div className="space-y-4">
            <GlassButton
              onClick={analyzeImages}
              variant="info"
              size="large"
              className="w-full"
              disabled={isBackupLoading}
            >
              {isBackupLoading ? (
                <span>Analyzing...</span>
              ) : (
                <>
                  <span>Analyze Images</span>
                  <span>🔍</span>
                </>
              )}
            </GlassButton>
            
            <GlassButton
              onClick={cleanupImages}
              variant="warning"
              size="large"
              className="w-full"
              disabled={isBackupLoading || !imageAnalysis?.unusedCount}
            >
              {isBackupLoading ? (
                <span>Cleaning...</span>
              ) : (
                <>
                  <span>Cleanup Unused Images</span>
                  <span>🖼️</span>
                </>
              )}
            </GlassButton>

            {imageAnalysis && (
              <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="text-sm text-white/80 space-y-1">
                  <p><strong>Total Images:</strong> {imageAnalysis.totalImages}</p>
                  <p><strong>Referenced:</strong> {imageAnalysis.referencedCount}</p>
                  <p><strong>Unused:</strong> {imageAnalysis.unusedCount}</p>
                  {imageAnalysis.unusedCount > 0 && (
                    <p><strong>Potential Savings:</strong> {imageAnalysis.savings.kb}KB</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </GlassContainer>

        <GlassContainer>
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
        </GlassContainer>
      </div>

      <GlassContainer padding="small">
        <h4 className="text-lg font-semibold text-white mb-3">Backup Information</h4>
        <div className="space-y-2 text-sm text-white/80">
          <p>• <strong>Auto-backup:</strong> Backups are automatically created before any changes</p>
          <p>• <strong>Restore:</strong> Select a backup and click &quot;Restore Backup&quot; (includes automatic image cleanup)</p>
          <p>• <strong>Reset:</strong> Reset to the original default product data</p>
          <p>• <strong>Cleanup:</strong> Automatically removes old backups, keeping only the last 10</p>
          <p>• <strong>Manual Delete:</strong> Click the trash icon to delete specific backups</p>
          <p>• <strong>Image Analysis:</strong> Scans for unused images and calculates potential savings</p>
          <p>• <strong>Image Cleanup:</strong> Removes unused images to free up storage space</p>
        </div>
      </GlassContainer>
    </div>
  );
}