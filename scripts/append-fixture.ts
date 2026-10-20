import * as fs from 'fs';
import * as path from 'path';
import { PnrFixture, PNR } from '../shared/types/pnr-fixture.types';

export function appendPnrs(filePath: string, newPnrs: PNR[]): void {
  let fixture: PnrFixture;

  if (fs.existsSync(filePath)) {
    fixture = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const existing = new Set(fixture.pnrs.map((p: PNR) => p.pnrCode));
    const unique = newPnrs.filter((p) => !existing.has(p.pnrCode));
    fixture.pnrs.push(...unique);
    fixture.generatedAt = new Date().toISOString();
    console.log(`➕ ${unique.length} PNRs agregados (${newPnrs.length - unique.length} duplicados ignorados)`);
  } else {
    fixture = {
      $schema: './pnr-fixture.schema.json',
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      generator: {} as any,
      stats: {} as any,
      pnrs: newPnrs,
    };
  }

  fs.writeFileSync(filePath, JSON.stringify(fixture, null, 2));
  console.log(`✅ Fixture actualizado: ${filePath}`);
}

// Uso desde CLI
if (require.main === module) {
  const [,, fixturePath, pnrsJson] = process.argv;
  if (!fixturePath || !pnrsJson) {
    console.error('Uso: ts-node append-fixture.ts <fixture.json> \'[{...}]\'');
    process.exit(1);
  }
  appendPnrs(fixturePath, JSON.parse(pnrsJson));
}
