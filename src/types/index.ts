export interface VideoData {
  title: string;
  videoUrl: string;
  videoId: string;
  views: string;
  publishDate: string;
  thumbnailSmall: string;
  thumbnailLarge: string;
  homePage: string;
  length: string;
  description: string;
  channel: string;
  channelUrl: string;
}

export type ExportType = '20' | '200' | 'all';

export interface Message {
  action: string;
  data?: any;
}

export interface ExportOptions {
  filename: string;
  count: number;
}