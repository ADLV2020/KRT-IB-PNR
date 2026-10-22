
@ignore
Feature: Crear PNR real contra el Sistema Inyector

  Scenario: Compra exitosa de un ticket (real)
    * configure connectTimeout = 5000
    * configure readTimeout = 120000
    * url realBackend.baseUrl
    * def utils = read('classpath:common/utils.js')
    * def airportMap = read('classpath:common/airport-map.json')
    * def pnrBuilder = read('classpath:pnr/build-pnr-real.js')
    * configure headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' }

    # 1. Construir request
    * def reqBody = { origin: '#(origin)', destination: '#(destination)', date: '#(flightDate)', flightType: '#(flightType)', firstName: '#(firstName)', surname: '#(lastName)', email: '#(email)', phone: '#(phone)', environment: 'INT' }

    # 2. Llamar al Sistema Inyector
    Given path '/api/v2/generate-pnr'
    And request reqBody
    When method post
    Then status 200
    * assert response.success == true
    * def pnrResponse = response

    # 3. Construir pnrData enriquecido
    * def pnrData = pnrBuilder.build(pnrResponse, flightType, tripShape, lastName, firstName, email, phone, airportMap, utils)
    * print '[OK] PNR real creado:', pnrData.pnrCode, 'orderId:', pnrData.orderId
