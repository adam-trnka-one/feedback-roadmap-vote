import React from 'react';
import { ChevronUp, ChevronDown, MessageCircle } from 'lucide-react';
import { Feedback } from '../types/feedback';

interface RoadmapCardProps {
  feedback: Feedback;
  onVote: (id: string, direction: 'up' | 'down') => void;
  onTitleClick: (feedback: Feedback) => void;
}

const categoryColors = {
  'Feature Request': 'bg-purple-100 text-purple-800',
  'Bug Report': 'bg-red-100 text-red-800',
  'UI/UX': 'bg-indigo-100 text-indigo-800',
  'Performance': 'bg-green-100 text-green-800',
  'Documentation': 'bg-blue-100 text-blue-800',
  'Other': 'bg-gray-100 text-gray-800'
};

export const RoadmapCard: React.FC<RoadmapCardProps> = ({
  feedback,
  onVote,
  onTitleClick
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center gap-0.5">
          <button
            onClick={() => onVote(feedback.id, 'up')}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            aria-label="Upvote"
          >
            <ChevronUp className="w-4 h-4 text-gray-600" />
          </button>
          <span className="text-sm font-semibold text-gray-900 min-w-[2ch] text-center">{feedback.votes}</span>
          <button
            onClick={() => onVote(feedback.id, 'down')}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            aria-label="Downvote"
          >
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <button
            onClick={() => onTitleClick(feedback)}
            className="block text-base font-semibold text-gray-900 hover:text-[#F85E17] mb-1 transition-colors truncate"
          >
            {feedback.title}
          </button>

          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {feedback.description}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              categoryColors[feedback.category as keyof typeof categoryColors]
            }`}>
              {feedback.category}
            </span>
            
            <div className="flex items-center text-gray-500">
              <MessageCircle className="w-4 h-4 mr-1" />
              <span className="text-xs">0</span>
            </div>

            <span className="text-xs text-gray-500 ml-auto">
              {new Date(feedback.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};