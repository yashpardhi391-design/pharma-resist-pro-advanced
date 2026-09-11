import React, { useRef, useState, useEffect } from "react";
import { Camera, X, RefreshCw, CheckCircle, AlertCircle, Scan, Sparkles } from "lucide-react";

interface CameraModalProps {
  isOpen: boolean;
  patientTarget: "p1" | "p2";
  patientLabel: string;
  onClose: () => void;
  onCapture: (capturedFile: { name: string; size: number; type: string; previewUrl: string }) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  patientTarget,
  patientLabel,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setErrorMsg(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported in this browser environment.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn("Camera access failed or unavailable:", err.message);
      setErrorMsg("Physical camera unavailable or permission not granted. You can use the high-fidelity lab document snapshot simulator below.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleCaptureFrame = () => {
    setIsProcessing(true);
    setTimeout(() => {
      let previewUrl = "";
      if (cameraActive && videoRef.current) {
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth || 640;
        canvas.height = videoRef.current.videoHeight || 480;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          previewUrl = canvas.toDataURL("image/jpeg", 0.85);
        }
      }

      // If no live stream captured, generate a synthetic clean medical document preview
      if (!previewUrl) {
        const canvas = document.createElement("canvas");
        canvas.width = 600;
        canvas.height = 400;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#0F172A";
          ctx.fillRect(0, 0, 600, 400);
          ctx.strokeStyle = "#0D9488";
          ctx.lineWidth = 4;
          ctx.strokeRect(20, 20, 560, 360);
          ctx.fillStyle = "#14B8A6";
          ctx.font = "bold 20px monospace";
          ctx.fillText(`SCANNED ANTIBIOGRAM - ${patientLabel.toUpperCase()}`, 40, 60);
          ctx.fillStyle = "#94A3B8";
          ctx.font = "14px sans-serif";
          ctx.fillText(`Automated Camera Capture at ${new Date().toLocaleTimeString()}`, 40, 95);
          ctx.fillText(`Pathogen Optical Character Recognition: Complete`, 40, 125);
          ctx.fillStyle = "#38BDF8";
          ctx.fillText(`MIC Disc Diffusion & E-Test Gradients: Indexed`, 40, 155);
          previewUrl = canvas.toDataURL("image/png");
        }
      }

      onCapture({
        name: `Camera_Scan_${patientTarget.toUpperCase()}_${Date.now().toString().slice(-4)}.jpg`,
        size: 840000,
        type: "image/jpeg",
        previewUrl,
      });
      setIsProcessing(false);
      onClose();
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl glass-panel-glow border border-teal-500/40 p-6 bg-slate-900/95 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                Optical Lab Report Scanner
              </h3>
              <p className="text-xs text-slate-400">
                Capturing AST document for <span className="text-teal-300 font-medium">{patientLabel}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="relative mt-4 aspect-video w-full rounded-xl bg-slate-950 border border-slate-700/80 overflow-hidden flex items-center justify-center">
          {cameraActive ? (
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-teal-400">
                <Scan className="w-7 h-7 animate-pulse" />
              </div>
              <div className="max-w-sm">
                <p className="text-sm font-medium text-slate-200">
                  Document Scanner Ready
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {errorMsg || "Position the physical antimicrobial susceptibility report inside the viewfinder frame."}
                </p>
              </div>
            </div>
          )}

          {/* Viewfinder Target Reticles */}
          <div className="absolute inset-4 pointer-events-none border border-teal-500/40 rounded-lg">
            {/* Corners */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-teal-400" />
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-teal-400" />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-teal-400" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-teal-400" />
            {/* Scanning Laser Line */}
            <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_#06B6D4] animate-laser" />
          </div>

          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-teal-300 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-teal-500/30 backdrop-blur-sm">
            <span>OCR: ANTIBIOGRAM / AST MATRIX</span>
            <span className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
              <span>ALIGNMENT OK</span>
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            onClick={startCamera}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 text-xs font-medium text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-700/60 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Viewfinder</span>
          </button>

          <button
            id="capture-document-button"
            onClick={handleCaptureFrame}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-semibold text-sm shadow-[0_0_15px_rgba(13,148,136,0.3)] transition-all cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing Document...</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                <span>Capture &amp; OCR Parse Document</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
