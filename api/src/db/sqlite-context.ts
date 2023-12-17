import { type Statement, type Database } from 'sqlite3';
import Logger from 'jet-logger';

export class SQLiteContext {
  constructor(private readonly db: Database) {}

  async get(stmt: Statement): Promise<any> {
    return await new Promise((resolve, reject) => {
      stmt.get((err, row) => {
        if (err != null) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async all(stmt: Statement): Promise<any[]> {
    return await new Promise((resolve, reject) => {
      stmt.all((err, rows) => {
        if (err != null) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async exec(stmt: Statement): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      stmt.run((err) => {
        if (err != null) {
          Logger.err(`Error executing statement.`);
          Logger.err(err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async run(stmt: Statement): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      stmt.run(function (err: null) {
        if (err != null) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async prepareStatement(
    query: string,
    params: any[] = []
  ): Promise<Statement> {
    return await new Promise((resolve, reject) => {
      const stmt = this.db.prepare(query, (err) => {
        if (err != null) {
          Logger.err(`Error preparing statement.`);
          Logger.err(err);
          reject(err);
        }
      });

      stmt.bind(params, (err: any) => {
        if (err != null) {
          Logger.err(`Error binding parameters to statement.`);
          Logger.err(err);
          reject(err);
        }
      });

      resolve(stmt);
    });
  }

  async finalizeStatement(stmt: Statement): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      stmt.finalize((err) => {
        if (err != null) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async destroy(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.db.close((err) => {
        if (err != null) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
