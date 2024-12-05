import React, { useMemo } from 'react';
import { Feedback } from '../types/feedback';
import { RoadmapCard } from './RoadmapCard';
import { Clock, PlayCircle, CheckCircle } from 'lucide-react';

const statusIcons = {
  planned: Clock,
  'in-progress': PlayCircle,
  completed: CheckCircle
};

const statusColors = {
  planned: 'bg-yellow-50 border-yellow-200',
  'in-progress': 'bg-blue-50 border-blue-200',
  completed: 'bg-green-50 border-green-200'
};

interface RoadmapColumnProps {
  title: string;
  items: Feedback[];
  onVote: (id: string, direction: 'up' | 'down') => void;
  onTitleClick: (feedback: Feedback) => void;
}

export const RoadmapColumn: React.FC<RoadmapColumnProps> = ({ title, items, onVote, onTitleClick }) => {
  const status = title.toLowerCase().replace(' ', '-');
  const Icon = statusIcons[status as keyof typeof statusIcons];
  
  const totalVotes = useMemo(() => {
    return items.reduce((sum, item) => sum + item.votes, 0);
  }, [items]);

  return (
    <div className={`flex-1 min-w-[350px] ${statusColors[status as keyof typeof statusColors]} rounded-xl border p-4`}>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{items.length} {items.length === 1 ? 'item' : 'items'}</span>
          <span>{totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}</span>
        </div>
      </div>
      
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {items.map(item => (
          <RoadmapCard
            key={item.id}
            feedback={item}
            onVote={onVote}
            onTitleClick={onTitleClick}
          />
        ))}
        {items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No items in this column
          </div>
        )}
      </div>
    </div>
  );
};