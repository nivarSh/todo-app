import { useState, useEffect } from "react";

export function Quote() {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch("https://zenquotes.io/api/today");
        const data = await response.json();
        if (data && data[0]) {
          setQuote(data[0].q); // Set the quote text
          setAuthor(data[0].a); // Set the author
        }
      } catch (error) {
        console.error("Error fetching quote:", error);
        setQuote("Keep going. Everything you need will come to you at the perfect time.");
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