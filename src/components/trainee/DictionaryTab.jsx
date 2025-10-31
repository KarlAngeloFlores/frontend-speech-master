import React, { useRef, useState } from "react";
import { Search, Volume2, BookOpen, Loader, Settings } from "lucide-react";
import "../../styles/animations.css";

const DictionaryTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [wordData, setWordData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedControl, setShowSpeedControl] = useState(true);
  const [openAIDef, setOpenAIDef] = useState(null);
  const [openAILoading, setOpenAILoading] = useState(false);
  const [openAIError, setOpenAIError] = useState("");

  const wordRef = useRef(null);

  const handleWordScroll = () => {
    if (wordRef.current) {
      wordRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Speed levels: Very Slow, Slow, Normal, Fast, Very Fast
  const speedLevels = [
    { label: "Very Slow", value: 0.5 },
    { label: "Slow", value: 0.75 },
    { label: "Normal", value: 1 },
    { label: "Fast", value: 1.25 },
    { label: "Very Fast", value: 1.5 },
  ];

  const API_URL = import.meta.env.VITE_API_URL;
  const open_ai_api = `${API_URL}/trainee/alternative-dictionary/${searchTerm.toLowerCase()}`;
  const proxy_api = `${API_URL}/trainee/dictionary/${searchTerm.toLowerCase()}`;

  const searchWord = async (word) => {
    if (!word.trim()) return;
    setLoading(true);
    setError("");
    setWordData(null);
    setOpenAIDef(null);
    setOpenAIError("");
    try {
      const response = await fetch(proxy_api);
      if (!response.ok) {
        throw new Error("Word not found");
      }
      const data = await response.json();
      setWordData(data[0]);
      setTimeout(() => {
        handleWordScroll();
      }, 100);
    } catch (err) {
      setError("Word not available in the source");
    } finally {
      setLoading(false);
    }
  };

  const fetchOpenAIDefinition = async () => {
    setOpenAILoading(true);
    setOpenAIError("");
    setOpenAIDef(null);
    try {
      const response = await fetch(open_ai_api);
      if (!response.ok) {
        throw new Error("OpenAI definition not found");
      }
      const data = await response.json();
      setOpenAIDef(data);
      setError("");
    } catch (err) {
      setOpenAIError("Something went wrong. Please try again later.");
    } finally {
      setOpenAILoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchWord(searchTerm);
  };

  const handleSpeak = (word) => {
    if (!word.trim()) return;

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = playbackSpeed;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="mb-2 scroll-smooth">
      <div className="bg-white p-4 mb-4 shadow-md rounded-lg border border-slate-200 modal-animation">
        <div className="flex gap-4 mb-4 ">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                const formatted = e.target.value
                  .replace(/\s+/g, "")
                  .toLowerCase();
                setSearchTerm(formatted);
              }}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
              disabled={loading}
              placeholder="Search for a word..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading || !searchTerm.trim()}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 cursor-pointer"
          >
            {loading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Search
          </button>
        </div>

        {/* Speed Control */}
        <div className="flex sm:flex-row flex-col gap-3">
          <button
            onClick={() => setShowSpeedControl(!showSpeedControl)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
          >
            <Settings className="h-4 w-4" />
            Pronunciation Speed
          </button>

          {showSpeedControl && (
            <div className="flex items-center gap-2">
              {speedLevels.map((speed, index) => (
                <button
                  key={index}
                  onClick={() => setPlaybackSpeed(speed.value)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors cursor-pointer ${
                    playbackSpeed === speed.value
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {speed.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Error Message & OpenAI Fallback */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 text-center">
          <p className="text-red-700 mb-2">{error}</p>
          <button
            onClick={fetchOpenAIDefinition}
            disabled={openAILoading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {openAILoading ? (
              <Loader className="h-4 w-4 animate-spin inline-block" />
            ) : (
              "Try AI Dictionary"
            )}
          </button>
          {openAIError && <p className="text-red-500 mt-2">{openAIError}</p>}
        </div>
      )}

      {/* OpenAI Definition Fallback */}
      {openAIDef && (
        <div
          className="dictionary-container bg-white p-4 mb-4 shadow-md rounded-lg border border-slate-200"
          ref={wordRef}
        >
          {/* Word Header */}
          <div className="mb-2 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-3xl font-bold text-green-700 capitalize">
                {openAIDef.word}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSpeak(openAIDef.word)}
                  className="p-2 bg-green-100 hover:bg-green-200 rounded-full transition-colors cursor-pointer"
                  title={`Play pronunciation`}
                >
                  <Volume2 className="h-5 w-5 text-green-600" />
                </button>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {speedLevels.find((s) => s.value === playbackSpeed)?.label}
                </span>
              </div>
            </div>
          </div>
          {/* Definition */}
          <div className="space-y-2">
            <div className="border-l-4 border-l-green-500 pl-4">
              <h3 className="text-xl font-semibold text-green-600 mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Definition
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-md p-4">
                  <p className="text-gray-800 mb-2">{openAIDef.definition}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Word Definition */}
      {wordData && (
        <div
          className="dictionary-container bg-white p-4 mb-4 shadow-md rounded-lg border border-slate-200"
          ref={wordRef}
        >
          {/* Word Header */}
          <div className="mb-2 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-3xl font-bold text-gray-900 capitalize">
                {wordData.word}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSpeak(searchTerm)}
                  className="p-2 bg-green-100 hover:bg-green-200 rounded-full transition-colors cursor-pointer"
                  title={`Play pronunciation at ${
                    speedLevels.find((s) => s.value === playbackSpeed)?.label
                  } speed`}
                >
                  <Volume2 className="h-5 w-5 text-green-600" />
                </button>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {speedLevels.find((s) => s.value === playbackSpeed)?.label}
                </span>
              </div>
            </div>
          </div>

          {/* Meanings */}
          <div className="space-y-2">
            {wordData.meanings?.map((meaning, index) => (
              <div key={index} className="border-l-4 border-l-green-500 pl-4">
                <h3 className="text-xl font-semibold text-green-600 mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {meaning.partOfSpeech}
                </h3>

                <div className="space-y-4">
                  {meaning.definitions?.slice(0, 3).map((def, defIndex) => (
                    <div key={defIndex} className="bg-gray-50 rounded-md p-4">
                      <p className="text-gray-800 mb-2">{def.definition}</p>
                      {def.example && (
                        <p className="text-gray-600 italic">
                          <strong>Example:</strong> "{def.example}"
                        </p>
                      )}
                      {def.synonyms && def.synonyms.length > 0 && (
                        <div className="mt-2">
                          <span className="text-sm font-medium text-green-700">
                            Synonyms:{" "}
                          </span>
                          <span className="text-sm text-green-600">
                            {def.synonyms.slice(0, 3).join(", ")}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Part of speech synonyms and antonyms */}
                {(meaning.synonyms?.length > 0 ||
                  meaning.antonyms?.length > 0) && (
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    {meaning.synonyms?.length > 0 && (
                      <div className="mb-2">
                        <span className="font-medium text-green-700">
                          Synonyms:{" "}
                        </span>
                        <span className="text-green-600">
                          {meaning.synonyms.slice(0, 5).join(", ")}
                        </span>
                      </div>
                    )}
                    {meaning.antonyms?.length > 0 && (
                      <div>
                        <span className="font-medium text-red-700">
                          Antonyms:{" "}
                        </span>
                        <span className="text-red-600">
                          {meaning.antonyms.slice(0, 5).join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Source */}
          {/* {wordData.sourceUrls && wordData.sourceUrls.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Source: {" "}
                <a 
                  href={wordData.sourceUrls[0]} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline"
                >
                  {wordData.sourceUrls[0]}
                </a>
              </p>
            </div>
          )} */}
        </div>
      )}

      {/* Empty State */}
      {!wordData && !loading && !error && !openAIDef && (
        <div className="bg-white p-4 mb-4 shadow-md rounded-md border border-slate-200 text-center modal-animation">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-500 mb-2">
            Search for a word
          </h3>
          <p className="text-gray-400">
            Enter a word in the search box above to get its definition and
            pronunciation.
          </p>
        </div>
      )}
    </div>
  );
};

export default DictionaryTab;
