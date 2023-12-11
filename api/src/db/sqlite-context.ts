import { Database } from 'sqlite3';
import { type DbContext } from './dbcontext';
import Logger from 'jet-logger';

export class SQLiteContext implements DbContext {
  constructor(private readonly db: Database) {}

  get(
    query: string,
    params: any[],
    callback: (err: Error | null, row: any) => void
  ): void {
    this.db.get(query, params, callback);
  }

  all(query: string, callback: (err: Error | null, rows: any[]) => void): void {
    this.db.all(query, callback);
  }

  exec(query: string, callback: (err: Error | null) => void): void {
    this.db.exec(query, callback);
  }

  prepare(query: string): any {
    return this.db.prepare(query);
  }

  destroy(callback: (err: Error | null) => void): void {
    this.db.close(callback);
  }
}

export async function provideSQLite3Context(
  dbPath: string = ':memory:'
): Promise<SQLiteContext> {
  const db = new Database(dbPath);

  // Lee el contenido del archivo
  const schemaSQL = `
    -- USER
    CREATE TABLE IF NOT EXISTS AppUser (
    id INTEGER PRIMARY KEY,
    name TEXT,
    picture TEXT
    );

    -- GOSSIP
    CREATE TABLE IF NOT EXISTS Gossip (
    id INTEGER PRIMARY KEY,
    content TEXT,
    creatorId INTEGER,
    creationDate DATETIME,
    FOREIGN KEY (creatorId) REFERENCES AppUser(id)
    );

    -- TURST
    CREATE TABLE IF NOT EXISTS Trust (
    gossipId INTEGER,
    userId INTEGER,
    trust TEXT,
    FOREIGN KEY (gossipId) REFERENCES Gossip(id),
    FOREIGN KEY (userId) REFERENCES AppUser(id),
    PRIMARY KEY (gossipId, userId)
    );
`;

  await new Promise((resolve, reject) => {
    db.exec(schemaSQL, (err) => {
      if (err != null) {
        Logger.err('Error al ejecutar el esquema SQL:');
        Logger.err(err, true);
        reject(err);
      } else {
        Logger.info('Esquema SQL cargado correctamente.');
        resolve('');
      }
    });
  });

  return new SQLiteContext(db);
}
