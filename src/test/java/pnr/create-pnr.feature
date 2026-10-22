
@ignore
Feature: Crear PNR - flujo completo de compra
  # @ignore: solo se invoca via call read() desde otras features.

  Scenario: Compra exitosa de un ticket
    * url mockServer.baseUrl
    * def utils = read('classpath:common/utils.js')
    * def pnrBuilder = read('classpath:pnr/build-pnr.js')
    * configure headers = headers

    # 1. Autenticacion
    Given path '/api/auth/realms/commercial_platform/protocol/openid-connect/token'
    And request { username: '#(secrets.authUser)', password: '#(secrets.authPassword)' }
    When method post
    Then status 200
    * def accessToken = response.access_token
    * def authHeader = { Authorization: '#("Bearer " + accessToken)' }      # ← FIX
    * configure headers = karate.merge(headers, authHeader)

    # 2. Availability
    Given path '/api/sse-avm/rs/v2/availability/itinerary'
    And request { origin: '#(origin)', destination: '#(destination)', date: '#(flightDate)' }
    When method post
    Then status 200
    * def itinerary = response.itineraries[0]

    # 3. Fare
    Given path '/api/sse-avm/rs/v2/fare'
    And request { itineraryId: '#(itinerary.id)' }
    When method post
    Then status 200
    * def fare = response

    # 4. Crear orden
    Given path '/api/sse-orm/rs/v2/order'
    And request { itinerary: '#(itinerary)', fare: '#(fare)' }
    When method post
    Then status 200
    * def orderId = response.orderId

    # 5. Metodos de pago
    Given path '/api/pmt-ppm/rs/ppm/' + orderId + '/payment-methods'
    When method get
    Then status 200
    * def paymentMethods = response

    # 6. Registrar tarjeta en vault
    Given path '/iberiapay/api/v2/public/vault/' + orderId + '/credit-card'
    And request { cardNumber: '4242424242424242', cvv: '123' }
    When method put
    Then status 200
    * def vaultId = response.vaultId

    # 7. Emision (obtenemos el PNR)
    Given path '/api/sse-orm/rs/v3/issue'
    And request { orderId: '#(orderId)', vaultId: '#(vaultId)' }
    When method post
    Then status 200
    * def pnrResponse = response

    # 8. Construir el objeto PNR usando el builder JS
    * def pnrData = pnrBuilder.build(pnrResponse, fare, flightType, tripShape, lastName, flightNumber, email, phone, utils)
    * print '[OK] PNR creado:', pnrData.pnrCode
