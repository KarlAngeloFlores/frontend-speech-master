import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, FileText, Sparkles, Volume2, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import traineeService from "../../services/trainee.service";
import "../../styles/animations.css";

const Script = ({}) => {
  const [recording, setRecording] = useState(false);
  const [topic, setTopic] = useState("");
  
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const [scriptState, setScriptState] = useState({
    isLoading: false, 
    error: null, 
    value: null
  });
  
  const [feedbackState, setFeedbackState] = useState({
    isLoading: false, 
    error: null, 
    value: null
  });

  // Mock functions - replace with your actual service calls
  const handleGenerateScript = async () => {
    setScriptState((prev) => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const data = await traineeService.generateScript(topic);
    //   const mockScript = {
    //     script: `Welcome to today's presentation on ${topic || "artificial intelligence"}. In this discussion, we'll explore the fundamental concepts, current applications, and future implications of this transformative technology. Let's begin by understanding what makes AI so revolutionary in our modern world.`
    //   };
      setScriptState((prev) => ({ ...prev, isLoading: false, value: data }));
    } catch (error) {
      setScriptState((prev) => ({ ...prev, isLoading: false, error }));
    }
  };

  const handleGenerateRandomScript = async () => {
    const topics = ["Climate Change", "Space Exploration", "Digital Privacy", "Renewable Energy", "Ocean Conservation"];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    setTopic(randomTopic);
    
    setScriptState((prev) => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockScript = {
        script: `Today we're diving into the fascinating world of ${randomTopic}. This topic has gained significant attention in recent years due to its impact on our daily lives and future generations. Let's explore the key aspects and understand why this matters more than ever before.`
      };
      setScriptState((prev) => ({ ...prev, isLoading: false, value: mockScript }));
    } catch (error) {
      setScriptState((prev) => ({ ...prev, isLoading: false, error }));
    }
  };

  const handleAnalyzeVoice = async (blob, script) => {
    setFeedbackState((prev) => ({...prev, isLoading: true, error: null}));

    try {
      // Simulate analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      const data = await traineeService.analyzeVoice(blob, script);
      setFeedbackState((prev) => ({...prev, isLoading: false, error: null, value: data}));
    } catch (error) {
      setFeedbackState((prev) => ({...prev, isLoading: false, error}));
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        chunksRef.current = [];
        await handleAnalyzeVoice(blob, scriptState.value.script);
      };
      
      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      console.error('Microphone access error:', error);
    // Handle specific error types
    if (error.name === 'NotAllowedError') {
      alert('Microphone access denied by user');
    } else if (error.name === 'NotFoundError') {
      alert('No microphone found');
    } else {
      alert('Error accessing microphone: ' + error.message);
    }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

return (
  <div className="">
    <div className="">
      {/* Header */}
      <div className="text-center mb-4 bg-white p-4 rounded-lg shadow-md border border-slate-200 modal-animation">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <FileText className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Script Practice</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Generate custom scripts and practice your speech with AI-powered feedback
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-slate-200 modal-animation">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-green-600" />
          Create Your Script
        </h2>
        
        <div className="space-y-3">
          <div>
            <input 
              onChange={(e) => setTopic(e.target.value)} 
              value={topic} 
              type="text" 
              placeholder="Enter a topic (e.g., climate change, technology, history...)" 
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
            /> 
          </div>
          <div className="flex gap-3 flex-col sm:flex-row">
            <button 
              onClick={handleGenerateScript} 
              disabled={scriptState.isLoading || !topic.trim()} 
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all font-semibold flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              {scriptState.isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Generate Script
                </>
              )}
            </button>
            <button 
              onClick={handleGenerateRandomScript}
              disabled={scriptState.isLoading} 
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all font-semibold flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              {scriptState.isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Random Topic
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Script Display */}
      {scriptState.value && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Practice Script</h2>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500 mb-6">
            <p className="text-slate-800 leading-relaxed text-lg">
              {scriptState.value.script}
            </p>
          </div>

          {/* Recording Controls */}
          <div className="flex flex-col items-center justify-center gap-4 pt-4 border-t border-slate-200">
            {!recording ? (
              <button
                onClick={startRecording}
                className="flex items-center gap-3 px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold text-lg shadow-md hover:shadow-md cursor-pointer"
              >
                <Mic className="w-6 h-6" />
                Start Recording
              </button>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-3 px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold text-lg shadow-md hover:shadow-md cursor-pointer cursor-pointer"
                >
                  <MicOff className="w-6 h-6" />
                  Stop Recording
                </button>
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-red-700">Recording in progress...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading State for Analysis */}
      {feedbackState.isLoading && (
        <div className="bg-white rounded-xl shadow-md p-8 mb-6 border border-slate-200">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Analyzing Your Speech...</h3>
            <p className="text-slate-600">Our AI is evaluating your pronunciation, pace, and clarity</p>
            <div className="flex justify-center gap-2 mt-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></span>
            </div>
          </div>
        </div>
      )}

      {/* AI Feedback */}
      {feedbackState.value && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">AI Feedback & Analysis</h3>
          </div>
          
          <div className="space-y-4">
            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
              <p className="text-sm font-semibold text-green-700 mb-2 uppercase tracking-wide">
                Overall Score
              </p>
              <div className="text-4xl font-bold text-green-700">
                {feedbackState.value.result.score}
              </div>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
              <p className="text-sm font-semibold text-green-700 mb-3 uppercase tracking-wide">
                Detailed Feedback
              </p>
              <p className="text-slate-800 leading-relaxed">
                {feedbackState.value.result.feedback}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error States */}
      {scriptState.error && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-800">Error Generating Script</p>
              <p className="text-red-700 text-sm">Please try again or choose a different topic.</p>
            </div>
          </div>
        </div>
      )}

      {feedbackState.error && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-800">Error Analyzing Speech</p>
              <p className="text-red-700 text-sm">Please try recording again.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
};

export default Script;