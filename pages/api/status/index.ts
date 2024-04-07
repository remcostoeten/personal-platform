import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import path from 'path';
import fs from 'fs';
import { Request, Response } from 'express';
import { getCurrentDateTime } from '@/core/helpers/getCurrentDateTime';

const currentDateTime = getCurrentDateTime();
const time = currentDateTime.time;
const date = currentDateTime.date;

interface StatusObject {
  name: string;
  status: string;
  timestamp: Date;
  onlinefor: string | null;
  offlineSince: string | null;
  lastSeen: string | null;
  timesOnline: number;
  firstSeen: Date | null;
}

let status: StatusObject = {
  name: '',
  status: '',
  timestamp: new Date(),
  onlinefor: null,
  offlineSince: null,
  lastSeen: null,
  timesOnline: 0,
  firstSeen: null,
};

let statusData: StatusObject[] = [];
let previousStatus: string | null = null;
let statusChangedAt: number = Date.now();
let timesOnline: number = 0;
let firstSeen: string  | null = null;
let onlinefor: string | null = null;
let offlineSince: string | null = null;
let lastSeen: string | null = null;
let statusObject: StatusObject | null = null;

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
          await element.click();

          console.log('Getting status');

          try {
            await driver.wait(until.elementLocated(By.xpath("//span[@title='Online']")), 2500);
            let currentStatus = "Online";
            if (previousStatus !== currentStatus) {
              timesOnline++;
              let { date, time } = getCurrentDateTime();
              firstSeen = `${date} ${time}`;
              previousStatus = currentStatus;
            }
            if (lastSeen.length > 0) {
              lastSeen = 'Has been online since last seen';
            } else {
              let { date, time } = getCurrentDateTime();
              lastSeen = `${date} ${time}`;
            }
            onlinefor = `${Math.floor((Date.now() - statusChangedAt) / 1000)} seconds`;

            statusObject = {
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
          } catch (error) {
            let currentStatus = "Offline";
            if (previousStatus !== currentStatus) {
              offlineSince = `${Math.floor((Date.now() - statusChangedAt) / 1000)} seconds`;
              let { date, time } = getCurrentDateTime();
              lastSeen = `${date} ${time}`;
              previousStatus = currentStatus;
            }
            statusObject = {
              name,
              status: currentStatus,
              timestamp,
              onlinefor,
              offlineSince,
              lastSeen,
              timesOnline,
              firstSeen
            };
            statusData.push(statusObject);
            console.log(`Status for ${name}: ${statusObject.status}`);
            console.log(JSON.stringify(statusObject));
          }
          console.log(`Status for ${name}: ${statusObject.status}`);
          console.log(JSON.stringify(statusObject));

          writeStatusesToFile(statusData);

          await new Promise(resolve => setTimeout(resolve, 2500));
        } catch (error) {
          if (error.includes('chrome not reachable')) {
            // ChromeDriver has been closed, stop execution
            console.error('ChromeDriver has been closed, stopping execution.');
            break;
          }
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
