export type Language = "en" | "pt" | "es";

export interface DownloadItem {
  title: string;
  uploadDate: string;
  fileSize: string;
  uris: string[];
  sourceId: string; // Internal ID to track source
  sourceName: string;
  sourceColor: string;
}

export interface Source {
  id: string;
  name: string;
  url: string;
  color: string;
  lastFetched?: string;
  isLocal?: boolean;
  localData?: SourceData;
}

export interface Settings {
  theme: string;
  itemsPerPage: number | "all";
  columns: 1 | 2 | 3 | 4;
  widescreen: boolean;
  language: Language;
}

export interface SourceData {
  name?: string;
  downloads: {
    title: string;
    uploadDate: string;
    fileSize: string;
    uris: string[];
  }[];
}
