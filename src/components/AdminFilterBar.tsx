import React from 'react';
import { Filter } from 'lucide-react';

interface AdminFilterBarProps {
  type: 'feedback' | 'changelog';
  selectedCategory: string;
  selectedStatus?: string;
  selectedSort: string;
  onCategoryChange: (category: string) => void;
  onStatusChange?: (status: string) => void;
  onSortChange: (sort: string) => void;
}

const categories = ['All', 'Feature Request', 'Bug Report', 'UI/UX', 'Performance', 'Documentation', 'Other'];
const statuses = ['All', 'Under Review', 'Planned', 'In Progress', 'Completed'];
const feedbackSortOptions = [
  { value: 'votes-desc', label: 'Most Voted' },
  { value: 'votes-asc', label: 'Least Voted' },
  { value: 'date-desc', label: 'Newest' },
  { value: 'date-asc', label: 'Oldest' }
];
const changelogSortOptions = [
  { value: 'date-desc', label: 'Newest' },
  { value: 'date-asc', label: 'Oldest' },
  { value: 'type', label: 'Type' }
];

export const AdminFilterBar: React.FC<AdminFilterBarProps> = ({
  type,
  selectedCategory,
  selectedStatus,
  selectedSort,
  onCategoryChange,
  onStatusChange,
  onSortChange
}) => {
  const sortOptions = type === 'feedback' ? feedbackSortOptions : changelogSortOptions;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Filter className="w-4 h-4" />
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F85E17] focus:border-[#F85E17]"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {type === 'feedback' && onStatusChange && (
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F85E17] focus:border-[#F85E17]"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F85E17] focus:border-[#F85E17]"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};