# Airline Disruption — Karate Automation Framework

Framework de automatización para el equipo de **Disrupciones** de una aerolínea.
Genera PNRs con disrupciones (UN, UNTK, FLCH, FLXX, DELAY) y produce fixtures
JSON versionados para validación en frontend (MMB).

## 🏗️ Arquitectura

```
Karate (JVM) ──► Mock Server ──► Fixture JSON ──► WebDriverIO (Frontend)
     │                                    │
     └── TypeScript (schema, scripts) ────┘
```

- **Backend:** Karate + Gherkin (simula endpoints con mock server)
- **Tipos y scripts:** TypeScript
- **Persistencia:** Fixtures JSON versionados (`shared/fixtures/`)

## 📋 Requisitos

| Herramienta | Versión mínima | Verificar con |
|---|---|---|
| Java | 21+ | `java --version` |
| Maven | 3.9+ | `mvn -version` |
| Node.js | 20+ | `node --version` |
| npm | 10+ | `npm --version` |

## 🚀 Instalación

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd airline-disruption-karate

# 2. Instalar dependencias npm
npm install

# 3. Copiar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 4. Verificar que Java y Maven funcionan
java --version
mvn -version
```

## 🧪 Ejecución de tests

```bash
# Todos los tests (entorno INT)
npm test

# Entorno específico
npm run test:dev
npm run test:pre

# En paralelo (4 hilos)
npm run test:parallel

# Solo el mock server
npm run mock:start
```

## 📁 Estructura

```
src/test/java/
├── mocks/              # Mock server y datos de respuesta
├── common/             # Utilidades reutilizables
├── pnr/                # Features de creación de PNR y check-in
├── disruption/         # Features de disrupción (UN, FLCH, ...)
└── e2e/                # Orquestador de lotes

shared/
├── fixtures/           # Fixtures JSON generados
├── types/              # Tipos TypeScript (contrato)
└── schemas/            # JSON Schema generado
```

## 🔧 Scripts disponibles

| Script | Descripción |
|---|---|
| `npm test` | Ejecuta todos los tests en INT |
| `npm run test:parallel` | Tests en paralelo (4 hilos) |
| `npm run generate:schema` | Regenera el JSON Schema desde TS |
| `npm run append:fixture` | Agrega PNRs a un fixture existente |
| `npm run cleanup:fixtures` | Limpia fixtures antiguos |
| `npm run typecheck` | Verifica tipos TypeScript |

## 🎭 Mock Server

El framework usa el **mock server de Karate** para simular todos los endpoints
del flujo (autenticación, availability, fare, orden, pago, issue, check-in,
disrupción). No se realizan llamadas a servicios reales.

- **Puerto:** 8080 (INT), 8081 (PRE), 8082 (DEV)
- **Configuración:** `karate-config.js` → `mockServer.enabled`
- **Datos:** `src/test/java/mocks/data/*.json`

Para cambiar a servicios reales, edita `mockServer.enabled = false` en
`karate-config.js`.

## 📊 Reportes

- **HTML Karate:** `target/karate-reports/karate-summary.html`
- **JUnit XML:** `target/surefire-reports/`
- **Logs:** `target/karate.log`

## 📄 Licencia

Uso interno — Equipo de Disrupciones.
