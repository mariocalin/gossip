export interface User {
  id: number;
  name: string;
  picture?: string;
}

export type Trust = 'positive' | 'negative';

export interface GossipTrust {
  user: number;
  trust: Trust;
}

export interface Gossip {
  id: number;
  content: string;
  creator: number;
  creationDate: Date;
  trust: GossipTrust[];
}
