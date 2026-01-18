import { useState, useEffect } from 'react';

export interface Quote {
  ts: number;
  au: number;
  ag: number;
  pt: number;
  status: number;
}

export const useFetchQuote = () => {
  const [quote, setQuote] = useState<Quote>({
    "ts": 1767574443986,
    "au": 4392.33,
    "ag": 75.3735,
    "pt": 2250.035,
    "status": 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const controller = new AbortController();

  const getQuotes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:6298/prices`);
      if (!response.ok) {
        throw new Error('Quote not retrieved');
      }
      const data = await response.json();
      setIsLoading(false);

      if (!data) return;
      setQuote(data);
    } catch (err) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getQuotes();
    return () => {
      controller.abort();
    };
  }, []);

  return [quote, isLoading, error];
};