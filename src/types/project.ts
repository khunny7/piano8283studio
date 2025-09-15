export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  year: number;
  repoUrl?: string;
  liveUrl?: string;
  image?: string;
}
