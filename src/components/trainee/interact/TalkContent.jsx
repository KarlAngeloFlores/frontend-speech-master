import {
  Mic,
  MicOff,
  Loader2,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Bot,
} from "lucide-react";
import traineeService from "../../../services/trainee.service";
import "../../../styles/animations.css";
import { useState } from "react";
import { useRef } from "react";

const TalkContent = () => {
  const scenarios = {
    "Introduce Yourself": [
      { id: 1, ai: "Hello! Can you introduce yourself?" },
    ],
    "Job Interview": [
      { id: 1, ai: "Can you tell me a little about yourself?" },
    ],
    "Coffee Shop": [
      { id: 1, ai: "What would you like to order, sir?" },
    ],
  };

  const [selectedScenario, setSelectedScenario] = useState("");
  const [conversation, setConversation] = useState([]);
  const [recording, setRecording] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startScenario = () => {
    if (!selectedScenario) return;
    setConversation([{ role: "ai", text: scenarios[selectedScenario][0].ai }]);
    setFeedback(null);
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        chunksRef.current = [];

        const currentQuestion =
          conversation[conversation.length - 1]?.text || "";

        await handleScenarioFeedback(blob, selectedScenario, currentQuestion);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error("Mic access error:", err);
      alert("Please allow microphone access to continue.");
    }
  };

  const handleStopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleScenarioFeedback = async (blob, scenario, question) => {
    setIsLoading(true);
    setFeedback(null);

    try {
      const data = await traineeService.scenarioFeedback(blob, scenario, question);

      setFeedback(data);

      setConversation((prev) => [
        ...prev,
        { role: "user", text: data.transcription || "(Unclear user response)" },
        { role: "ai", text: data.ai_reply || "Hmm, interesting!" },
      ]);
    } catch (error) {
      console.error("Error sending audio:", error);
      setFeedback({ error: "Failed to process your response." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6 bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
          <Bot className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          AI Conversation Practice
        </h1>
        <p className="text-slate-600">
          Choose a scenario and speak with the AI naturally.
        </p>
      </div>

      {/* Scenario Selection */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-3">
          Select Scenario
        </h2>
        <select
          onChange={(e) => {
            setSelectedScenario(e.target.value);
            setConversation([]);
            setFeedback(null);
          }}
          disabled={isLoading || recording}
          value={selectedScenario}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:cursor-not-allowed disabled:bg-slate-100 cursor-pointer"
        >
          <option value="">-- Choose Scenario --</option>
          {Object.keys(scenarios).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>

        <button
          onClick={startScenario}
          disabled={!selectedScenario || isLoading || recording}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 font-semibold transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          Start Conversation
        </button>
      </div>

      {/* Conversation */}
      {conversation.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Conversation
          </h3>

          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {conversation.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "ai" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`p-4 rounded-lg shadow-sm ${
                    msg.role === "ai"
                      ? "bg-blue-100 text-slate-800"
                      : "bg-green-100 text-slate-900"
                  }`}
                >
                  <strong>{msg.role === "ai" ? "AI: " : "You: "}</strong>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Recording controls */}
          <div className="flex flex-col items-center justify-center gap-4 pt-6 border-t border-slate-200">
            {!recording ? (
              <button
                onClick={handleStartRecording}
                disabled={isLoading}
                className="flex items-center gap-3 px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-lg shadow-md disabled:cursor-not-allowed disabled:bg-green-700 cursor-pointer"
              >
                <Mic className="w-6 h-6" />
                Speak
              </button>
            ) : (
              <button
                onClick={handleStopRecording}
                className="flex items-center gap-3 px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold text-lg shadow-md cursor-pointer"
              >
                <MicOff className="w-6 h-6" />
                Stop
              </button>
            )}
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="bg-white rounded-lg p-6 text-center border border-slate-200 shadow-md">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-700">
            Analyzing your voice response...
          </h3>
        </div>
      )}

      {/* Feedback */}
      {feedback && !feedback.error && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="text-xl font-bold text-slate-800">AI Feedback</h3>
          </div>
          <p className="text-slate-800 leading-relaxed">{feedback.feedback}</p>
        </div>
      )}

      {/* Error */}
      {feedback?.error && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{feedback.error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TalkContent;
