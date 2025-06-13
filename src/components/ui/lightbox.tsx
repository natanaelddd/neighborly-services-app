
import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface LightboxProps {
  src: string;
  alt: string;
  className?: string;
  trigger?: React.ReactNode;
}

export const Lightbox = ({ src, alt, className, trigger }: LightboxProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const openLightbox = () => setIsOpen(true);
  const closeLightbox = () => setIsOpen(false);

  return (
    <>
      {/* Trigger */}
      <div onClick={openLightbox} className="cursor-pointer">
        {trigger || (
          <img 
            src={src} 
            alt={alt}
            className={cn("transition-opacity hover:opacity-80", className)}
          />
        )}
      </div>

      {/* Lightbox Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative max-w-4xl max-h-[90vh] p-4">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute -top-2 -right-2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
            
            {/* Image */}
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          {/* Click outside to close */}
          <div 
            className="absolute inset-0 -z-10" 
            onClick={closeLightbox}
          />
        </div>
      )}
    </>
  );
};
