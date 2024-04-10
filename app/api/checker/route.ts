import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import path from "path";
import supabase from '@/core/database/supabase';
import { SCRAPE_URL, CHROME_PROFILE_PATH } from "@/components/chat/config";
import { NextApiRequest, NextApiResponse } from 'next'; // Import Next.js types

interface StatusObject {
    name: string;
    status: string;
    timestamp: string;
    onlinefor: string | null;
    offlineSince: string | null;
    lastSeen: number | string | null;
    timesOnline: number;
    timesOffline: number;
    firstSeen: Date | string | null;
    firstTimestamp: number | string | null;
    lastSessionDuration: string | null;
}

export default async (req: NextApiRequest, res: NextApiResponse) => { // Use Next.js types
    try {
        const name: string = req.query.name as string;
        if (!name) throw new Error("Name is required.");

        let options = new chrome.Options();
        const chromeProfilePath = path.resolve(__dirname, `${CHROME_PROFILE_PATH}`);
        options.addArguments(`user-data-dir=${chromeProfilePath}`);

        let driver = await new Builder()
            .forBrowser("chrome")
            .setChromeOptions(options)
            .build();

        try {
            console.log("Navigating to WhatsApp");
            await driver.get(SCRAPE_UcRL);
            console.log("Successfully navigated to WhatsApp");

            console.log(`Finding and clicking element for ${name}`);
            let element = await driver.wait(
                until.elementLocated(
                    By.xpath(`//span[contains(text(), '${name}')]`),
                ),
                10000,
            );
            await element.click();

            console.log("Getting status");

            let currentStatus;
            try {
                await driver.wait(until.elementLocated(By.xpath("//span[@title='Online']")), 10000);
                currentStatus = "Online";
            } catch (error) {
                currentStatus = "Offline";
            }

            console.log(`Status for ${name}: ${currentStatus}`);
            res.json({ name, status: currentStatus }); // This should now work

            // Write the status to the database
            const { error } = await supabase
                .from('status')
                .insert([
                    { name: name, status: currentStatus },
                ]);

            if (error) {
                console.error("An error occurred while writing to database:", error);
            } else {
                console.log("Status written to database");
            }

        } finally {
            await driver.quit();
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
};