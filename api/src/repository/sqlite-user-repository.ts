import { type Statement } from 'sqlite3';
import { type Id } from '../model/id';
import { type UserRepository, type User } from '../model/user';
import { SQLiteRepositoryBase } from './sqlite-repository';

export class SQLiteUserRepository extends SQLiteRepositoryBase implements UserRepository {
  async find(userId: Id): Promise<User | null> {
    const query = 'SELECT * FROM AppUser WHERE id = ?';
    const stmt: Statement = await this.dbContext.prepareStatement(query, [userId]);
    const row = await this.dbContext.get(stmt);
    const user = row != null ? this.mapRowToUser(row) : null;
    await this.dbContext.finalizeStatement(stmt);
    return user;
  }

  async findByName(name: string): Promise<User | null> {
    const query = 'SELECT * FROM AppUser WHERE name = ?';
    const stmt: Statement = await this.dbContext.prepareStatement(query, [name]);
    const row = await this.dbContext.get(stmt);
    const user = row != null ? this.mapRowToUser(row) : null;
    await this.dbContext.finalizeStatement(stmt);
    return user;
  }

  async findAll(): Promise<User[]> {
    const query = 'SELECT * FROM AppUser';
    const stmt: Statement = await this.dbContext.prepareStatement(query);
    const rows = await this.dbContext.all(stmt);
    const users = rows.map((row) => this.mapRowToUser(row));
    await this.dbContext.finalizeStatement(stmt);
    return users;
  }

  async create(user: User): Promise<void> {
    const query = 'INSERT INTO AppUser (id, name, picture) VALUES (?, ?, ?)';
    const params = [user.id, user.name, user.picture ?? null];
    const stmt: Statement = await this.dbContext.prepareStatement(query, params);
    await this.dbContext.run(stmt);
    await this.dbContext.finalizeStatement(stmt);
  }

  private mapRowToUser(row: any): User {
    if (row != null && typeof row === 'object') {
      const typedRow = row as Record<string, any>;

      const userId = this.assertIdProperty(typedRow, 'id');
      const name = this.assertStringProperty(typedRow, 'name');
      const picture = this.assertOptionalStringProperty(typedRow, 'picture');

      return { id: userId, name, picture };
    }

    throw new Error('Mapping Error: The database row is not an object.');
  }
}
