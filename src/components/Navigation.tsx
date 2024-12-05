import React from 'react';
import { Layout, MessageSquare, GitPullRequest, Settings } from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItem> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
      isActive
        ? 'bg-[#FFF1EC] text-[#F85E17]'
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    {icon}
    <span className="ml-2 font-medium">{label}</span>
  </button>
);

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="flex gap-2 mb-8">
      <NavItem
        label="Feedback"
        icon={<MessageSquare className="w-5 h-5" />}
        isActive={activeTab === 'feedback'}
        onClick={() => onTabChange('feedback')}
      />
      <NavItem
        label="Roadmap"
        icon={<GitPullRequest className="w-5 h-5" />}
        isActive={activeTab === 'roadmap'}
        onClick={() => onTabChange('roadmap')}
      />
      <NavItem
        label="Changelog"
        icon={<Layout className="w-5 h-5" />}
        isActive={activeTab === 'changelog'}
        onClick={() => onTabChange('changelog')}
      />
      <NavItem
        label="Admin"
        icon={<Settings className="w-5 h-5" />}
        isActive={activeTab === 'admin'}
        onClick={() => onTabChange('admin')}
      />
    </nav>
  );
};