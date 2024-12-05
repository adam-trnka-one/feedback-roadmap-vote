import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Feedback } from '../types/feedback';
import { statusColors } from '../utils/statusColors';

interface FeedbackCardProps {
  feedback: Feedback;
  onVote: (id: string, direction: 'up' | 'down') => void;
  onTitleClick: (feedback: Feedback) => void;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback, onVote, onTitleClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
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
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => onTitleClick(feedback)}
              className="text-lg font-semibold text-gray-900 hover:text-[#F85E17] text-left transition-colors"
            >
              {feedback.title}
            </button>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              statusColors[feedback.status]
            }`}>
              {feedback.status}
            </span>
          </div>
          
          <p className="text-gray-600 mb-3">{feedback.description}</p>
          
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
              {feedback.category}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(feedback.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};