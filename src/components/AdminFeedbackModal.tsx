import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Status } from '../types/feedback';

import { statusColors } from '../utils/statusColors';

interface AdminFeedbackModalProps {
  isOpen: boolean;
  feedback: Feedback | null;
  onClose: () => void;
  onSubmit: (feedback: {
    title: string;
    category: string;
    description: string;
    status: Status;
  }) => void;
}

const categories = [
  'Feature Request',
  'Bug Report',
  'UI/UX',
  'Performance',
  'Documentation',
  'Other'
];

const statuses: Status[] = ['new', 'under-review', 'planned', 'in-progress', 'completed'];

export const AdminFeedbackModal: React.FC<AdminFeedbackModalProps> = ({
  isOpen,
  feedback,
  onClose,
  onSubmit
}) => {
  const [title, setTitle] = useState(feedback?.title || '');
  const [category, setCategory] = useState(feedback?.category || categories[0]);
  const [description, setDescription] = useState(feedback?.description || '');
  const [status, setStatus] = useState<Status>(feedback?.status || 'new');

  React.useEffect(() => {
    if (feedback) {
      setTitle(feedback.title);
      setCategory(feedback.category);
      setDescription(feedback.description);
      setStatus(feedback.status);
    } else {
      setTitle('');
      setCategory(categories[0]);
      setDescription('');
      setStatus('new');
    }
  }, [feedback]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, category, description, status });
    onClose();
    setTitle('');
    setCategory(categories[0]);
    setDescription('');
    setStatus('new');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {feedback ? 'Edit Feedback' : 'Create New Feedback'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F85E17] focus:border-[#F85E17]"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F85E17] focus:border-[#F85E17]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="space-y-2">
              {statuses.map((stat) => (
                <label key={stat} className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value={stat}
                    checked={status === stat}
                    onChange={(e) => setStatus(e.target.value as Status)}
                    className="h-4 w-4 text-[#F85E17] focus:ring-[#F85E17] border-gray-300"
                  />
                  <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    statusColors[stat]
                  }`}>
                    {stat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F85E17] focus:border-[#F85E17]"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[#F85E17] rounded-lg hover:bg-[#E04D0B]"
            >
              {feedback ? 'Save Changes' : 'Create Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};