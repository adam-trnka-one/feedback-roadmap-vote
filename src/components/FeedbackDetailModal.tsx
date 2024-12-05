import React from 'react';
import { X, ChevronUp, ChevronDown } from 'lucide-react';
import { Feedback } from '../types/feedback';
import { statusColors } from '../utils/statusColors';

interface FeedbackDetailModalProps {
  feedback: Feedback;
  isOpen: boolean;
  onClose: () => void;
  onVote: (id: string, direction: 'up' | 'down') => void;
}

export const FeedbackDetailModal: React.FC<FeedbackDetailModalProps> = ({
  feedback,
  isOpen,
  onClose,
  onVote,
}) => {
  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Feedback Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => onVote(feedback.id, 'up')}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
                aria-label="Upvote"
              >
                <ChevronUp className="w-5 h-5 text-gray-600" />
              </button>
              <span className="font-semibold text-gray-900 min-w-[2ch] text-center">{feedback.votes}</span>
              <button
                onClick={() => onVote(feedback.id, 'down')}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
                aria-label="Downvote"
              >
                <ChevronDown className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{feedback.title}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  statusColors[feedback.status]
                }`}>
                  {feedback.status}
                </span>
              </div>

              <p className="text-gray-600 mb-6 text-lg leading-relaxed">{feedback.description}</p>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="px-3 py-1 rounded-full bg-gray-100">
                  {feedback.category}
                </span>
                <span>
                  Submitted on {feedback.createdAt.toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};