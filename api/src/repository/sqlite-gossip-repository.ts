import { type Statement } from 'sqlite3';
import {
  type GossipRepository,
  type Gossip,
  type Trust
} from '../model/gossip';
import { type Id } from '../model/id';
import { type SQLiteContext } from '../db/sqlite-context';

export class SQLiteGossipRepository implements GossipRepository {
  constructor(private readonly dbContext: SQLiteContext) {}

  async find(id: Id): Promise<Gossip | null> {
    const query =
      'SELECT Gossip.id, Gossip.content, Gossip.creatorId, Gossip.creationDate, Trust.userId, Trust.trust ' +
      'FROM Gossip ' +
      'LEFT JOIN Trust ON Gossip.id = Trust.gossipId ' +
      'WHERE Gossip.id = ?';
    const stmt: Statement = await this.dbContext.prepareStatement(query, [id]);
    const rows = await this.dbContext.all(stmt);

    if (rows.length === 0) {
      return null;
    }

    const gossip = this.mapRowToGossip(rows[0]);
    gossip.trust = rows
      .filter((row) => row.userId !== null && row.trust !== null)
      .map((row) => ({
        user: this.mapToUserId(row.userId),
        trust: row.trust as Trust
      }));

    await this.dbContext.finalizeStatement(stmt);

    return gossip;
  }

  async findAll(): Promise<Gossip[]> {
    const query =
      'SELECT Gossip.id, Gossip.content, Gossip.creatorId, Gossip.creationDate, Trust.userId, Trust.trust ' +
      'FROM Gossip ' +
      'LEFT JOIN Trust ON Gossip.id = Trust.gossipId';
    const stmt = await this.dbContext.prepareStatement(query);
    const rows = await this.dbContext.all(stmt);

    const gossips = this.mapGossips(rows);
    await this.dbContext.finalizeStatement(stmt);

    return gossips;
  }

  private mapGossips(rows: any[]): Gossip[] {
    const gossips: Gossip[] = [];
    const gossipMap = new Map<Id, Gossip>();

    for (const row of rows) {
      const gossipId = row.id as Id;

      if (!gossipMap.has(gossipId)) {
        const gossip = this.mapRowToGossip(row);
        gossip.trust = [];
        gossips.push(gossip);
        gossipMap.set(gossipId, gossip);
      }

      const trust =
        row.userId !== null && row.trust !== null
          ? { user: this.mapToUserId(row.userId), trust: row.trust as Trust }
          : null;

      if (trust != null) {
        gossipMap.get(gossipId)?.trust.push(trust);
      }
    }

    return gossips;
  }

  async create(gossip: Gossip): Promise<void> {
    const insertGossipQuery =
      'INSERT INTO Gossip (id, content, creatorId, creationDate) VALUES (?, ?, ?, ?)';
    const gossipParams = [
      gossip.id,
      gossip.content,
      gossip.creator,
      gossip.creationDate.toISOString()
    ];

    const stmt = await this.dbContext.prepareStatement(
      insertGossipQuery,
      gossipParams
    );
    await this.dbContext.exec(stmt);

    if (gossip.trust != null && gossip.trust.length > 0) {
      const insertTrustQuery =
        'INSERT INTO Trust (gossipId, userId, trust) VALUES (?, ?, ?)';
      for (const trustEntry of gossip.trust) {
        const trustParams = [gossip.id, trustEntry.user, trustEntry.trust];
        const innerStmt = await this.dbContext.prepareStatement(
          insertTrustQuery,
          trustParams
        );

        await this.dbContext.exec(innerStmt);
        await this.dbContext.finalizeStatement(innerStmt);
      }
    }

    await this.dbContext.finalizeStatement(stmt);
  }

  private mapRowToGossip(row: any): Gossip {
    const userId = row.creatorId as Id;

    return {
      id: row.id as Id,
      content: row.content as string,
      creator: userId,
      creationDate: new Date(row.creationDate),
      trust: []
    };
  }

  private mapToUserId(id: unknown): Id {
    return id as Id;
  }
}
