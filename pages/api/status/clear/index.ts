import path from "path";
import fs from "fs";
import { Request, Response } from "express";

const createStatusFile = (
  filePath: string,
  fileContent: string,
  res: Response,
) => {
  fs.writeFile(filePath, fileContent, (err) => {
    if (err) {
      console.error(
        "An error occurred while writing JSON object to file:",
        err,
      );
      res.status(500).json({ error: "Failed to clear file" });
      return;
    }

    console.log("Data file has been cleared.");
    res.status(200).json({ message: "Data file has been cleared." });
  });
};

export default async (req: Request, res: Response): Promise<void> => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

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

    export const statuses: StatusObject[] = [];
  `;

  const filePath = path.join(process.cwd(), "statusData.ts");
  createStatusFile(filePath, fileContent, res);
};
