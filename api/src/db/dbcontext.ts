import { Database } from 'sqlite3';
import Logger from 'jet-logger';

const db = new Database(':memory:');

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

// Ejecuta las consultas en la base de datos
db.exec(schemaSQL, (err) => {
  if (err != null) {
    Logger.err('Error al ejecutar el esquema SQL:');
    Logger.err(err, true);
  } else {
    Logger.info('Esquema SQL cargado correctamente.');
  }
});

export default db;
