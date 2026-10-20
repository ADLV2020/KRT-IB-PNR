
@ignore
Feature: Disrupcion FLCH (Cambio de Vuelo)

  Scenario: Aplicar disrupcion FLCH a un segmento
    * url mockServer.baseUrl
    * configure headers = headers

    Given path '/Reaccom/Reaccom_Disruption_Services'
    And request { pnr: '#(pnrCode)', segmentId: '#(segmentId)', type: 'FLCH' }
    When method post
    Then status 200
    * def disruption = response
    * match disruption.type == 'FLCH'
    * match disruption.status == 'APPLIED'
    * print '[OK] Disrupcion FLCH aplicada a', pnrCode
