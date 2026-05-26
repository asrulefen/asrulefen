"use client";
import React, { useState, useRef } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Upload, Check, X } from "lucide-react";

interface ImageCropperProps {
  onCropComplete: (base64Image: string | string[]) => void;
  aspect?: number;
}

export function ImageCropper({ onCropComplete, aspect = 4 / 3 }: ImageCropperProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [upImg, setUpImg] = useState<string>();
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });
  const imgRef = useRef<HTMLImageElement>(null);

  const processMultipleFiles = async (files: FileList) => {
    setIsProcessing(true);
    const results: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const targetRatio = aspect;
            const imgRatio = img.width / img.height;
            
            let drawWidth = img.width;
            let drawHeight = img.height;
            let offsetX = 0;
            let offsetY = 0;
            
            if (imgRatio > targetRatio) {
              drawWidth = img.height * targetRatio;
              offsetX = (img.width - drawWidth) / 2;
            } else {
              drawHeight = img.width / targetRatio;
              offsetY = (img.height - drawHeight) / 2;
            }
            
            // Resize to 800px wide to compress size, add white padding for Word layout
            const padding = 24; // 24px padding = ~0.5cm visual gap
            canvas.width = 800;
            canvas.height = 800 / targetRatio;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight, padding, padding, canvas.width - padding*2, canvas.height - padding*2);
            }
            resolve(canvas.toDataURL("image/jpeg", 0.7));
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      });
      results.push(base64);
    }
    onCropComplete(results);
    setIsProcessing(false);
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files.length === 1) {
        const reader = new FileReader();
        reader.addEventListener("load", () => setUpImg(reader.result?.toString() || ""));
        reader.readAsDataURL(e.target.files[0]);
      } else {
        // Multiple files selected, auto crop and compress them all
        processMultipleFiles(e.target.files);
      }
    }
  };

  const makeClientCrop = async () => {
    if (imgRef.current && crop.width && crop.height) {
      const croppedBase64 = await getCroppedImg(imgRef.current, crop);
      onCropComplete(croppedBase64);
      setUpImg(undefined); // Reset after crop
    }
  };

  const getCroppedImg = (image: HTMLImageElement, crop: Crop): Promise<string> => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const finalWidth = crop.width! * scaleX;
    const finalHeight = crop.height! * scaleY;
    const padding = finalWidth * 0.03; // 3% padding
    
    canvas.width = finalWidth;
    canvas.height = finalHeight;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        image,
        crop.x! * scaleX,
        crop.y! * scaleY,
        crop.width! * scaleX,
        crop.height! * scaleY,
        padding,
        padding,
        finalWidth - padding*2,
        finalHeight - padding*2
      );
    }
    return new Promise((resolve) => {
      resolve(canvas.toDataURL("image/jpeg"));
    });
  };

  if (!upImg) {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 flex flex-col items-center text-center">
          <div className="flex justify-between w-full mb-4">
            <h3 className="font-bold text-lg text-slate-800">Upload Foto Kegiatan</h3>
            <button onClick={() => onCropComplete("")} className="text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="relative group w-full h-48 border-2 border-dashed border-emerald-300 rounded-2xl flex items-center justify-center hover:bg-emerald-50 transition-colors cursor-pointer bg-slate-50">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onSelectFile}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              disabled={isProcessing}
            />
            <div className="flex flex-col items-center text-slate-500 group-hover:text-emerald-600 transition-colors">
              {isProcessing ? (
                <>
                  <div className="w-10 h-10 mb-3 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-semibold text-lg text-emerald-600">Memproses Foto...</span>
                  <span className="text-sm text-slate-400 mt-1">Harap tunggu sebentar</span>
                </>
              ) : (
                <>
                  <Upload className="w-10 h-10 mb-3 text-emerald-500" />
                  <span className="font-semibold text-lg">Pilih Foto (Bisa lebih dari 1)</span>
                  <span className="text-sm text-slate-400 mt-1">atau tarik file sekaligus ke sini</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-4 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold">Sesuaikan Foto</h3>
          <button onClick={() => setUpImg(undefined)} className="p-1 hover:bg-slate-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden bg-slate-900 rounded-lg flex items-center justify-center min-h-[300px] p-2">
          <ReactCrop crop={crop} onChange={c => setCrop(c)} aspect={aspect}>
            <img ref={imgRef} src={upImg} alt="Crop me" className="max-h-[60vh] max-w-full object-contain" />
          </ReactCrop>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={makeClientCrop}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Check className="w-4 h-4 mr-2" /> Selesai Crop
          </button>
        </div>
      </div>
    </div>
  );
}
