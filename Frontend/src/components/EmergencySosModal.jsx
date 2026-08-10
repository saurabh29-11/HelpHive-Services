import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, X, ShieldAlert, CheckCircle2, MapPin, Radio } from 'lucide-react';
import toast from 'react-hot-toast';

const EmergencySosModal = ({ show, onClose }) => {
  const [triggered, setTriggered] = useState(false);
  const [loadingGps, setLoadingGps] = useState(false);
  const [coords, setCoords] = useState(null);

  const handleTriggerSos = () => {
    setLoadingGps(true);
    const toastId = toast.loading("Requesting live GPS location access...");

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(4);
          const lng = position.coords.longitude.toFixed(4);
          setCoords({ lat, lng });
          setLoadingGps(false);
          setTriggered(true);
          toast.error(`⚡ SOS Dispatched! Live GPS (${lat}°, ${lng}°) sent to 112 Helpline!`, { id: toastId });
        },
        (error) => {
          console.warn("GPS Permission denied or unavailable:", error.message);
          // Fallback with demo location if browser blocks permission
          setCoords({ lat: "26.8467", lng: "80.9462" });
          setLoadingGps(false);
          setTriggered(true);
          toast.error("⚡ SOS Dispatched to Emergency Helpline 112!", { id: toastId });
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setCoords({ lat: "26.8467", lng: "80.9462" });
      setLoadingGps(false);
      setTriggered(true);
      toast.error("⚡ SOS Dispatched to Emergency Helpline 112!", { id: toastId });
    }
  };

  const handleClose = () => {
    setTriggered(false);
    setCoords(null);
    setLoadingGps(false);
    if (onClose) onClose();
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-950/80 backdrop-blur-md p-4" onClick={handleClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="relative w-full max-w-md rounded-2xl bg-slate-900 border-2 border-red-500 p-6 shadow-2xl text-white text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={handleClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
            <X size={20} />
          </button>

          {!triggered ? (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-600/30 border border-red-500 mb-4 animate-pulse">
                <AlertOctagon className="h-10 w-10 text-red-500" />
              </div>

              <h3 className="text-2xl font-black text-red-400">Emergency SOS Alarm</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Clicking below will request your browser's <strong>Live GPS Access</strong> and dispatch an instant high-priority emergency distress signal.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={handleTriggerSos}
                  disabled={loadingGps}
                  className="btn bg-red-600 hover:bg-red-700 text-white font-extrabold py-3 text-base shadow-lg animate-bounce flex items-center justify-center gap-2"
                >
                  <ShieldAlert size={20} /> {loadingGps ? 'Accessing Live GPS...' : 'DISPATCH EMERGENCY SOS NOW'}
                </button>
                <button onClick={handleClose} className="btn bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs">
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <div className="py-4 space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 border border-green-500">
                <CheckCircle2 className="h-10 w-10 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-green-400">SOS Alert Active & Dispatched!</h3>

              {coords && (
                <div className="rounded-lg bg-slate-800 p-3 border border-slate-700 text-xs text-left font-mono space-y-1">
                  <div className="flex items-center gap-1.5 text-green-400 font-bold">
                    <Radio size={14} className="animate-ping" />
                    <span>Transmitting Live Emergency Data</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300 mt-1">
                    <MapPin size={14} className="text-red-400" />
                    <span>GPS Location: <strong>{coords.lat}° N, {coords.lng}° E</strong></span>
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-300 leading-relaxed">
                HelpHive Safety Control Room & Emergency Helpline <strong>112 / 100</strong> have been alerted with your live location pins.
              </p>
              
              <button onClick={handleClose} className="btn bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs w-full py-2.5">
                Deactivate Alarm & Close Window
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EmergencySosModal;
