
# 05 — Cómo Agregar una Nueva Disrupción

Ejemplo: agregar **FLXX** (por ejemplo, cancelación).

## 📋 Pasos

### 1. Crear el feature de disrupción

`src/test/java/disruption/flxx.feature`:

```gherkin
    @ignore
    Feature: Disrupcion FLXX

        Scenario: Aplicar disrupcion FLXX a un segmento
            * url mockServer.baseUrl
            * configure headers = headers

            Given path '/Reaccom/Reaccom_Disruption_Services'
            And request { pnr: '#(pnrCode)', segmentId: '#(segmentId)', type: 'FLXX' }
            When method post
            Then status 200
            * def disruption = response
            * match disruption.type == 'FLXX'
            * match disruption.status == 'APPLIED'
            * print '[OK] Disrupcion FLXX aplicada a', pnrCode
```

### 2. Actualizar el mock server

src/test/java/mocks/mock-server.feature — el endpoint de disrupción ya
matchea cualquier tipo. Solo asegúrate de que devuelva el tipo correcto.

Si necesitas respuesta específica para FLXX, agrega un Scenario antes
del genérico:

```gherkin
    Scenario: pathMatches('/Reaccom/Reaccom_Disruption_Services') && methodIs('post') && request.type == 'FLXX'
        * def response = { disruptionId: 'DIS-FLXX-001', type: 'FLXX', status: 'APPLIED', ... }
```

### 3. Actualizar el orquestador

src/test/java/e2e/generate-batch.feature — añade un Scenario nuevo:

```gherkin
  @FLXX
  Scenario: Generar lote OW Directo con disrupcion FLXX
    * def pnrs = []

    * def args1 = { origin: 'MAD', destination: 'BER', flightDate: '2026-10-20', flightType: 'OW', tripShape: 'DIRECT', lastName: 'TEST' }
    * def result1 = call read('classpath:pnr/create-pnr.feature') args1
    * def pnrs = karate.append(pnrs, result1.pnrData)

    * def args2 = { origin: 'BCN', destination: 'FCO', flightDate: '2026-11-15', flightType: 'OW', tripShape: 'DIRECT', lastName: 'TEST' }
    * def result2 = call read('classpath:pnr/create-pnr.feature') args2
    * def pnrs = karate.append(pnrs, result2.pnrData)

    * def argsDis = { pnrCode: '#(pnrs[0].pnrCode)', segmentId: 'SEG-1' }
    * def disruptionResult = call read('classpath:disruption/flxx.feature') argsDis
    * set pnrs[0].trips[0].segments[0].disruption = disruptionResult.disruption
    * set pnrs[0].hasDisruption = true
    * set pnrs[0].disruptionTypes = ['FLXX']

    * def fixture = fixtureBuilder.build(pnrs, 'INT', 'OW_DIRECTO', 'FLXX')
    * def outputPath = 'shared/fixtures/INT_OW_DIRECTO_FLXX.json'
    * utils.writeJson(outputPath, fixture)
    * print '[OK] Fixture FLXX generado:', outputPath
```

### 4. Actualizar package.json

```json
    "test:flxx": "mvn test \"-Dkarate.options=--tags @FLXX\" -Dtest=TestRunner"
```

### 5. Ejecutar

```bash
    npm run test:flxx
```

## 🎯 Checklist

□ disruption/flxx.feature creado con @ignore
□ Mock server devuelve type: 'FLXX' correctamente
□ Scenario @FLXX añadido al orquestador
□ set hasDisruption = true y set disruptionTypes = ['FLXX']
□ Script npm añadido
□ Fixture esperado: INT_OW_DIRECTO_FLXX.json
□ Ejecución pasa con BUILD SUCCESS

