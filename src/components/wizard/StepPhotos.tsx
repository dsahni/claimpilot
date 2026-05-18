'use client';

import { useCallback, useState } from 'react';
import CarDiagram, { CAR_SECTIONS } from './CarDiagram';

interface StepPhotosProps {
  selectedSections: string[];
  sectionPhotos: Record<string, string[]>;
  onToggleSection: (sectionId: string) => void;
  onSectionPhotosChange: (sectionId: string, photos: string[]) => void;
}

export default function StepPhotos({
  selectedSections,
  sectionPhotos,
  onToggleSection,
  onSectionPhotosChange,
}: StepPhotosProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Select Damaged Areas</h2>
        <p className="text-sm text-slate-500 mt-1">
          Tap the areas on the vehicle that were damaged, then upload photos for each.
        </p>
      </div>

      <CarDiagram
        selectedSections={selectedSections}
        onToggleSection={onToggleSection}
      />

      {selectedSections.length === 0 && (
        <p className="text-xs text-amber-600 text-center">
          Select at least one damaged area to proceed.
        </p>
      )}

      {/* Photo upload cards for each selected section */}
      {selectedSections.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-700 border-t border-slate-100 pt-4">
            Upload photos for each damaged area
          </h3>
          {selectedSections.map(sectionId => {
            const section = CAR_SECTIONS.find(s => s.id === sectionId);
            if (!section) return null;
            const photos = sectionPhotos[sectionId] || [];
            return (
              <SectionPhotoCard
                key={sectionId}
                sectionId={sectionId}
                label={section.label}
                photos={photos}
                onPhotosChange={(newPhotos) => onSectionPhotosChange(sectionId, newPhotos)}
                onRemove={() => onToggleSection(sectionId)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

interface SectionPhotoCardProps {
  sectionId: string;
  label: string;
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  onRemove: () => void;
}

function SectionPhotoCard({ label, photos, onPhotosChange, onRemove }: SectionPhotoCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const newPhotos: string[] = [...photos];
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const url = URL.createObjectURL(file);
          newPhotos.push(url);
        }
      });
      onPhotosChange(newPhotos);
    },
    [photos, onPhotosChange]
  );

  const removePhoto = (index: number) => {
    onPhotosChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="border border-slate-200 rounded-xl bg-white p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span className="text-sm font-semibold text-slate-900">{label}</span>
        </div>
        <button
          onClick={onRemove}
          type="button"
          className="text-xs text-slate-400 hover:text-rose-500 transition-colors"
        >
          Remove
        </button>
      </div>

      {/* Drop zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          isDragging
            ? 'border-indigo-400 bg-indigo-50'
            : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
        }`}
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={e => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
      >
        <p className="text-xs text-slate-500">
          {photos.length === 0
            ? 'Drag photos here or click to browse'
            : 'Add more photos'}
        </p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={e => handleFiles(e.target.files)}
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%', zIndex: 10 }}
        />
      </div>

      {/* Photo thumbnails */}
      {photos.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {photos.map((photo, i) => (
            <div key={i} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo}
                alt={`${label} photo ${i + 1}`}
                className="w-16 h-16 object-cover rounded-lg border border-slate-200"
              />
              <button
                onClick={() => removePhoto(i)}
                type="button"
                className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {photos.length === 0 && (
        <p className="text-[11px] text-amber-500">At least 1 photo required</p>
      )}
    </div>
  );
}
