import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import path from 'path';
import fs from 'fs';
import { Request, Response } from 'express';
import { getCurrentDateTime } from '@/core/helpers/getCurrentDateTime';
import { toast } from 'sonner';
import { ReactNode } from 'react';

const currentDateTime = getCurrentDateTime();
const time = currentDateTime.time;
const date = currentDateTime.date;

interface StatusObject {
  name: string;
  status: string;
  timestamp: any;
  onlinefor: string | null;
  offlineSince: string | null;
  lastSeen: any |  null;
  timesOnline: number;
  firstSeen: string | null;
}

let status: StatusObject = {
  name: '',
  status: '',
  timestamp:currentDateTime.time,
  onlinefor: null,
  offlineSince: null,
  lastSeen: null,
  timesOnline: 0,
  firstSeen: null,
};

let statusData: StatusObject[] = [];
let previousStatus: string | null = null;
let statusChangedAt:any = currentDateTime;
let timesOnline: number = 0;
let firstSeen: string | null = null;
let lastSeen:any = null;
let onlinefor: string | null = null;
let offlineSince: string | null = null;

const dir = path.join(__dirname, '/core/constants');

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const filePath = path.join(dir, 'statusData.ts');

if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '', 'utf8');
}

function writeStatusesToFile(statuses: StatusObject[]) {
  const fileContent = `
export type StatusObject = {
  name: string ;
  status: string;
  timestamp: string;
  onlinefor: string | null;
  offlineSince: string | null;
  lastSeen: string | null;
  timesOnline: number;
  firstSeen: string | null ;
  isCurrentlyOnline: boolean;
}

export const statuses: StatusObject[] = ${JSON.stringify(statuses, null, 2)};
  `;
  fs.writeFile('statusData.ts', fileContent, (err) => {
    if (err) {
      console.error('An error occurred while writing JSON object to file:', err);
      return;
    }
    console.log('Data file has been saved.');
  });
}

export default async (req: Request, res: Response): Promise<void> => {
  const timestamp: Date = new Date();

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

            console.log(`Clicking element for ${name}`);
            await element.click();

          try {
            await driver.wait(until.elementLocated(By.xpath("//span[@title='Online']")), 2500);
            let currentStatus = "Online";

            if (previousStatus !== currentStatus) {
              toast(`${name} is online`);
              timesOnline++;
              firstSeen = time;
              previousStatus = currentStatus;
              statusChangedAt = currentDateTime
            }


            lastSeen = currentDateTime

            onlinefor = `${Math.floor((Date.now() - statusChangedAt) / 1000)} seconds`;
            status = {
              name,
              status: currentStatus,
              timestamp,
              onlinefor,
              offlineSince,
              lastSeen,
              timesOnline,
              firstSeen
            };
            previousStatus = currentStatus;
          }  catch (error) {
            let currentStatus = "Offline";
            if (previousStatus !== currentStatus) {
              toast(`${name} is offline`);
              offlineSince = time;
              previousStatus = currentStatus;
              statusChangedAt = currentDateTime
            }
            status = {
              name,
              status: currentStatus,
              timestamp,
              onlinefor,
              offlineSince,
              lastSeen,
              timesOnline,
              firstSeen
            };
            statusData.push(status);
            console.log(`Status for ${name}: ${status.status}`);
            console.log(JSON.stringify(status));
          }
          console.log(`Status for ${name}: ${status.status}`);
          console.log(JSON.stringify(status));

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