'use client'
import { StatusObject, statuses } from '@/statusData';
import { useEffect, useState } from 'react';

export default function ActivityMonitor() {
    const [mostRecentStatus, setMostRecentStatus] = useState<StatusObject | null>(null);

    const updateStatuses = async () => {
        const fetchedStatuses = await statuses; // Replace with actual data fetching logic
        statuses.splice(0, statuses.length, ...fetchedStatuses);

        const mostRecent = statuses.sort((a, b) => Number(b.timestamp) - Number(a.timestamp))[0];
        setMostRecentStatus(mostRecent);
    };

    useEffect(() => {
        updateStatuses(); // Initial fetch

        const intervalId = setInterval(updateStatuses, 10000); // Update every 10 seconds

        return () => clearInterval(intervalId);
    }, []);

    if (!mostRecentStatus) {
        return <div>Loading...</div>;
    }

    const firstTimestamp = statuses[0]?.timestamp.toString();
    const lastTimestamp = statuses[statuses.length - 1]?.timestamp.toString();

    const isOnline = mostRecentStatus.status === 'online';

    return (
        <>
            {isOnline ? (
                <p>
                    {mostRecentStatus.name} is currently online. Has been online for {mostRecentStatus.timesOnline} times since {firstTimestamp}.
                </p>
            ) : (
                <p>
                    {mostRecentStatus.name} is currently offline. Last seen at {mostRecentStatus.lastSeen}. The last online session lasted {mostRecentStatus.lastOnlineDuration}.
                </p>
            )}
        </>
    );
}