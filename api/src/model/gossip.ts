import { type Id } from './id';

export type Trust = 'positive' | 'negative';

export interface Gossip {
  id: Id;
  content: string;
  creator: Id;
  creationDate: Date;
  trust: Array<{
    user: Id;
    trust: Trust;
  }>;
}
