
@ignore
Feature: Disrupcion UNTK (Reacomodo de Ticket)

  Scenario: Aplicar disrupcion UNTK a un segmento
    * url mockServer.baseUrl
    * configure headers = headers

    Given path '/Reaccom/Reaccom_Disruption_Services'
    And request { pnr: '#(pnrCode)', segmentId: '#(segmentId)', type: 'UNTK' }
    When method post
    Then status 200
    * def disruption = response
    * match disruption.type == 'UNTK'
    * match disruption.status == 'APPLIED'
    * print '[OK] Disrupcion UNTK aplicada a', pnrCode
