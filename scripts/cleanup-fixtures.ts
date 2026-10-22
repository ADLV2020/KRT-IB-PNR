// scripts/cleanup-fixtures.ts
import * as fs from 'fs';
import * as path from 'path';
import { PnrFixture } from '../src/test/java/types/pnr-fixture.types';

const FIXTURES_DIR = path.join(__dirname, '..', 'shared', 'fixtures');
const DAYS_TO_KEEP = 30;

function cleanupFixtures() {
  const files = fs.readdirSync(FIXTURES_DIR).filter(f => f.endsWith('.json'));
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - DAYS_TO_KEEP);

  files.forEach(file => {
    const filePath = path.join(FIXTURES_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const fixture: PnrFixture = JSON.parse(content);
    
    // Filtra los PNRs más antiguos que la fecha de corte.
    const originalCount = fixture.pnrs.length;
    fixture.pnrs = fixture.pnrs.filter(pnr => new Date(pnr.createdAt) > cutoffDate);
    
    const removedCount = originalCount - fixture.pnrs.length;

    if (removedCount > 0) {
      // Recalcula las estadísticas (simplificado, deberías tener una función para esto)
      fixture.stats.totalPnrs = fixture.pnrs.length;
      fixture.generatedAt = new Date().toISOString();
      
      fs.writeFileSync(filePath, JSON.stringify(fixture, null, 2));
      console.log(`🧹 Limpiado ${file}: ${removedCount} PNRs eliminados.`);
    }
  });
}

cleanupFixtures();
console.log('✅ Limpieza de fixtures completada.');
