
import { Block } from './BlockTypes';
import { Socials } from './Socials';
import { WidgetConfig } from './WidgetConfig';

/**
 * Data structure for a README project
 */
export interface ReadmeProject {
  id: string;
  name: string;
  githubUsername?: string;
  blocks: Block[];
  socials?: Socials;
  widgetConfig?: Partial<WidgetConfig>;
  lastUpdated?: Date;
  createdAt?: number;
  updatedAt?: number;
  settings?: {
    username: string;
    theme: 'light' | 'dark' | 'auto';
  };
}

/**
 * Data structure for auto-save functionality
 */
export interface AutoSaveData {
  blocks: Block[];
  projectName: string;
  githubUsername: string;
  socials: Socials;
  widgetConfig: Partial<WidgetConfig>;
  timestamp: number;
}
