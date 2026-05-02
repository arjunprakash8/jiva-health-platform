"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: "auto" | "half" | "full";
  showHandle?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

export default function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  height = "auto",
  showHandle = true,
  showCloseButton = false,
  className,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const heightClass = height === "half" ? "max-h-[50vh]" : height === "full" ? "max-h-[92vh]" : "max-h-[85vh]";

  return (
    <>
      <div className="bottom-sheet-overlay" onClick={onClose} />
      <div ref={sheetRef} className={cn("bottom-sheet", heightClass, className)}>
        {showHandle && <div className="bottom-sheet-handle" />}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-5 py-4">
            {title && <h3 className="text-base font-semibold text-foreground">{title}</h3>}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
        <div className="overflow-y-auto pb-safe">{children}</div>
      </div>
    </>
  );
}
