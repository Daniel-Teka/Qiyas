const cron = require("node-cron");
const fs = require("fs");

// Schedule a task to run every minute
cron.schedule("* * * * *", () => {
  const currentTime = new Date().toISOString();
  const logMessage = `Server checked at: ${currentTime}\n`;

  // Append the log message to the file
  fs.appendFile("server.log.txt", logMessage, (err) => {
    if (err) {
      console.error("Failed to write to log file:", err);
    } else {
      console.log("Log updated successfully.");
    }
  });
});

console.log("ክሮን ጆብ ጀምሯል")፤