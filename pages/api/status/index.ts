import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import path from 'path';
import fs from 'fs';
import { Request, Response } from 'express';
import { getCurrentDateTime } from '@/core/helpers/getCurrentDateTime';

interface StatusObject {
  name: string;
  status: string;
  timestamp: string;
  onlinefor: string | null;
  offlineSince: string | null;
  lastSeen: string | null;
  timesOnline: number;
  firstSeen: Date | null;
}

let statusData: StatusObject[] = [];
let previousStatus: string | null = null;
let statusChangedAt: number | null = null;
let timesOnline: number = 0;
let firstSeen: Date | string | null = null;
let lastSeen: Date |string | null = null;
let totalOnlineDuration = 0;
let lastOnlineTimestamp = null;
let totalOfflineDuration = 0;
let lastOfflineTimestamp = null;
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
    }

    export const statuses: StatusObject[] = ${JSON.stringify(statuses, null, 2)};
  `;
  fs.writeFile('statusData.ts', fileContent, (err) => {
    if (err) {
      console.error('An error occurred while writing JSON object to file:', err);
    } else {
      console.log('Data file has been saved.');
    }
  });
}

export default async (req: Request, res: Response): Promise<void> => {
  const time = getCurrentDateTime().time;
  const timestamp = time;

  try {
    const name: string = (req.query.name as string) || (process.env.WHATSAPP_NAME as string);
    if (!name) throw new Error('Name is required.');

    let options = new chrome.Options();
    const chromeProfilePath = path.resolve(__dirname, '../../../../../chromeprofile');
    options.addArguments(`user-data-dir=${chromeProfilePath}`);

    let driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    try {
      console.log('Navigating to WhatsApp');
      await driver.get('https://web.whatsapp.com/');
      console.log('Successfully navigated to WhatsApp');

      while (true) {
        try {
          console.log(`Finding and clicking element for ${name}`);
          let element = await driver.wait(
            until.elementLocated(By.xpath(`//span[contains(text(), '${name}')]`)),
            ITTERATION_DURATION
          );
          await element.click();

          console.log('Getting status');

          let currentStatus;
          try {
            await driver.findElement(By.xpath("//span[@title='Online']"));
            currentStatus = "Online";
            if (lastOnlineTimestamp) {
              const now = new Date();
              totalOnlineDuration += Math.floor((now.getTime() - lastOnlineTimestamp.getTime()) / 1000);
            }
            lastOnlineTimestamp = new Date();
          } catch (error) {
            currentStatus = "Offline";
            if (lastOfflineTimestamp) {
              const now = new Date();
              totalOfflineDuration += Math.floor((now.getTime() - lastOfflineTimestamp.getTime()) / 1000);
            }
            lastOfflineTimestamp = new Date();
          }

          // Increment timesOnline if status changes from "Offline" to "Online"
          if (previousStatus === "Offline" && currentStatus === "Online") {
            timesOnline++;
          }

          // Update previousStatus
          previousStatus = currentStatus;

          const statusObject: StatusObject = {
            name,
            status: currentStatus,
            timestamp: timestamp,
            onlinefor: currentStatus === "Online" ? `${totalOnlineDuration} seconds` : null,
            offlineSince: currentStatus === "Offline" ? `${totalOfflineDuration} seconds` : null,
            lastSeen: timestamp,
            timesOnline,
            firstSeen
          };

          statusData.push(statusObject);
          console.log(`Status for ${name}: ${statusObject.status}`);
          console.log(JSON.stringify(statusObject));

          writeStatusesToFile(statusData);

          await new Promise(resolve => setTimeout(resolve, ITTERATION_DURATION));
        } catch (error) {
          console.error('An error occurred:', error);
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).json({ error: error });
      console.error(`Sent 500 response due to error: ${error}`);
    } finally {
      if (driver) {
        await driver.quit();
      }
    }
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: error });
    console.error(`Sent 500 response due to error: ${error}`);
  }
};