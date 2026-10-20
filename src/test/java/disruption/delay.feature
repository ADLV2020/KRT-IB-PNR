
@ignore
Feature: Disrupcion DELAY (Retraso)

  Scenario: Aplicar disrupcion DELAY a un segmento
    * url mockServer.baseUrl
    * configure headers = headers

    Given path '/int/event'
    And request { pnr: '#(pnrCode)', segmentId: '#(segmentId)', type: 'DELAY' }
    When method post
    Then status 200
    * def disruption = response
    * match disruption.eventType == 'DELAY'
    * print '[OK] Disrupcion DELAY aplicada a', pnrCode
