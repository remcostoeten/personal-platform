"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";

function StartScraping() {
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const startScraping = () => {
    setIsLoading(true);

    fetch("/api/status")
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

  return (
    <>
      <Button
        size="sm"
        className="h-8 gap-1"
        onClick={startScraping}
        disabled={isLoading}
      >
        <PlusCircle className="h-3.5 w-3.5" />
        {!isLoading ? <>Start scraping</> : <span className="loading">Currently scraping</span>}
      </Button>
    </>
  );
}

export default StartScraping;
