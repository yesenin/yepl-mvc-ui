export type Team = {
  id: string;
  name: string;
  optaId: string | null;
  abbreviation: string | null;
};

export type Season = {
  id: string;
  title: string;
};

export type PaginatedResponse<TItem> = {
  total: number;
  skip: number;
  take: number;
  url: string;
  items: TItem[];
};

export type AsyncStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
