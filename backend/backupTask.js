const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const dbConfig = {
  user: process.env.DB_USER, 
  password: process.env.DB_PASS, 
  database: process.env.DB_NAME,
  backupDir: path.join(process.cwd(), 'backups')
};

/**
 * Professional Backup Function
 * Periodically exports the database to ensure data integrity for CEMAC users.
 */
const performBackup = () => {
  if (!fs.existsSync(dbConfig.backupDir)) {
    fs.mkdirSync(dbConfig.backupDir);
  }

  const fileName = `finguard_backup_${new Date().toISOString().split('T')[0]}.sql`;
  const filePath = path.join(dbConfig.backupDir, fileName);
  // Command to dump the SQL data - Fixed for Windows
  const mysqldumpPath = process.env.MYSQL_DUMP_PATH;
  const password = dbConfig.password ? `-p${dbConfig.password}` : '';
  const dumpCommand = `"${mysqldumpPath}" -u ${dbConfig.user} ${password} ${dbConfig.database} > "${filePath}"`;

  exec(dumpCommand, { shell: true }, (error, stdout, stderr) => {
    if (error) {
      console.error(`[Backup Error]: ${error.message}`);
      return;
    }
    console.log(`[Backup Success]: Saved to ${fileName}`);
  });
};

cron.schedule('0 0 * * *', () => {
  console.log('Running daily database backup...');
  performBackup();
});

module.exports = performBackup;