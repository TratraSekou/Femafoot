export type DocType = 'PDF' | 'DOCX' | 'XLSX' | 'IMAGE' | 'ZIP';
export type DocStatus = 'Public' | 'Privé' | 'Archivé' | 'Brouillon';

export interface FemaDocument {
  id: string;
  name: string;
  category: string;
  size: string;
  type: DocType;
  uploadDate: string;
  author: string;
  downloads: number;
  status: DocStatus;
  description: string;
  tags: string[];
}

export interface DocumentStats {
  total: number;
  categories: number;
  downloads: number;
  recent: number;
  archived: number;
}
