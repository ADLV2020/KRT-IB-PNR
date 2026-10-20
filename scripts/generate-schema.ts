import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const TYPES_PATH = path.join(__dirname, '..', 'shared', 'types', 'pnr-fixture.types.ts');
const OUTPUT_PATH = path.join(__dirname, '..', 'shared', 'schemas', 'pnr-fixture.schema.json');

// Asegurar que existe el directorio de salida
fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });

console.log('🔧 Generando JSON Schema desde TypeScript...');

execSync(
  `npx ts-json-schema-generator --path "${TYPES_PATH}" --type PnrFixture --out "${OUTPUT_PATH}"`,
  { stdio: 'inherit' }
);

console.log('✅ Schema generado:', OUTPUT_PATH);
