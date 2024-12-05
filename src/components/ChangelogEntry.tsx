import React, { useState } from 'react';
import { Star, Zap, Bug } from 'lucide-react';
import { ChangelogEntry as ChangelogEntryType } from '../types/feedback';
import { ChangelogDetailModal } from './ChangelogDetailModal';

const typeIcons = {
  feature: <Star className="w-5 h-5 text-purple-500" />,
  improvement: <Zap className="w-5 h-5 text-blue-500" />,
  bugfix: <Bug className="w-5 h-5 text-green-500" />
};

const typeColors = {
  feature: 'bg-purple-100 text-purple-800',
  improvement: 'bg-blue-100 text-blue-800',
  bugfix: 'bg-green-100 text-green-800'
};

interface ChangelogEntryProps {
  entry: ChangelogEntryType;
}

export const ChangelogEntry: React.FC<ChangelogEntryProps> = ({ entry }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full text-left bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all hover:bg-gray-50 group"
      >
        <div className="flex flex-col md:flex-row gap-6">
          {entry.image && (
            <div className="md:w-1/3">
              <img
                src={entry.image}
                alt={entry.title}
                className="w-full h-48 md:h-full object-cover rounded-lg"
              />
            </div>
          )}
          
          <div className="flex-1">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-gray-50">
                {typeIcons[entry.type]}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#F85E17] transition-colors duration-200">
                    {entry.title}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    typeColors[entry.type]
                  }`}>
                    {entry.type}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-3 line-clamp-3">{entry.description}</p>
                
                <span className="text-sm text-gray-500">
                  {new Date(entry.status === 'scheduled' && entry.scheduledFor ? 
                    entry.scheduledFor : entry.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </button>
      <ChangelogDetailModal
        entry={entry}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};