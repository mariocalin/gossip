import db from '../db/dbcontext';
import { type UserRepository, type User, type UserId } from '../model/user';
import { isNullOrUndefined } from '../utils';

export class SQLiteUserRepository implements UserRepository {
  async find(userId: UserId): Promise<User | null> {
    const query = 'SELECT * FROM AppUser WHERE id = ?';

    return await new Promise((resolve, reject) => {
      db.get(query, [userId.id], (err, row) => {
        if (err != null) {
          reject(err);
        } else {
          resolve(this.mapRowToUser(row));
        }
      });
    });
  }

  async findByName(name: string): Promise<User | null> {
    const query = 'SELECT * FROM AppUser WHERE name = ?';

    return await new Promise((resolve, reject) => {
      db.get(query, [name], (err, row) => {
        if (err != null) {
          reject(err);
        } else if (isNullOrUndefined(row)) {
          resolve(null);
        } else {
          resolve(this.mapRowToUser(row));
        }
      });
    });
  }

  async findAll(): Promise<User[]> {
    const query = 'SELECT * FROM AppUser';

    return await new Promise((resolve, reject) => {
      db.all(query, (err, rows) => {
        if (err != null) {
          reject(err);
        } else {
          try {
            const users = rows.map((row) => this.mapRowToUser(row));
            resolve(users);
          } catch (mappingError) {
            reject(mappingError);
          }
        }
      });
    });
  }

  async save(user: User): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      const query = 'INSERT INTO AppUser (id, name, picture) VALUES (?, ?, ?)';
      const params = [user.id.id, user.name, user.picture ?? null];

      const stmt = db.prepare(query);

      stmt.run(params, function (err) {
        stmt.finalize();
        if (err != null) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  private mapRowToUser(row: unknown): User {
    if (row != null && typeof row === 'object') {
      const typedRow = row as Record<string, any>;

      const userId = this.mapToUserId(typedRow.id);
      const name = this.assertStringProperty(typedRow, 'name');
      const picture = this.assertOptionalStringProperty(typedRow, 'picture');

      if (typeof userId.id !== 'number') {
        throw new Error('Mapping Error: Incorrect type in the database row.');
      }

      return { id: userId, name, picture };
    }

    throw new Error('Mapping Error: The database row is not an object.');
  }

  private mapToUserId(id: unknown): UserId {
    if (typeof id === 'number') {
      return { id };
    }

    throw new Error(
      'Mapping Error: The "id" field is not of the expected type (number).'
    );
  }

  private assertStringProperty(
    row: Record<string, any>,
    propertyName: string
  ): string {
    const propertyValue = row[propertyName];
    if (typeof propertyValue === 'string') {
      return propertyValue;
    }
    throw new Error(
      `Mapping Error: The "${propertyName}" field is not of the expected type (string).`
    );
  }

  private assertOptionalStringProperty(
    row: Record<string, any>,
    propertyName: string
  ): string | undefined {
    const propertyValue = row[propertyName];
    if (typeof propertyValue === 'string') {
      return propertyValue;
    }

    return undefined;
  }
}
