import { type Statement } from 'sqlite3';
import { type GossipRepository, type Gossip, type Trust } from '../model/gossip';
import { type Id } from '../model/id';
import { SQLiteRepositoryBase } from './sqlite-repository';

export class SQLiteGossipRepository extends SQLiteRepositoryBase implements GossipRepository {
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
        user: this.assertIdProperty(row, 'userId'),
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
          ? {
              user: this.assertIdProperty(row, 'userId'),
              trust: row.trust as Trust
            }
          : null;

      if (trust != null) {
        gossipMap.get(gossipId)?.trust.push(trust);
      }
    }

    return gossips;
  }

  async create(gossip: Gossip): Promise<void> {
    const statements: Statement[] = [];

    // Statement para insertar en Gossip
    const insertGossipQuery = 'INSERT INTO Gossip (id, content, creatorId, creationDate) VALUES (?, ?, ?, ?)';
    const gossipParams = [gossip.id, gossip.content, gossip.creator, gossip.creationDate.toISOString()];
    const gossipStatement = await this.dbContext.prepareStatement(insertGossipQuery, gossipParams);
    statements.push(gossipStatement);

    // Statements para insertar en Trust
    if (gossip.trust != null && gossip.trust.length > 0) {
      const insertTrustQuery = 'INSERT INTO Trust (gossipId, userId, trust) VALUES (?, ?, ?)';
      for (const trustEntry of gossip.trust) {
        const trustParams = [gossip.id, trustEntry.user, trustEntry.trust];
        const trustStatement = await this.dbContext.prepareStatement(insertTrustQuery, trustParams);
        statements.push(trustStatement);
      }
    }

    await this.dbContext.runInTransaction(statements);

    for (const stmt of statements) {
      await this.dbContext.finalizeStatement(stmt);
    }
  }

  async update(gossip: Gossip): Promise<void> {
    const currentGossip = this.find(gossip.id);

    if (currentGossip === undefined) {
      throw new Error('Cannot update a gossip that does not exist yet');
    }

    const statements: Statement[] = [];

    // Actualizar Gossip
    const updateGossipQuery = 'UPDATE Gossip SET content = ?, creatorId = ?, creationDate = ? WHERE id = ?';
    const updateGossipParams = [gossip.content, gossip.creator, gossip.creationDate.toISOString(), gossip.id];
    const updateGossipStatement = await this.dbContext.prepareStatement(updateGossipQuery, updateGossipParams);
    statements.push(updateGossipStatement);

    // Actualizar Trust (si es necesario)
    if (gossip.trust != null && gossip.trust.length > 0) {
      const deleteTrustQuery = 'DELETE FROM Trust WHERE gossipId = ?';
      const deleteTrustParams = [gossip.id];
      const deleteTrustStatement = await this.dbContext.prepareStatement(deleteTrustQuery, deleteTrustParams);
      statements.push(deleteTrustStatement);

      const insertTrustQuery = 'INSERT INTO Trust (gossipId, userId, trust) VALUES (?, ?, ?)';
      for (const trustEntry of gossip.trust) {
        const insertTrustParams = [gossip.id, trustEntry.user, trustEntry.trust];
        const insertTrustStatement = await this.dbContext.prepareStatement(insertTrustQuery, insertTrustParams);
        statements.push(insertTrustStatement);
      }
    }

    await this.dbContext.runInTransaction(statements);

    for (const stmt of statements) {
      await this.dbContext.finalizeStatement(stmt);
    }
  }

  private mapRowToGossip(row: any): Gossip {
    return {
      id: this.assertIdProperty(row, 'id'),
      content: this.assertStringProperty(row, 'content'),
      creator: this.assertIdProperty(row, 'creatorId'),
      creationDate: this.assertDateProperty(row, 'creationDate'),
      trust: []
    };
  }
}
