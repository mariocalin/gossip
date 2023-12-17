import { type SQLiteContext } from '../db/sqlite-context';
import { type Id } from '../model/id';

export abstract class SQLiteRepositoryBase {
  constructor(protected readonly dbContext: SQLiteContext) {}

  protected assertIdProperty(row: Record<string, any>, fieldName: string): Id {
    const propertyValue = row[fieldName];

    if (typeof propertyValue === 'number') {
      return propertyValue;
    }

    throw new Error(`Mapping Error: The "${fieldName}" field is not of the expected type (number).`);
  }

  protected assertStringProperty(row: Record<string, any>, propertyName: string): string {
    const propertyValue = row[propertyName];
    if (typeof propertyValue === 'string') {
      return propertyValue;
    }

    throw new Error(`Mapping Error: The "${propertyName}" field is not of the expected type (string).`);
  }

  protected assertDateProperty(row: Record<string, any>, propertyName: string): Date {
    const propertyValue = row[propertyName];

    if (typeof propertyValue === 'string') {
      const dateValue = new Date(propertyValue);

      if (!isNaN(dateValue.getTime())) {
        return dateValue;
      }
    }

    throw new Error(`Mapping Error: The "${propertyName}" field is not of the expected type (Date).`);
  }

  protected assertOptionalStringProperty(row: Record<string, any>, propertyName: string): string | undefined {
    const propertyValue = row[propertyName];

    if (typeof propertyValue === 'string') {
      return propertyValue;
    }

    return undefined;
  }
}
