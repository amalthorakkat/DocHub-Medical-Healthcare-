

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { X } from "lucide-react";

const ImageCropModal = ({ isOpen, image, onClose, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.5); // Increased initial zoom for larger crop area
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Store cropped area pixels
  const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Generate cropped image blob
  const createCroppedImage = useCallback(async () => {
    try {
      const img = new Image();
      img.src = image;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const { x, y, width, height } = croppedAreaPixels;

      canvas.width = width;
      canvas.height = height;

      // Draw the cropped image
      ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

      // Convert canvas to blob
      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/jpeg",
          0.95
        ); // Use JPEG with 95% quality
      });
    } catch (error) {
      console.error("Error creating cropped image:", error);
      return null;
    }
  }, [image, croppedAreaPixels]);

  // Handle Done button click
  const handleDone = async () => {
    const croppedImageBlob = await createCroppedImage();
    if (croppedImageBlob) {
      onCropComplete(croppedImageBlob);
    } else {
      onClose(); // Close modal if cropping fails
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-white p-9 rounded-2xl shadow-lg w-[90%] md:w-[600px] h-[600px] relative flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-1 right-1 bg-gray-200 p-2 rounded-full hover:bg-gray-300"
        >
          <X size={20} />
        </button>

        {/* Cropper */}
        <div className="relative flex-1">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1} // Square aspect ratio
            cropShape="rect" // Changed to rectangular (square) crop
            showGrid={true} // Show grid for better visibility
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
            minZoom={1} // Adjusted for larger crop area
            maxZoom={4} // Increased max zoom for flexibility
          />
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mt-4">
          <input
            type="range"
            min={1}
            max={4}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
            className="w-full mr-3"
          />
          <button
            onClick={handleDone}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
