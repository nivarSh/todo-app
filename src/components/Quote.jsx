import { useState, useEffect } from "react";

export function Quote() {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch("https://api.allorigins.win/get?url=" + encodeURIComponent("https://zenquotes.io/api/random"));
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const parsedQuote = JSON.parse(data.contents);
        setQuote(parsedQuote[0].q);
        setAuthor(parsedQuote[0].a);
      } catch (error) {
        console.error("Error fetching quote:", error);
        // Fallback quote in case of error
        setQuote("One day you will realize that every dream you had died because you chose comfort over effort, and there will be no one to blame but yourself. That regret will haunt you forever.");
        setAuthor("Unknown");
      }
    };

    fetchQuote();
  }, []);

  return (
    <div className="quote-container">
      <p className="quote">"{quote}"</p>
      <p className="author">- {author}</p>
    </div>
  );
}
