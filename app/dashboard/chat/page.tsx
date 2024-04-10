'use client';
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import OnlineIndicator from "@/components/effects/OnlineIndicator";

function StartScraping() {
    const [status, setStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const startScraping = () => {
        setIsLoading(true);

        fetch("/api/checker/route") // Changed the endpoint here
            .then((response) => response.json())
            .then((data) => {
                setStatus(data.status);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching status", error);
                setIsLoading(false);
            });
    };

    const clearStatus = () => {
        fetch("/api/status/route/clear") // Changed the endpoint here
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Status cleared:", data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    return (
        <>
            <Button size="sm" className="h-8 gap-1" onClick={startScraping}>
                {!isLoading ? (
                    <>
                        <PlusCircle className="h-3.5 w-3.5" />
                        Start scraping
                    </>
                ) : (
                    <span className="flex gap-2">
                        <OnlineIndicator />
                        Currently scraping..
                    </span>
                )}
            </Button>
            <Button size="sm" className="h-8 gap-1" onClick={clearStatus}>
                Clear
            </Button>
        </>
    );
}

export default StartScraping;