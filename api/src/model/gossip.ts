import { type UserId } from './user';

export interface GossipId {
  id: number;
}

export type Trust = 'positive' | 'negative';

export interface Gossip {
  id: GossipId;
  content: string;
  creator: UserId;
  creationDate: Date;
  trust: Array<{
    user: UserId;
    trust: Trust;
  }>;
}
