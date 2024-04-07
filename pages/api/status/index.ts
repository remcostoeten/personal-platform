import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import path from 'path';
import fs from 'fs';
import { Request, Response } from 'express';
import { getCurrentDateTime } from '@/core/helpers/getCurrentDateTime';

interface StatusObject {
  name: string;
  status: string;
  timestamp: string; // Changed type from Date to string
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
let totalOnlineDuration = 0;
let totalOfflineDuration = 0;

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
  const timestamp = time

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
            2500
          );
          await element.click();

          console.log('Getting status');

          let currentStatus = await driver.findElement(By.xpath("//span[@title='Online']"))
            .then(() => "Online")
            .catch(() => "Offline");

            if (previousStatus !== currentStatus) {
              if (previousStatus === "Offline" && currentStatus === "Online") {
                timesOnline++;
                firstSeen = timestamp;
              }
              statusChangedAt = Date.now();
            }

            const duration = statusChangedAt ? Math.floor((Date.now() - statusChangedAt) / 1000) : 0;
          const statusObject: StatusObject = {
            name,
            status: currentStatus,
            timestamp: timestamp, // Assigning timestamp value
            onlinefor: currentStatus === "Online" ? `${totalOnlineDuration} seconds` : null,
            offlineSince: currentStatus === "Offline" ? `${totalOfflineDuration} seconds` : null,
            lastSeen: timestamp,
            timesOnline,
            firstSeen
          };

          if (currentStatus === "Online") {
            totalOnlineDuration += duration;
          } else {
            totalOfflineDuration += duration;
          }


          statusData.push(statusObject);
          console.log(`Status for ${name}: ${statusObject.status}`);
          console.log(JSON.stringify(statusObject));

          writeStatusesToFile(statusData);

          await new Promise(resolve => setTimeout(resolve, 2500));
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