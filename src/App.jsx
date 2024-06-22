import { useState, useRef } from "react";
import { requestToGroqAI } from "./utils/groq";
import { Light as SyntaxHighlight } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import "./App.css";

function App() {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [language, setLanguage] = useState("id");
  const inputRef = useRef(null);

  const handleSubmit = async () => {
    const content = inputRef.current.value;
    if (!content.trim()) {
      setError("Silahkan Ketik Permintaan Anda!");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const aiResponse = await requestToGroqAI(content, language);
      const cleanedResponse = aiResponse.replace(/```/g, '');
      setData(cleanedResponse);
    } catch (err) {
      setError("Terjadi kesalahan saat mengirim permintaan");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleClearInput = () => {
    setInputValue("");
    setData("");
    setError("");
  };

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === "id" ? "en" : "id"));
  };

  return (
    <main className="flex flex-col min-h-[80vh] justify-center items-center max-w-xl w-full mx-auto">
      <h1 className="text-6xl text-blue-500">FRS | REACT AI</h1>
      <h6 className="text-2xl text-blue-500">| Simple AI Technology With Groq AI |</h6>
      <form
        className="flex flex-col gap-4 py-4 w-full"
        onSubmit={(e) => e.preventDefault()}>
        <div className="relative w-full">
          <input
            placeholder="Ketik Permintaan..."
            className="py-2 px-4 text-md rounded-md border w-full pr-10"
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}/>
          {inputValue && (
            <button
              type="button"
              onClick={handleClearInput}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={toggleLanguage}
            type="button"
            className="bg-transparent border-none cursor-pointer">
            <img
              src={language === "id" ? "../src/assets/indonesia.png" : "../src/assets/uk.png"}
              alt={language === "id" ? "Bahasa Indonesia" : "English"}
              className="h-6 w-6"
              title={language === "id" ? "Bahasa Indonesia" : "English"}
            />
          </button>
          <button
            onClick={handleSubmit}
            type="button"
            className="bg-green-500 py-2 px-4 font-bold text-white w-full rounded-md flex justify-center items-center"
            disabled={loading}>
            {loading ? (
              <div className="loader"></div>
            ) : (
              <FontAwesomeIcon icon={faPaperPlane} className="h-6 w-6" />
            )}
          </button>
        </div>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      <div className="max-w-xl w-full mx-auto">
        {data && (
          <SyntaxHighlight
            language="html"
            style={ dracula }
            wrapLongLines={true}>
            {data}
          </SyntaxHighlight>
        )}
      </div>
    </main>
  );
}

export default App;
