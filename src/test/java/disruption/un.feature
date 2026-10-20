@ignore
Feature: Disrupcion UN (Reacomodo)

  Scenario: Aplicar disrupcion UN a un segmento
    * url mockServer.baseUrl
    * configure headers = headers

    Given path '/Reaccom/Reaccom_Disruption_Services'
    And request { pnr: '#(pnrCode)', segmentId: '#(segmentId)', type: 'UN' }
    When method post
    Then status 200
    * def disruption = response
    * match disruption.type == 'UN'
    * match disruption.status == 'APPLIED'
    * print '[OK] Disrupcion UN aplicada a', pnrCode
