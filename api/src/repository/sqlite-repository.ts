import { type SQLiteContext } from '../db/sqlite-context';
import { type Id } from '../model/id';

// SQLiteRepositoryBase con funciones compartidas
export abstract class SQLiteRepositoryBase {
  constructor(protected readonly sqliteContext: SQLiteContext) {}

  // Funciones de utilidad comunes
  protected assertNumberId(id: unknown, fieldName: string): Id {
    if (typeof id === 'number') {
      return id;
    }
    throw new Error(
      `Mapping Error: The "${fieldName}" field is not of the expected type (number).`
    );
  }

  protected assertStringProperty(
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

  protected assertOptionalStringProperty(
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
