import React, { useState } from "react";
import { X, Layers, ArrowRight } from "lucide-react";
// Make sure this path is correct for your project
import { COLORS } from "../../../../../constants/colors";

// --- Interface for the Popup ---
interface PopupLayerProps {
  layerLevel: number; // To track if we are on Layer 1, 2, or 3
  zIndex: number; // The dynamic Z-Index passed from parent
  onClose: () => void;
}

// --- The Reusable Nested Component ---
const PopupLayer: React.FC<PopupLayerProps> = ({
  layerLevel,
  zIndex,
  onClose,
}) => {
  const [showNextLayer, setShowNextLayer] = useState(false);

  // LOGIC: The next child will always be Current + 10
  const nextLayerZIndex = zIndex + 10;

  // Design: Shift the popup slightly so you can see the recursion visually
  const offset = (layerLevel - 1) * 20;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]"
      // CRITICAL: This applies the received z-index to the overlay wrapper
      style={{ zIndex: zIndex }}
    >
      <div
        className="w-[400px] shadow-2xl rounded-sm overflow-hidden border"
        style={{
          backgroundColor: COLORS.background, // gray-50
          borderColor: COLORS.textMuted,
          // Shift visual position slightly for demo purposes
          transform: `translate(${offset}px, ${offset}px)`,
        }}
      >
        {/* Header */}
        <div
          className="px-4 py-2 flex justify-between items-center text-white"
          style={{ backgroundColor: COLORS.primary }}
        >
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Layers size={16} />
            <span>Popup Layer {layerLevel}</span>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-1 rounded transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div
            className="p-3 border rounded text-xs"
            style={{
              backgroundColor: COLORS.white,
              borderColor: COLORS.border,
            }}
          >
            <p className="font-bold mb-1" style={{ color: COLORS.textPrimary }}>
              Current Z-Index: <span className="text-blue-600">{zIndex}</span>
            </p>
            <p style={{ color: COLORS.textSecondary }}>
              This component is receiving <strong>{zIndex}</strong> from its
              parent. Any child opened from here will receive{" "}
              <strong>{nextLayerZIndex}</strong>.
            </p>
          </div>

          {/* Action Button: Only show if we haven't reached Layer 3 yet */}
          {layerLevel < 3 ? (
            <button
              onClick={() => setShowNextLayer(true)}
              className="w-full py-2 px-4 rounded-sm text-white text-xs font-medium flex items-center justify-center gap-2 hover:brightness-90 transition-all"
              style={{ backgroundColor: COLORS.success }}
            >
              Open Layer {layerLevel + 1}
              <ArrowRight size={14} />
            </button>
          ) : (
            <div
              className="p-2 text-center text-xs border rounded"
              style={{
                backgroundColor: COLORS.primaryLight,
                color: COLORS.primary,
                borderColor: COLORS.primary,
              }}
            >
              Maximum Depth Reached (Layer 3)
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="p-3 border-t flex justify-end"
          style={{ borderColor: COLORS.border }}
        >
          <button
            onClick={onClose}
            className="px-3 py-1.5 border border-gray-300 rounded-sm text-xs font-medium hover:bg-gray-100"
            style={{ color: COLORS.textPrimary }}
          >
            Close Layer {layerLevel}
          </button>
        </div>
      </div>

      {/* --- RECURSION HAPPENS HERE --- */}
      {showNextLayer && (
        <PopupLayer
          layerLevel={layerLevel + 1} // Increment Level
          zIndex={nextLayerZIndex} // Increment Z-Index (Current + 10)
          onClose={() => setShowNextLayer(false)}
        />
      )}
    </div>
  );
};

// --- Main Export: Use this in your page ---
export default function NestedPopupDemo() {
  const [isOpen, setIsOpen] = useState(false);

  // STARTING INDEX: You said you want to send 10
  const INITIAL_Z_INDEX = 10;

  return (
    <div className="p-10">
      <h2
        className="mb-4 font-bold text-lg"
        style={{ color: COLORS.textPrimary }}
      >
        Nested Z-Index Demo
      </h2>

      <button
        onClick={() => setIsOpen(true)}
        className="px-5 py-2 rounded-sm text-white text-sm font-medium hover:brightness-90"
        style={{ backgroundColor: COLORS.primary }}
      >
        Open First Popup (Z-Index: {INITIAL_Z_INDEX})
      </button>

      {/* Initial Call */}
      {isOpen && (
        <PopupLayer
          layerLevel={1}
          zIndex={INITIAL_Z_INDEX}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

//  <hr />
//         <hr />
//         <NestedPopupDemo />
//         <hr />
//         <hr />
