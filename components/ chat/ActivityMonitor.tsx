"use client";
import { StatusObject } from "@/statusData";
import React from "react";

interface ActivityMonitorProps {
    StatusData: StatusObject;
}

const ActivityMonitor: React.FC<ActivityMonitorProps> = ({ StatusData }) => {
    const {
        name,
        status,
        lastSeen,
        timesOnline,
        firstTimestamp,
        lastSessionDuration,
    } = StatusData;

    return (
        <div>
            <p>
                {name ? name : "no data"} is currently {status ? status : "no data"}. Last seen at {lastSeen ? lastSeen : "no data"}. The last online
                session lasted {lastSessionDuration ? lastSessionDuration : "no data"} seconds. A total of {timesOnline ? timesOnline : "no data"}{" "}
                online session since <span className="font-semibold">{firstTimestamp ? firstTimestamp : "no data"}</span>.
            </p>
        </div>
    );
};

export default ActivityMonitor;