
Feature: Mock Server - Flujo completo de PNR y Disrupcion

  Background:
    * def mockBasePath = 'classpath:mocks/data'

  # ==================================================================
  # 1. Autenticacion
  # ==================================================================
  Scenario: pathMatches('/api/auth/realms/commercial_platform/protocol/openid-connect/token') && methodIs('post')
    * def response = read(mockBasePath + '/auth-response.json')

  # ==================================================================
  # 2. Availability
  # ==================================================================
  Scenario: pathMatches('/api/sse-avm/rs/v2/availability/itinerary') && methodIs('post')
    * def response = read(mockBasePath + '/availability-response.json')

  # ==================================================================
  # 3. Fare
  # ==================================================================
  Scenario: pathMatches('/api/sse-avm/rs/v2/fare') && methodIs('post')
    * def response = read(mockBasePath + '/fare-response.json')

  # ==================================================================
  # 4. Crear orden
  # ==================================================================
  Scenario: pathMatches('/api/sse-orm/rs/v2/order') && methodIs('post')
    * def response = read(mockBasePath + '/order-response.json')

  # ==================================================================
  # 5. Metodos de pago
  # ==================================================================
  Scenario: pathMatches('/api/pmt-ppm/rs/ppm/{orderId}/payment-methods') && methodIs('get')
  * def response = read(mockBasePath + '/payment-methods-response.json')

  # ==================================================================
  # 6. Registrar tarjeta en vault
  # ==================================================================
  Scenario: pathMatches('/iberiapay/api/v2/public/vault/{vaultId}/credit-card') && methodIs('put')
    * def response = { status: 'OK', vaultId: 'VAULT-001' }

  # ==================================================================
  # 7. Emision (ISSUE) - PNR y ticket unicos por llamada
  # ==================================================================
  Scenario: pathMatches('/api/sse-orm/rs/v3/issue') && methodIs('post')
    * def utils = read('classpath:common/utils.js')
    * def newPnr = utils.randomPnrCode()
    * def newTicket = utils.randomTicketNumber()
    * def baseResponse = read(mockBasePath + '/issue-response.json')
    * def response = karate.merge(baseResponse, { pnr: newPnr, ticketNumber: newTicket })

  # ==================================================================
  # 8. Check-in
  # ==================================================================
  Scenario: pathMatches('/autocheckin-online') && methodIs('post')
    * def response = read(mockBasePath + '/checkin-response.json')

  # ==================================================================
  # 9. Disrupcion (UN, UNTK, FLCH, FLXX) - tipo dinamico
  # ==================================================================
  Scenario: pathMatches('/Reaccom/Reaccom_Disruption_Services') && methodIs('post')
    * def disruptionType = request.type
    * def baseResponse = read(mockBasePath + '/disruption-response.json')
    * def response = karate.merge(baseResponse, { type: disruptionType })

  # ==================================================================
  # 10. Delay
  # ==================================================================
  Scenario: pathMatches('/int/event') && methodIs('post')
    * def response = { status: 'OK', eventType: 'DELAY', delayMinutes: 120 }
    