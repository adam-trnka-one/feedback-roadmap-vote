export type Status = 'new' | 'planned' | 'in-progress' | 'completed' | 'under-review';

export interface Feedback {
  id: string;
  title: string;
  description: string;
  votes: number;
  status: Status;
  createdAt: Date;
  category: string;
}

export interface ChangelogEntry {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'feature' | 'improvement' | 'bugfix';
  image?: string;
  additionalDetails?: string;
  publishedAt?: Date;
  scheduledFor?: Date;
  status: 'draft' | 'scheduled' | 'published';
  deleted?: boolean;
}