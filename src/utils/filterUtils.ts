import { Feedback, ChangelogEntry } from '../types/feedback';

export const filterRoadmapItems = (
  items: Feedback[],
  category: string,
  sortBy: string,
  isAuthenticated: boolean
): Feedback[] => {
  let filtered = [...items];

  // Apply category filter
  if (category !== 'All') {
    filtered = filtered.filter(item => item.category === category);
  }

  // Hide new and under-review items from roadmap
  filtered = filtered.filter(item => 
    !['new', 'under-review'].includes(item.status)
  );

  // Apply sorting
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'votes-desc':
        return b.votes - a.votes;
      case 'votes-asc':
        return a.votes - b.votes;
      case 'date-desc':
        return b.createdAt.getTime() - a.createdAt.getTime();
      case 'date-asc':
        return a.createdAt.getTime() - b.createdAt.getTime();
      default:
        return 0;
    }
  });

  return filtered;
};

export const filterChangelogEntries = (
  entries: ChangelogEntry[],
  type: string,
  sortBy: string,
  isAdmin: boolean
): ChangelogEntry[] => {
  let filtered = [...entries];
  const now = new Date();

  filtered = filtered.filter(entry => {
    // In changelog tab, only show published items
    if (!isAdmin) {
      return entry.status === 'published';
    }
    
    // In admin section, show all items
    return true;
  });

  // Apply type filter
  const normalizedType = type.toLowerCase();
  if (normalizedType !== 'all') {
    filtered = filtered.filter(entry => 
      entry.type === normalizedType
    );
  }

  // Apply sorting
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        // Use scheduledFor date for scheduled items, fallback to date
        const dateB = b.status === 'scheduled' && b.scheduledFor ? 
          new Date(b.scheduledFor).getTime() : b.date.getTime();
        const dateA = a.status === 'scheduled' && a.scheduledFor ? 
          new Date(a.scheduledFor).getTime() : a.date.getTime();
        return dateB - dateA;
      case 'date-asc':
        const dateB2 = b.status === 'scheduled' && b.scheduledFor ? 
          new Date(b.scheduledFor).getTime() : b.date.getTime();
        const dateA2 = a.status === 'scheduled' && a.scheduledFor ? 
          new Date(a.scheduledFor).getTime() : a.date.getTime();
        return dateA2 - dateB2;
      case 'type':
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  return filtered;
};

export const filterFeedback = (
  items: Feedback[],
  category: string,
  status: string,
  sortBy: string
): Feedback[] => {
  let filtered = [...items];

  // Apply category filter
  if (category !== 'All') {
    filtered = filtered.filter(item => item.category === category);
  }

  // Apply status filter
  if (status !== 'All') {
    filtered = filtered.filter(item => 
      item.status === status.toLowerCase().replace(' ', '-')
    );
  }

  // Apply sorting
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'votes-desc':
        return b.votes - a.votes;
      case 'votes-asc':
        return a.votes - b.votes;
      case 'date-desc':
        return b.createdAt.getTime() - a.createdAt.getTime();
      case 'date-asc':
        return a.createdAt.getTime() - b.createdAt.getTime();
      default:
        return 0;
    }
  });

  return filtered;
};