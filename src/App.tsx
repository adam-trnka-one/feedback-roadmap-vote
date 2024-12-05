import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Logo } from './components/Logo';
import { FilterBar } from './components/FilterBar';
import { FeedbackCard } from './components/FeedbackCard';
import { RoadmapColumn } from './components/RoadmapColumn';
import { ChangelogEntry } from './components/ChangelogEntry';
import { feedbackItems, changelogEntries } from './data/mockData';
import { FeedbackDetailModal } from './components/FeedbackDetailModal';
import { FeedbackModal } from './components/FeedbackModal';
import { MessageSquarePlus } from 'lucide-react';
import { Feedback } from './types/feedback';
import { filterFeedback, filterRoadmapItems, filterChangelogEntries } from './utils/filterUtils';
import { RoadmapFilter } from './components/RoadmapFilter';
import { ChangelogFilter } from './components/ChangelogFilter';
import { AdminPanel } from './components/AdminPanel'
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginModal } from './components/LoginModal';
import { localStorageDB } from './services/localStorageDB';
import { Toaster, toast } from 'react-hot-toast';

function AppContent() {
  const { isAuthenticated, logout } = useAuth();

  // Initialize local storage with mock data if empty
  React.useEffect(() => {
    localStorageDB.initializeIfEmpty(feedbackItems, changelogEntries);
  }, []);

  const [activeTab, setActiveTab] = useState('feedback');
  const [items, setItems] = useState(localStorageDB.getFeedbackItems());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSort, setSelectedSort] = useState('votes-desc');
  const [roadmapCategory, setRoadmapCategory] = useState('All');
  const [roadmapSort, setRoadmapSort] = useState('votes-desc');
  const [changelogType, setChangelogType] = useState('All');
  const [changelogSort, setChangelogSort] = useState('date-desc');
  const [changelogEntryList, setChangelogEntryList] = useState(localStorageDB.getChangelogEntries());

  const handleVote = (id: string, direction: 'up' | 'down') => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, votes: item.votes + (direction === 'up' ? 1 : -1) } : item
    );
    setItems(updatedItems);
    localStorageDB.saveFeedbackItems(updatedItems);
    toast.success(`Vote ${direction === 'up' ? 'added' : 'removed'} successfully`, { duration: 5000 });
  };

  const handleSubmitFeedback = (feedback: {
    title: string;
    category: string;
    description: string;
    email: string;
    wantsUpdates: boolean;
  }) => {
    const newFeedback = {
      id: String(items.length + 1),
      title: feedback.title,
      description: feedback.description,
      votes: 0,
      status: 'new' as const,
      createdAt: new Date(),
      category: feedback.category
    };
    localStorageDB.addFeedbackItem(newFeedback);
    setItems(localStorageDB.getFeedbackItems());
    toast.success('Feedback submitted successfully', { duration: 5000 });
  };

  const handleUpdateFeedback = (updatedFeedback: Feedback) => {
    localStorageDB.updateFeedbackItem(updatedFeedback);
    setItems(localStorageDB.getFeedbackItems());
    toast.success('Feedback updated successfully', { duration: 5000 });
  };

  const handleDeleteFeedback = (id: string) => {
    localStorageDB.deleteFeedbackItem(id);
    setItems(localStorageDB.getFeedbackItems());
    toast.success('Feedback deleted successfully', { duration: 5000 });
  };

  const handleUpdateChangelog = (updatedEntry: ChangelogEntry) => {
    if (updatedEntry.id) {
      localStorageDB.updateChangelogEntry(updatedEntry);
    } else {
      localStorageDB.addChangelogEntry({
        ...updatedEntry,
        id: String(Date.now()),
        date: new Date()
      });
    }
    setChangelogEntryList(localStorageDB.getChangelogEntries());
    toast.success('Changelog updated successfully', { duration: 5000 });
  };

  const handleDeleteChangelog = (id: string) => {
    localStorageDB.deleteChangelogEntry(id);
    setChangelogEntryList(localStorageDB.getChangelogEntries());
    toast.success('Changelog entry deleted successfully', { duration: 5000 });
  };

  const handleUpdateUser = async (userData: Omit<User, 'id' | 'createdAt'>) => {
    if ('id' in userData) {
      localStorageDB.updateUser(userData.id, userData);
    } else {
      await localStorageDB.addUser(userData);
    }
    toast.success('User updated successfully', { duration: 5000 });
  };

  const handleDeleteUser = (id: string) => {
    localStorageDB.deleteUser(id);
    toast.success('User deleted successfully', { duration: 5000 });
  };
  
  const handleLogout = () => {
    logout(() => setActiveTab('feedback'));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'feedback':
        return (
          <div>
            <div className="flex justify-between items-start mb-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center px-6 py-3 bg-[#F85E17] text-white rounded-lg hover:bg-[#E04D0B] transition-colors"
              >
                <MessageSquarePlus className="w-5 h-5 mr-2" />
                Submit Feedback
              </button>
            </div>
            
            <FilterBar
              selectedCategory={selectedCategory}
              selectedStatus={selectedStatus}
              selectedSort={selectedSort}
              onCategoryChange={setSelectedCategory}
              onStatusChange={setSelectedStatus}
              onSortChange={setSelectedSort}
            />
            
            <div className="space-y-6">
              {filterFeedback(items, selectedCategory, selectedStatus, selectedSort, isAuthenticated).map(item => (
                <FeedbackCard
                  key={item.id}
                  feedback={item}
                  onVote={handleVote}
                  onTitleClick={setSelectedFeedback}
                />
              ))}
            </div>
          </div>
        );

      case 'roadmap':
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Product Roadmap</h2>
              <p className="text-gray-600">Track the progress of feature requests and improvements</p>
            </div>
            <RoadmapFilter
              selectedCategory={roadmapCategory}
              selectedSort={roadmapSort}
              onCategoryChange={setRoadmapCategory}
              onSortChange={setRoadmapSort}
            />
            <div className="flex gap-6 overflow-x-auto pb-6">
              <RoadmapColumn
                title="Planned"
                items={filterRoadmapItems(
                  items.filter(item => item.status === 'planned'),
                  roadmapCategory,
                  roadmapSort,
                  isAuthenticated
                )}
                onVote={handleVote}
                onTitleClick={setSelectedFeedback}
              />
              <RoadmapColumn
                title="In Progress"
                items={filterRoadmapItems(
                  items.filter(item => item.status === 'in-progress'),
                  roadmapCategory,
                  roadmapSort,
                  isAuthenticated
                )}
                onVote={handleVote}
                onTitleClick={setSelectedFeedback}
              />
              <RoadmapColumn
                title="Completed"
                items={filterRoadmapItems(
                  items.filter(item => item.status === 'completed'),
                  roadmapCategory,
                  roadmapSort,
                  isAuthenticated
                )}
                onVote={handleVote}
                onTitleClick={setSelectedFeedback}
              />
            </div>
          </div>
        );

      case 'changelog':
        return (
          <div>
            <ChangelogFilter
              selectedType={changelogType}
              selectedSort={changelogSort}
              onTypeChange={setChangelogType}
              onSortChange={setChangelogSort}
            />
            <div className="space-y-6">
              {filterChangelogEntries(
                changelogEntryList,
                changelogType,
                changelogSort, 
                false
              ).map(entry => (
                <ChangelogEntry key={entry.id} entry={entry} />
              ))}
            </div>
          </div>
        );

      case 'admin':
        if (!isAuthenticated) {
          setTimeout(() => setIsLoginModalOpen(true), 0);
          return null;
        }
        return (
          <div>
            <div className="flex justify-end mb-6">
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
            <AdminPanel
              feedbackItems={items}
              changelogEntries={filterChangelogEntries(changelogEntryList, 'All', 'date-desc', true)}
              onUpdateFeedback={handleUpdateFeedback}
              onDeleteFeedback={handleDeleteFeedback}
              onUpdateChangelog={handleUpdateChangelog}
              onDeleteChangelog={handleDeleteChangelog}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Logo />
          <p className="text-gray-600">Help us shape the future of our product</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        {renderContent()}
      </main>
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitFeedback}
      />
      <FeedbackDetailModal
        isOpen={selectedFeedback !== null}
        feedback={selectedFeedback!}
        onClose={() => setSelectedFeedback(null)}
        onVote={handleVote}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <AppContent />
    </AuthProvider>
  );
}

export default App;