Feature: Check-in por pasajero/segmento

  Background:
    * url mockServer.baseUrl
    * def utils = read('classpath:common/utils.js')
    * configure headers = headers

  Scenario Outline: Check-in exitoso
    # Verificar ventana de check-in
    * def checkInWindow = utils.calculateCheckInWindow('<departureDatetime>', <isInternational>)

    # Solo hacer check-in si está en ventana
    * if (checkInWindow.isEligible) {
        Given path '/autocheckin-online'
        And request { pnr: '<pnrCode>', passengerId: 'PAX-1', segmentId: 'SEG-1' }
        When method post
        Then status 200
        * def checkinResult = response
      }

    * print '✅ Check-in resultado:', checkinResult

  Examples:
    | pnrCode | departureDatetime          | isInternational |
    | AB123   | 2026-10-13T10:15:00+02:00 | false           |
    | CD456   | 2026-10-15T08:00:00+02:00 | true            |
