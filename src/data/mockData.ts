import { Feedback, ChangelogEntry } from '../types/feedback';

export const feedbackItems: Feedback[] = [
  {
    id: '1',
    title: 'Dark mode support',
    description: 'Add dark mode support for better visibility in low-light conditions',
    votes: 156,
    status: 'in-progress',
    createdAt: new Date('2024-02-15'),
    category: 'UI/UX'
  },
  {
    id: '2',
    title: 'Mobile app',
    description: 'Native mobile application for iOS and Android',
    votes: 243,
    status: 'planned',
    createdAt: new Date('2024-02-10'),
    category: 'Platform'
  },
  {
    id: '3',
    title: 'API Documentation',
    description: 'Comprehensive API documentation with examples',
    votes: 89,
    status: 'completed',
    createdAt: new Date('2024-02-01'),
    category: 'Developer Tools'
  }
];

export const changelogEntries: ChangelogEntry[] = [
  {
    id: '1',
    title: 'New Dashboard Layout',
    description: 'We\'ve completely redesigned our dashboard with a focus on improved usability and a modern aesthetic. The new layout provides better organization of key metrics and more intuitive navigation.',
    date: new Date('2024-02-20'),
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000',
    type: 'feature',
    additionalDetails: '• Reorganized navigation for better workflow\n• New customizable widgets\n• Improved data visualization\n• Better mobile responsiveness\n• Dark mode support',
    status: 'published',
    publishedAt: new Date('2024-02-20')
  },
  {
    id: '2',
    title: 'Performance Improvements',
    description: 'Major performance optimizations resulting in significantly faster page loads and reduced server response times across the platform.',
    date: new Date('2024-02-15'),
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000',
    type: 'improvement',
    additionalDetails: '• 60% reduction in initial page load time\n• Implemented lazy loading for images\n• Optimized database queries\n• Added Redis caching layer\n• Compressed static assets',
    status: 'scheduled',
    scheduledFor: new Date('2024-03-01')
  },
  {
    id: '3',
    title: 'Fixed Login Issues',
    description: 'Addressed several critical authentication issues that were affecting user login experience and security.',
    date: new Date('2024-02-10'),
    image: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?auto=format&fit=crop&q=80&w=1000',
    type: 'bugfix',
    additionalDetails: '• Fixed token expiration handling\n• Resolved SSO integration issues\n• Enhanced password reset flow\n• Improved error messaging\n• Added additional security measures',
    status: 'draft'
  }
];