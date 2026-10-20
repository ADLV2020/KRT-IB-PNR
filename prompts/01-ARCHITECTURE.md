# 01 — Arquitectura del Proyecto

## 🗂️ Estructura de carpetas

```text
airline-disruption-karate/
├── pom.xml # Maven: dependencias Java/Karate
├── package.json # npm: scripts y herramientas TS
├── karate-config.js # Configuración global (entornos, mocks, URLs)
├── logback-test.xml # Logging
├── tsconfig.json # TypeScript
├── src/test/java/
│ ├── MockServerRunner.java # Arranca el mock server (integración en TestRunner)
│ ├── com/iberia/disruption/
│ │ └── TestRunner.java # Runner JUnit 5 principal
│ ├── common/
│ │ ├── utils.js # Utilidades reutilizables (IIFE)
│ │ └── generators.js # Generadores PNR/ticket
│ ├── mocks/
│ │ ├── mock-server.feature # Mock unificado
│ │ └── data/*.json # Respuestas mock
│ ├── pnr/
│ │ ├── create-pnr.feature # Flujo de compra → PNR
│ │ └── build-pnr.js # Builder del objeto PNR
│ ├── disruption/
│ │ ├── un.feature # UN
│ │ ├── untk.feature # UNTK
│ │ ├── flch.feature # FLCH
│ │ └── delay.feature # DELAY
│ ├── e2e/
│ │ ├── generate-batch.feature # Orquestador (todos los tipos)
│ │ └── build-fixture.js # Builder del fixture completo
│ └── types/
│ └── pnr-fixture.types.ts # Contrato TypeScript
├── shared/
│ ├── fixtures/ # Fixtures generados
│ ├── schemas/ # JSON Schema generado
│ └── types/ # Tipos compartidos
├── scripts/
│ ├── generate-schema.ts
│ ├── append-fixture.ts
│ └── cleanup-fixtures.ts
└── prompts/ # Esta carpeta
```

## 🔗 Flujo de datos

┌─────────────────────────────────────────────────────────────┐
│ FASE 1: BACKEND (Karate)                                    │
│                                                             │
│ Mock Server ◄──── Karate features ────► Fixture JSON        │
│ (localhost:8080) (create-pnr, (shared/fixtures/)            │
│ disruption/*)                                               │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ FASE 2: FRONTEND (WebDriverIO) — PENDIENTE                  │
│                                                             │
│ Fixture JSON ────► WDIO specs ────► MMB Browser             │
└─────────────────────────────────────────────────────────────┘


## 🎭 Mock Server

- **Tecnología:** Karate mock server en puerto 8080
- **Arranque:** `@BeforeAll` de `TestRunner.java`
- **Regla de oro:** el **nombre del Scenario ES el matcher**.
  
  ```gherkin
  Scenario: pathMatches('/api/auth/...') && methodIs('post')
    * def response = read('classpath:mocks/data/auth-response.json')
  ```


* Nunca uses @ignore en el Feature del mock server.

* Nunca uses .* en pathMatches → usa {var}.

## 🧩 Diseño de los features

### pnr/create-pnr.feature

* Marcado @ignore.
* Recibe argumentos: origin, destination, flightDate, flightType, tripShape, lastName.
* Ejecuta los 7 pasos del flujo de compra.
* Al final expone pnrData (objeto PNR completo).
* Se invoca con call read(...) args.

### disruption/{un,untk,flch,delay}.feature

* Marcados @ignore.
* Reciben pnrCode y segmentId.
* Devuelven disruption (objeto con el detalle).
* Se invocan con call read(...) args.

### e2e/generate-batch.feature

* Orquestador.
* Cada tipo de disrupción = un Scenario con su propio tag (@UN, @UNTK, @FLCH, @DELAY).
* Construye el fixture con build-fixture.js y lo escribe con utils.writeJson.

## 📦 Archivos .js — Regla de oro

Un archivo .js en Karate es UNA SOLA EXPRESIÓN IIFE:

```javascript
    (function () {
    function miFuncion() { /* ... */ }
    return { miFuncion: miFuncion };
    })()
```
* Sin var x = al principio.
* Sin x; al final.
* Sin call al invocarlo desde otro .js → solo desde read().

## 🔐 Configuración

Todo lo específico de entorno va en karate-config.js:

* mockServer.port, mockServer.baseUrl
* services.* URLs reales
* secrets.* (desde karate.properties)

## 📄 Fixtures versionados

* Ubicación: shared/fixtures/
* Convención: {ENV}_{SHAPE}_{DISRUPTION}.json
    Ej: INT_OW_DIRECTO_UN.json, PRE_RT_ESCALA_FLCH.json
* Append-only (para histórico)
* Idempotente: no duplicar pnrCode
