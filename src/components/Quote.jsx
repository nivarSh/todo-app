import { useState, useEffect } from "react";

export function Quote() {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch("https://api.api-ninjas.com/v1/quotes", {
          headers: { "X-Api-Key": "NSFNyT+rvg9SAd3KR1/JHA==1k3AHiPvyo84J994" },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        // setQuote(data[0].quote);
        // setAuthor(data[0].author);
        // Use the quote and author as needed
      } catch (error) {
        console.error("Error fetching quote:", error);
        // Handle the error or use a fallback quote
      }
      setQuote("One day you will realize that every dream you had died because you chose comfort over effort, and there will be no one to blame but yourself. That regret will haunt you forever.")
    };

    fetchQuote();
  }, []);

  return (
    <div className="quote-container">
      <p className="quote">"{quote}"</p>
      {/*<p className="author">- {author}</p>*/}
    </div>
  );
}
