// CustomVoiceControls.tsx
import React from "react";

interface VoiceControlsProps {
  controls: {
    isRecordingInProgress: boolean;
    isPausedRecording: boolean;
    startRecording: () => void;
    togglePauseResume: () => void;
    stopRecording: () => void;
    saveAudioFile: () => void;
  };
  // You can add additional props such as custom className strings if needed
  className?: string;
}

const CustomVoiceControls: React.FC<VoiceControlsProps> = ({ controls, className }) => {
  return (
    <div className={`flex items-center gap-4 ${className || ""}`}>
      {!controls.isRecordingInProgress && (
        <button
          type="button"
          className="btn-record px-3 py-1 bg-blue-500 text-white rounded"
          onClick={controls.startRecording}
        >
          Start Recording
        </button>
      )}
      {controls.isRecordingInProgress && (
        <>
          <button
            type="button"
            className="btn-pause px-3 py-1 bg-yellow-500 text-white rounded"
            onClick={controls.togglePauseResume}
          >
            {controls.isPausedRecording ? "Resume" : "Pause"}
          </button>
          <button
            type="button"
            className="btn-stop px-3 py-1 bg-red-500 text-white rounded"
            onClick={controls.stopRecording}
          >
            Stop Recording
          </button>
          <button
            type="button"
            className="btn-save px-3 py-1 bg-green-500 text-white rounded"
            onClick={controls.saveAudioFile}
          >
            Save Recording
          </button>
        </>
      )}
    </div>
  );
};

export default CustomVoiceControls;
