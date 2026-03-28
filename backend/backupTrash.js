const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const backupDir = path.join(process.cwd(), 'backups');
const maxBackupAgeDays = 7; // Keep backups for 7 days

/**
 * Clean up old backup files
 * Deletes backups older than maxBackupAgeDays
 */
const cleanupOldBackups = () => {
  if (!fs.existsSync(backupDir)) {
    console.log('📁 Backup directory does not exist yet.');
    return;
  }

  try {
    const now = Date.now();
    const files = fs.readdirSync(backupDir);

    files.forEach(file => {
      const filePath = path.join(backupDir, file);
      const stats = fs.statSync(filePath);
      const fileAgeMs = now - stats.mtimeMs;
      const fileAgeDays = fileAgeMs / (1000 * 60 * 60 * 24);

      if (fileAgeDays > maxBackupAgeDays) {
        fs.unlinkSync(filePath);
        console.log(`🗑️ Deleted old backup: ${file} (${fileAgeDays.toFixed(1)} days old)`);
      }
    });
  } catch (error) {
    console.error("❌ Cleanup Error:", error.message);
  }
};

// Run cleanup daily at 1 AM (after backup at midnight)
cron.schedule('0 1 * * *', () => {
  console.log('🧹 Running backup cleanup...');
  cleanupOldBackups();
});

module.exports = cleanupOldBackups;
