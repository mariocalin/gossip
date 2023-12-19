import { type Id } from './id';

export type Trust = 'positive' | 'negative';
export interface GossipTrust {
  user: Id;
  trust: Trust;
}

export interface Gossip {
  id: Id;
  content: string;
  creator: Id;
  creationDate: Date;
  trust: GossipTrust[];
}

export interface GossipRepository {
  find: (id: Id) => Promise<Gossip | null>;
  findAll: () => Promise<Gossip[]>;
  create: (gossip: Gossip) => Promise<void>;
}
