import { Builder, By, until, WebDriver } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import path from "path";
import fs from "fs";
import { Request, Response } from "express";
import { getCurrentDateTime } from "@/core/helpers/getCurrentDateTime";
import { off } from "process";

interface StatusObject {
  name: string;
  status: string;
  timestamp: string;
  onlinefor: string | null;
  offlineSince: string | null;
  lastSeen: string | null;
  timesOnline: number;
  firstSeen: Date | string | null;
  ts: any;
  lastSessionDuration: string | null;
}

let lastSessionDuration = 0;

let statusData: StatusObject[] = [];
let previousStatus: string | null = null;
let statusChangedAt: number | null = null;
let timesOnline: number = 0;
let firstSeen: Date | string | null = null;
let lastSeen: Date | string | null = null;
let totalOnlineDuration = 0;
let lastOnlineTimestamp = null;
let totalOfflineDuration = 0;
let lastOfflineTimestamp = null;
let ts = getCurrentDateTime().time;
const ITTERATION_DURATION = 2500;

async function writeStatusesToFile(statuses: StatusObject[]) {
  const fileContent = `
    export type StatusObject = {
      name: string;
      status: string;
      timestamp: string;
      onlinefor: string | null;
      offlineSince: string | null;
      lastSeen: string | null;
      timesOnline: number;
      firstSeen: Date | null;
      ts :any;
      lastSessionDuration: string | null;
    }

    export const statuses: StatusObject[] = ${JSON.stringify(
      statuses,
      null,
      2,
    )};
  `;
  fs.writeFile("statusData.ts", fileContent, (err) => {
    if (err) {
      console.error(
        "An error occurred while writing JSON object to file:",
        err,
      );
    } else {
      console.log("Data file has been saved.");
    }
  });
}

export default async (req: Request, res: Response): Promise<void> => {
  const time = getCurrentDateTime().time;
  const timestamp = time;

  try {
    const name: string =
      (req.query.name as string) || (process.env.WHATSAPP_NAME as string);
    if (!name) throw new Error("Name is required.");

    let options = new chrome.Options();
    const chromeProfilePath = path.resolve(
      __dirname,
      "../../../../../chromeprofile",
    );
    options.addArguments(`user-data-dir=${chromeProfilePath}`);

    let driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    try {
      console.log("Navigating to WhatsApp");
      await driver.get("https://web.whatsapp.com/");
      console.log("Successfully navigated to WhatsApp");

      while (true) {
        const time = getCurrentDateTime().time;
        const timestamp = time;
        try {
          console.log(`Finding and clicking element for ${name}`);
          let element = await driver.wait(
            until.elementLocated(
              By.xpath(`//span[contains(text(), '${name}')]`),
            ),
            ITTERATION_DURATION,
          );
          await element.click();

          console.log("Getting status");

          let currentStatus;
          try {
            await driver.findElement(By.xpath("//span[@title='Online']"));
            currentStatus = "Online";

            if (lastOnlineTimestamp) {
              const now = new Date();
              totalOnlineDuration += Math.floor(
                (now.getTime() - lastOnlineTimestamp.getTime()) / 1000,
              );
            }
            lastOnlineTimestamp = new Date();
          } catch (error) {
            currentStatus = "Offline";
            if (lastOfflineTimestamp) {
              const now = new Date();
              totalOfflineDuration += Math.floor(
                (now.getTime() - lastOfflineTimestamp.getTime()) / 1000,
              );
            }

            lastOfflineTimestamp = new Date();
          }

          if (previousStatus === "Offline" && currentStatus === "Online") {
            timesOnline++;
            totalOfflineDuration = 0;
            lastSessionDuration = totalOnlineDuration; // Update last session duration
          }

          if (previousStatus === "Online" && currentStatus === "Offline") {
            totalOnlineDuration = 0;
            lastSessionDuration = totalOfflineDuration; // Update last session duration
          }

          previousStatus = currentStatus;

          const statusObject: StatusObject = {
            name,
            status: currentStatus,
            timestamp: timestamp,
            onlinefor:
              currentStatus === "Online"
                ? `${totalOnlineDuration} seconds`
                : null,
            offlineSince:
              currentStatus === "Offline"
                ? `${totalOfflineDuration} seconds`
                : null,
            lastSeen: timestamp,
            timesOnline,
            firstSeen,
            ts,
            lastSessionDuration: `${lastSessionDuration} seconds`,
          };

          if (!firstSeen && currentStatus === "Online") {
            firstSeen = timestamp;
          }

          if (currentStatus === "Online") {
            statusObject.onlinefor = `${totalOnlineDuration} seconds`;
            statusObject.offlineSince = null;
          }

          statusData.push(statusObject);
          console.log(`Status for ${name}: ${statusObject.status}`);
          console.log(JSON.stringify(statusObject));

          writeStatusesToFile(statusData);

          await new Promise((resolve) =>
            setTimeout(resolve, ITTERATION_DURATION),
          );
        } catch (error) {
          console.error("An error occurred:", error);
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
      res.status(500).json({ error: error });
      console.error(`Sent 500 response due to error: ${error}`);
    } finally {
      if (driver) {
        await driver.quit();
      }
    }
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: error });
    console.error(`Sent 500 response due to error: ${error}`);
  }
};
