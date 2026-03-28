import { Request, Response } from "express";
import cron, { ScheduledTask } from "node-cron";
import https from "https";

// Settings
const MINUTES_DELTA = 1;

// replace this with your real Render backend URL
const URL = "https://jewelry-rest-api.onrender.com/api/";

let counter = 0;
let task: ScheduledTask;

/**
 * Ping the deployed server
 */
function pingServer() {
  https.get(URL, () => {
    counter -= MINUTES_DELTA;
    console.log("Pinged the server");
    console.log("Minutes left:", counter);
  }).on("error", (err) => {
    console.log("Ping failed:", err.message);
  });
}

/**
 * Stop the cron task
 */
function stopPingingServer() {
  if (task) {
    task.stop();
    console.log("Stopped the cron job due to inactivity");
  }
}

/**
 * Stop and clear any scheduled tasks
 */
function cleanUpTasks() {
  for (const task of cron.getTasks().values()) {
    task.stop();
  }
  cron.getTasks().clear();
}

/**
 * Start cron job
 * Example: /api/dev/start-cron/60
 */
export async function startCron(req: Request, res: Response) {
  try {
    cleanUpTasks();

    const cronPattern = "*/" + MINUTES_DELTA + " * * * *";
    const totalDuration = parseInt(req.params.duration as string) || 60;

    counter = totalDuration;
  task = cron.schedule(cronPattern, pingServer);
    task.start();

    setTimeout(stopPingingServer, totalDuration * 60 * 1000);

    res.status(200).send("Started background task (duration: " + totalDuration + " mins)");
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).send("Failed to start cron job");
  }
}

/**
 * Stop cron job manually
 */
export async function stopCron(req: Request, res: Response) {
  try {
    cleanUpTasks();
    res.status(200).send("Stopped background task");
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).send("Failed to stop cron job");
  }
}