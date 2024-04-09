"use client";
import React from "react";

interface StatusData {
  name: string;
  status: string;
  timestamp: string;
  onlinefor: string;
  offlineSince: string | null;
  lastSeen: string;
  timesOnline: number;
  firstSeen: string;
  ts: string;
  lastSessionDuration: string;
}

interface ActivityMonitorProps {
  StatusData: StatusData;
}

const ActivityMonitor: React.FC<ActivityMonitorProps> = ({ StatusData }) => {
  const {
    name,
    status,
    lastSeen,
    timesOnline,
    firstSeen,
    lastSessionDuration,
  } = StatusData;

  return (
    <div>
      <p>
        {name} is currently {status}. Last seen at {lastSeen}. The last online
        session lasted {lastSessionDuration} seconds. A total of {timesOnline}{" "}
        online sessions since {firstSeen}.
      </p>
    </div>
  );
};

export default ActivityMonitor;
