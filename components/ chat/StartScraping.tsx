'use client';
import { PlusCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { useState , useRef} from 'react';
import Spinner from '../effects/spinner';

export default function StartScraping() {
    const [status, setStatus] = useState<null | string>(null);
    const [isLoading, setIsLoading] = useState(false);
    const abortController = useRef<AbortController | null>(null);

    const fetchStatus = () => {
      setIsLoading(true);
      abortController.current = new AbortController();

      fetch("/api/status", { signal: abortController.current.signal })
        .then((response) => response.json())
        .then((data) => {
          setStatus(data.status);
          setIsLoading(false);
        })
        .catch((error) => {
          if (error.name === "AbortError") {
            console.log("Fetch cancelled");
          } else {
            console.error("Error fetching status", error);
            setIsLoading(false);
          }
        });
    };

    const startScraper = () => {
        setIsLoading(true);
        fetch("api/status")
          .then((res) => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then((data) => {
            setStatus(data.status);
            setIsLoading(false);
          })
          .catch((error: any) => {
            setStatus("Error");
            console.error("Error fetching status", error);
            setIsLoading(false);
          });
    };

    return (
        <div>
            {isLoading ? (
                <Spinner size="medium" color="purple-500" />
            ) : (
                <Button size="sm" className="h-8 gap-1" onClick={fetchStatus}>
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Start scraping
                    </span>
                </Button>
            )}
        </div>
    );
}
