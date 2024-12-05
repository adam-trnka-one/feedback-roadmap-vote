import React from 'react';
import { X } from 'lucide-react';
import { ChangelogEntry } from '../types/feedback';

interface ChangelogDetailModalProps {
  entry: ChangelogEntry;
  isOpen: boolean;
  onClose: () => void;
}

export const ChangelogDetailModal: React.FC<ChangelogDetailModalProps> = ({
  entry,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Changelog Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {entry.image && (
            <div className="mb-6">
              <img
                src={entry.image}
                alt={entry.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}
          
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{entry.title}</h3>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>{new Date(entry.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="capitalize">{entry.type}</span>
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">
              {entry.description}
            </p>
            {entry.additionalDetails && (
              <>
                <h4 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Additional Details</h4>
                <p className="text-gray-600">{entry.additionalDetails}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};