
Feature: Generar lote de PNRs con disrupciones

  Background:
    * def utils = read('classpath:common/utils.js')
    * def fixtureBuilder = read('classpath:e2e/build-fixture.js')
    * def configLoader = read('classpath:e2e/load-batch-config.js')
    * def batchConfigJson = read('classpath:e2e/data/batch-config.json')
    * def createPnrPath = (dataSource == 'real') ? 'classpath:pnr/create-pnr-real.feature' : 'classpath:pnr/create-pnr.feature'

  # ==================================================================
  # UN - Reacomodo
  # ==================================================================
  @UN
  Scenario: Generar lote OW Directo con disrupcion UN
    * def count = parseInt(karate.properties['numPnrs'] || '1')
    * def cfg = configLoader.load('UN', batchConfigJson)
    * print '[DEBUG] cfg =', cfg
    * def pnrs = []

    * def r1 = call read(createPnrPath) cfg
    * def pnrs = karate.append(pnrs, r1.pnrData)

    * def r2 = call read(createPnrPath) cfg
    * def pnrs = (count >= 2) ? karate.append(pnrs, r2.pnrData) : pnrs

    * def r3 = call read(createPnrPath) cfg
    * def pnrs = (count >= 3) ? karate.append(pnrs, r3.pnrData) : pnrs

    * def r4 = call read(createPnrPath) cfg
    * def pnrs = (count >= 4) ? karate.append(pnrs, r4.pnrData) : pnrs

    * def r5 = call read(createPnrPath) cfg
    * def pnrs = (count >= 5) ? karate.append(pnrs, r5.pnrData) : pnrs

    * def argsDis = { pnrCode: '#(pnrs[0].pnrCode)', segmentId: 'SEG-1' }
    * def disruptionResult = call read('classpath:disruption/un.feature') argsDis
    * set pnrs[0].trips[0].segments[0].disruption = disruptionResult.disruption
    * set pnrs[0].hasDisruption = true
    * set pnrs[0].disruptionTypes = ['UN']

    * match karate.sizeOf(pnrs) == count
    * match each pnrs[*].pnrCode != null
    * match pnrs[0].hasDisruption == true
    * match pnrs[0].disruptionTypes[0] == 'UN'
    * assert pnrs[0].passengers.length >= 1
    * assert pnrs[0].trips[0].segments.length >= 1

    * def fixture = fixtureBuilder.build(pnrs, 'INT', 'OW_DIRECTO', 'UN')
    * def outputPath = 'shared/fixtures/INT_OW_DIRECTO_UN.json'
    * utils.writeJson(outputPath, fixture)
    * print '[OK] Fixture UN generado con', karate.sizeOf(pnrs), 'PNRs:', outputPath

  # ==================================================================
  # UNTK - Reacomodo de Ticket
  # ==================================================================
  @UNTK
  Scenario: Generar lote OW Directo con disrupcion UNTK
    * def count = parseInt(karate.properties['numPnrs'] || '1')
    * def cfg = configLoader.load('UNTK', batchConfigJson)
    * def pnrs = []

    * def r1 = call read(createPnrPath) cfg
    * def pnrs = karate.append(pnrs, r1.pnrData)

    * def r2 = call read(createPnrPath) cfg
    * def pnrs = (count >= 2) ? karate.append(pnrs, r2.pnrData) : pnrs

    * def r3 = call read(createPnrPath) cfg
    * def pnrs = (count >= 3) ? karate.append(pnrs, r3.pnrData) : pnrs

    * def r4 = call read(createPnrPath) cfg
    * def pnrs = (count >= 4) ? karate.append(pnrs, r4.pnrData) : pnrs

    * def r5 = call read(createPnrPath) cfg
    * def pnrs = (count >= 5) ? karate.append(pnrs, r5.pnrData) : pnrs

    * def argsDis = { pnrCode: '#(pnrs[0].pnrCode)', segmentId: 'SEG-1' }
    * def disruptionResult = call read('classpath:disruption/untk.feature') argsDis
    * set pnrs[0].trips[0].segments[0].disruption = disruptionResult.disruption
    * set pnrs[0].hasDisruption = true
    * set pnrs[0].disruptionTypes = ['UNTK']

    * match karate.sizeOf(pnrs) == count
    * match each pnrs[*].pnrCode != null
    * match pnrs[0].hasDisruption == true
    * match pnrs[0].disruptionTypes[0] == 'UNTK'
    * assert pnrs[0].passengers.length >= 1
    * assert pnrs[0].trips[0].segments.length >= 1

    * def fixture = fixtureBuilder.build(pnrs, 'INT', 'OW_DIRECTO', 'UNTK')
    * def outputPath = 'shared/fixtures/INT_OW_DIRECTO_UNTK.json'
    * utils.writeJson(outputPath, fixture)
    * print '[OK] Fixture UNTK generado con', karate.sizeOf(pnrs), 'PNRs:', outputPath

  # ==================================================================
  # FLCH - Cambio de Vuelo
  # ==================================================================
  @FLCH
  Scenario: Generar lote OW Directo con disrupcion FLCH
    * def count = parseInt(karate.properties['numPnrs'] || '1')
    * def cfg = configLoader.load('FLCH', batchConfigJson)
    * def pnrs = []

    * def r1 = call read(createPnrPath) cfg
    * def pnrs = karate.append(pnrs, r1.pnrData)

    * def r2 = call read(createPnrPath) cfg
    * def pnrs = (count >= 2) ? karate.append(pnrs, r2.pnrData) : pnrs

    * def r3 = call read(createPnrPath) cfg
    * def pnrs = (count >= 3) ? karate.append(pnrs, r3.pnrData) : pnrs

    * def r4 = call read(createPnrPath) cfg
    * def pnrs = (count >= 4) ? karate.append(pnrs, r4.pnrData) : pnrs

    * def r5 = call read(createPnrPath) cfg
    * def pnrs = (count >= 5) ? karate.append(pnrs, r5.pnrData) : pnrs

    * def argsDis = { pnrCode: '#(pnrs[0].pnrCode)', segmentId: 'SEG-1' }
    * def disruptionResult = call read('classpath:disruption/flch.feature') argsDis
    * set pnrs[0].trips[0].segments[0].disruption = disruptionResult.disruption
    * set pnrs[0].hasDisruption = true
    * set pnrs[0].disruptionTypes = ['FLCH']

    * match karate.sizeOf(pnrs) == count
    * match each pnrs[*].pnrCode != null
    * match pnrs[0].hasDisruption == true
    * match pnrs[0].disruptionTypes[0] == 'FLCH'
    * assert pnrs[0].passengers.length >= 1
    * assert pnrs[0].trips[0].segments.length >= 1

    * def fixture = fixtureBuilder.build(pnrs, 'INT', 'OW_DIRECTO', 'FLCH')
    * def outputPath = 'shared/fixtures/INT_OW_DIRECTO_FLCH.json'
    * utils.writeJson(outputPath, fixture)
    * print '[OK] Fixture FLCH generado con', karate.sizeOf(pnrs), 'PNRs:', outputPath

  # ==================================================================
  # DELAY - Retraso
  # ==================================================================
  @DELAY
  Scenario: Generar lote OW Directo con disrupcion DELAY
    * def count = parseInt(karate.properties['numPnrs'] || '1')
    * def cfg = configLoader.load('DELAY', batchConfigJson)
    * def pnrs = []

    * def r1 = call read(createPnrPath) cfg
    * def pnrs = karate.append(pnrs, r1.pnrData)

    * def r2 = call read(createPnrPath) cfg
    * def pnrs = (count >= 2) ? karate.append(pnrs, r2.pnrData) : pnrs

    * def r3 = call read(createPnrPath) cfg
    * def pnrs = (count >= 3) ? karate.append(pnrs, r3.pnrData) : pnrs

    * def r4 = call read(createPnrPath) cfg
    * def pnrs = (count >= 4) ? karate.append(pnrs, r4.pnrData) : pnrs

    * def r5 = call read(createPnrPath) cfg
    * def pnrs = (count >= 5) ? karate.append(pnrs, r5.pnrData) : pnrs

    * def argsDis = { pnrCode: '#(pnrs[0].pnrCode)', segmentId: 'SEG-1' }
    * def disruptionResult = call read('classpath:disruption/delay.feature') argsDis
    * set pnrs[0].trips[0].segments[0].disruption = disruptionResult.disruption
    * set pnrs[0].hasDisruption = true
    * set pnrs[0].disruptionTypes = ['DELAY']

    * match karate.sizeOf(pnrs) == count
    * match each pnrs[*].pnrCode != null
    * match pnrs[0].hasDisruption == true
    * match pnrs[0].disruptionTypes[0] == 'DELAY'
    * assert pnrs[0].passengers.length >= 1
    * assert pnrs[0].trips[0].segments.length >= 1

    * def fixture = fixtureBuilder.build(pnrs, 'INT', 'OW_DIRECTO', 'DELAY')
    * def outputPath = 'shared/fixtures/INT_OW_DIRECTO_DELAY.json'
    * utils.writeJson(outputPath, fixture)
    * print '[OK] Fixture DELAY generado con', karate.sizeOf(pnrs), 'PNRs:', outputPath
    