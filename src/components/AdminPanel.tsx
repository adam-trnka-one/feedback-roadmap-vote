import React, { useState } from 'react';
import { Feedback, ChangelogEntry } from '../types/feedback';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { AdminFeedbackModal } from './AdminFeedbackModal';
import { AdminChangelogModal } from './AdminChangelogModal';
import { AdminFilterBar } from './AdminFilterBar';
import { AdminUserModal } from './AdminUserModal';
import { filterFeedback, filterChangelogEntries } from '../utils/filterUtils';
import { User } from '../types/user';
import { localStorageDB } from '../services/localStorageDB';

const statusColors = {
  'planned': 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  'completed': 'bg-green-100 text-green-800',
  'under-review': 'bg-purple-100 text-purple-800'
};

interface AdminPanelProps {
  feedbackItems: Feedback[];
  changelogEntries: ChangelogEntry[];
  onUpdateFeedback: (feedback: Feedback) => void;
  onDeleteFeedback: (id: string) => void;
  onUpdateChangelog: (entry: ChangelogEntry) => void;
  onDeleteChangelog: (id: string) => void;
  onUpdateUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  onDeleteUser: (id: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  feedbackItems,
  changelogEntries,
  onUpdateFeedback,
  onDeleteFeedback,
  onUpdateChangelog,
  onDeleteChangelog,
  onUpdateUser,
  onDeleteUser,
}) => {
  const [activeTab, setActiveTab] = useState<'feedback' | 'changelog' | 'users'>('feedback');
  const [isNewFeedbackModalOpen, setIsNewFeedbackModalOpen] = useState(false);
  const [isNewChangelogModalOpen, setIsNewChangelogModalOpen] = useState(false);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [selectedChangelog, setSelectedChangelog] = useState<ChangelogEntry | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSort, setSelectedSort] = useState('date-desc');
  const [users, setUsers] = useState<User[]>(localStorageDB.getUsers());

  // Refresh tables when items change
  React.useEffect(() => {
    setUsers(localStorageDB.getUsers());
  }, [feedbackItems, changelogEntries]);

  const handleCreateFeedback = (feedback: {
    title: string;
    category: string;
    description: string;
    status: Status;
  }) => {
    const newFeedback: Feedback = {
      id: String(Date.now()),
      title: feedback.title,
      description: feedback.description,
      votes: 0,
      status: feedback.status,
      createdAt: new Date(),
      category: feedback.category
    };
    onUpdateFeedback(newFeedback);
    setSelectedFeedback(null);
  };

  const handleCreateChangelog = (entry: {
    title: string;
    description: string;
    type: 'feature' | 'improvement' | 'bugfix';
    image?: string;
    additionalDetails?: string;
  }) => {
    const newEntry: ChangelogEntry = {
      id: String(Date.now()),
      title: entry.title,
      description: entry.description,
      type: entry.type,
      date: new Date(),
      image: entry.image,
      additionalDetails: entry.additionalDetails
    };
    onUpdateChangelog(newEntry);
    setSelectedChangelog(null);
  };

  const handleEditFeedback = (feedback: {
    title: string;
    category: string;
    description: string;
    status: Status;
  }) => {
    if (selectedFeedback) {
      const updatedFeedback: Feedback = {
        ...selectedFeedback,
        ...feedback
      };
      onUpdateFeedback(updatedFeedback);
      setSelectedFeedback(null);
    }
  };

  const handleEditChangelog = (entry: {
    title: string;
    description: string;
    type: 'feature' | 'improvement' | 'bugfix';
    image?: string;
    additionalDetails?: string;
  }) => {
    if (selectedChangelog) {
      const updatedEntry: ChangelogEntry = {
        ...selectedChangelog,
        ...entry
      };
      onUpdateChangelog(updatedEntry);
      setSelectedChangelog(null);
    }
  };

  const handleCreateUser = async (userData: Omit<User, 'id' | 'createdAt'>) => {
    await onUpdateUser(userData);
    setUsers(localStorageDB.getUsers());
    toast.success('User created and welcome email sent', { duration: 5000 });
  };

  const handleEditUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    if (selectedUser) {
      onUpdateUser({ ...userData, id: selectedUser.id });
      setUsers(localStorageDB.getUsers());
      setSelectedUser(null);
    }
  };

  const renderFeedbackTable = () => (
    <div className="overflow-x-auto">
      <AdminFilterBar
        type="feedback"
        selectedCategory={selectedCategory}
        selectedStatus={selectedStatus}
        selectedSort={selectedSort}
        onCategoryChange={setSelectedCategory}
        onStatusChange={setSelectedStatus}
        onSortChange={setSelectedSort}
      />
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Votes</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filterFeedback(
            feedbackItems,
            selectedCategory,
            selectedStatus,
            selectedSort,
            true
          ).map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.title}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  statusColors[item.status]
                }`}>
                  {item.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.votes}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.createdAt.toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => setSelectedFeedback(item)}
                  className="text-[#F85E17] hover:text-[#E04D0B] mr-3"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteFeedback(item.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderChangelogTable = () => (
    <div className="overflow-x-auto">
      <AdminFilterBar
        type="changelog"
        selectedCategory={selectedCategory}
        selectedSort={selectedSort}
        onCategoryChange={setSelectedCategory}
        onSortChange={setSelectedSort}
      />
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule/Published</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filterChangelogEntries(
            changelogEntries.filter(entry => !entry.deleted),
            selectedCategory,
            selectedSort,
            true
          ).map((entry) => (
            <tr key={entry.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.title}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.type}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  entry.status === 'published' ? 'bg-green-100 text-green-800' :
                  entry.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {entry.status === 'published' && entry.publishedAt
                  ? entry.publishedAt.toLocaleDateString()
                  : entry.status === 'scheduled' && entry.scheduledFor
                    ? entry.scheduledFor.toLocaleDateString()
                    : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {entry.date.toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => setSelectedChangelog(entry)}
                  className="text-[#F85E17] hover:text-[#E04D0B] mr-3"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteChangelog(entry.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderUsersTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {user.firstName} {user.lastName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.isAdmin ? 'Admin' : 'User'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.createdAt.toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => setSelectedUser(user)}
                  className="text-[#F85E17] hover:text-[#E04D0B] mr-3"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                {user.email !== 'admin' && (
                  <button
                    onClick={() => onDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'feedback'
                ? 'bg-[#F85E17] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('feedback')}
          >
            Feedback
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'changelog'
                ? 'bg-[#F85E17] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('changelog')}
          >
            Changelog
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'users'
                ? 'bg-[#F85E17] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </div>
        <button
          className="flex items-center px-4 py-2 bg-[#F85E17] text-white rounded-lg hover:bg-[#E04D0B] transition-colors"
          onClick={() => {
            switch (activeTab) {
              case 'feedback':
                setIsNewFeedbackModalOpen(true);
                break;
              case 'changelog':
                setIsNewChangelogModalOpen(true);
                break;
              case 'users':
                setIsNewUserModalOpen(true);
                break;
            }
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </button>
      </div>
      
      {activeTab === 'feedback' && renderFeedbackTable()}
      {activeTab === 'changelog' && renderChangelogTable()}
      {activeTab === 'users' && renderUsersTable()}

      <AdminFeedbackModal
        isOpen={isNewFeedbackModalOpen}
        feedback={null}
        onClose={() => setIsNewFeedbackModalOpen(false)}
        onSubmit={handleCreateFeedback}
      />
      <AdminFeedbackModal
        isOpen={selectedFeedback !== null}
        feedback={selectedFeedback}
        onClose={() => setSelectedFeedback(null)}
        onSubmit={handleEditFeedback}
      />
      <AdminChangelogModal
        isOpen={isNewChangelogModalOpen}
        entry={null}
        onClose={() => setIsNewChangelogModalOpen(false)}
        onSubmit={handleCreateChangelog}
      />
      <AdminChangelogModal
        isOpen={selectedChangelog !== null}
        entry={selectedChangelog}
        onClose={() => setSelectedChangelog(null)}
        onSubmit={handleEditChangelog}
      />
      <AdminUserModal
        isOpen={isNewUserModalOpen}
        user={null}
        onClose={() => setIsNewUserModalOpen(false)}
        onSubmit={handleCreateUser}
      />
      <AdminUserModal
        isOpen={selectedUser !== null}
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onSubmit={handleEditUser}
      />
    </div>
  );
};