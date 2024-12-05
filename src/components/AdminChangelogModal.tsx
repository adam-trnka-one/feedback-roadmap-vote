import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AdminChangelogModalProps {
  isOpen: boolean;
  entry: ChangelogEntry | null;
  onClose: () => void;
  onSubmit: (entry: {
    title: string;
    description: string;
    type: 'feature' | 'improvement' | 'bugfix';
    image?: string;
    additionalDetails?: string;
    status: 'draft' | 'scheduled' | 'published';
    scheduledFor?: Date;
  }) => void;
}

const types = ['feature', 'improvement', 'bugfix'] as const;

export const AdminChangelogModal: React.FC<AdminChangelogModalProps> = ({
  isOpen,
  entry,
  onClose,
  onSubmit
}) => {
  const [title, setTitle] = useState(entry?.title || '');
  const [description, setDescription] = useState(entry?.description || '');
  const [type, setType] = useState<'feature' | 'improvement' | 'bugfix'>(entry?.type || 'feature');
  const [image, setImage] = useState(entry?.image || '');
  const [additionalDetails, setAdditionalDetails] = useState(entry?.additionalDetails || '');
  const [status, setStatus] = useState<'draft' | 'scheduled' | 'published'>(entry?.status || 'draft');
  const [scheduledFor, setScheduledFor] = useState<string>(
    entry?.scheduledFor ? new Date(entry.scheduledFor).toISOString().split('T')[0] : ''
  );

  const handlePublish = () => {
    setStatus('published');
    onSubmit({
      title,
      description,
      type,
      image,
      additionalDetails,
      status: 'published',
      publishedAt: new Date()
    });
    onClose();
  };

  const handleUnpublish = () => {
    setStatus('draft');
    onSubmit({
      title,
      description,
      type,
      image,
      additionalDetails,
      status: 'draft'
    });
    onClose();
  };

  React.useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setDescription(entry.description);
      setType(entry.type);
      setImage(entry.image || '');
      setAdditionalDetails(entry.additionalDetails || '');
      setStatus(entry.status);
      setScheduledFor(entry.scheduledFor ? new Date(entry.scheduledFor).toISOString().split('T')[0] : '');
    } else {
      setTitle('');
      setDescription('');
      setType('feature');
      setImage('');
      setAdditionalDetails('');
      setStatus('draft');
      setScheduledFor('');
    }
  }, [entry]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      type,
      image,
      additionalDetails,
      status,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined
    });
    onClose();
    setTitle('');
    setDescription('');
    setType('feature');
    setImage('');
    setAdditionalDetails('');
    setStatus('draft');
    setScheduledFor('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {entry ? 'Edit Changelog Entry' : 'Create New Changelog Entry'}
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
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as typeof types[number])}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F85E17] focus:border-[#F85E17]"
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
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

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Image URL (optional)
            </label>
            <input
              type="url"
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F85E17] focus:border-[#F85E17]"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label htmlFor="additionalDetails" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Details (optional)
            </label>
            <textarea
              id="additionalDetails"
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F85E17] focus:border-[#F85E17]"
              placeholder="• Bullet point 1&#10;• Bullet point 2&#10;• Bullet point 3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={status === 'draft'}
                  onChange={(e) => {
                    setStatus('draft');
                    setScheduledFor('');
                  }}
                  className="h-4 w-4 text-[#F85E17] focus:ring-[#F85E17] border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Draft</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="scheduled"
                  checked={status === 'scheduled'}
                  onChange={(e) => setStatus('scheduled')}
                  className="h-4 w-4 text-[#F85E17] focus:ring-[#F85E17] border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Scheduled</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={status === 'published'}
                  onChange={(e) => {
                    setStatus('published');
                    setScheduledFor('');
                  }}
                  className="h-4 w-4 text-[#F85E17] focus:ring-[#F85E17] border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Published</span>
              </label>
            </div>
          </div>

          {status === 'scheduled' && (
            <div>
              <label htmlFor="scheduledFor" className="block text-sm font-medium text-gray-700 mb-1">
                Schedule Date
              </label>
              <input
                type="date"
                id="scheduledFor"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F85E17] focus:border-[#F85E17]"
                required={status === 'scheduled'}
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            {status === 'published' ? (
              <button
                type="button"
                onClick={handleUnpublish}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50"
              >
                Unpublish
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePublish}
                className="px-4 py-2 text-sm font-medium text-green-600 bg-white border border-green-300 rounded-lg hover:bg-green-50"
              >
                Publish Now
              </button>
            )}
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
              {entry ? 'Save Changes' : 'Create Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};