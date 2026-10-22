
// src/test/java/pnr/build-pnr-real.js
// Construye el objeto PNR del fixture a partir de la respuesta
// del Sistema Inyector (POST /api/v2/generate-pnr).

(function () {

  // Convierte "20261020" + "1015" + "+02:00" -> "2026-10-20T10:15:00+02:00"
  function toIsoDatetime(dateDDMMYYYY, timeHHMM, offset) {
    if (!dateDDMMYYYY || !timeHHMM) return null;
    var d = dateDDMMYYYY.substring(0, 2);
    var m = dateDDMMYYYY.substring(2, 4);
    var y = dateDDMMYYYY.substring(4, 8);
    var hh = timeHHMM.substring(0, 2);
    var mm = timeHHMM.substring(2, 4);
    return y + '-' + m + '-' + d + 'T' + hh + ':' + mm + ':00' + (offset || 'Z');
  }

  // Enriquecer un segmento del Sistema Inyector con airport-map y utils
  function enrichSegment(seg, airportMap, utils) {
    var fromAirport = airportMap[seg.origin] || {};
    var toAirport = airportMap[seg.destination] || {};

    var departureDatetime = toIsoDatetime(seg.date, seg.departureTime, fromAirport.summerOffset);
    var arrivalDatetime = toIsoDatetime(seg.date, seg.arrivalTime, toAirport.summerOffset);

    var windowInfo = utils.calculateWindow(departureDatetime);
    var checkIn = utils.calculateCheckInWindow(departureDatetime, false);

    return {
      segmentId: 'SEG-' + seg.sequence,
      tripId: seg.direction === 'RETURN' ? 'TRIP-2' : 'TRIP-1',
      segmentOrder: seg.sequence,
      flightNumber: seg.flightNumber,
      marketingCarrier: 'IB',
      operatingCarrier: 'IB',
      carrierGroup: 'IB_GROUP',
      isCodeshare: false,
      isOtherGroupAirline: true,
      departure: {
        airportCode: seg.origin,
        airportName: fromAirport.airportName || seg.origin,
        cityCode: fromAirport.cityCode,
        cityName: fromAirport.cityName,
        datetime: departureDatetime,
        timezone: fromAirport.timezone
      },
      arrival: {
        airportCode: seg.destination,
        airportName: toAirport.airportName || seg.destination,
        cityCode: toAirport.cityCode,
        cityName: toAirport.cityName,
        datetime: arrivalDatetime,
        timezone: toAirport.timezone
      },
      cabinClass: 'Y',
      bookingClass: seg.bookingClass,
      status: 'SCHEDULED',
      lifecycleState: 'FREE',
      windowType: windowInfo.windowType,
      hoursToDeparture: windowInfo.hoursToDeparture,
      isFlown: false,
      isCheckedIn: false,
      checkIn: checkIn,
      mock: { int: { applied: false }, pre: { applied: false } },
      disruption: null
    };
  }

  function build(response, flightType, tripShape, lastName, firstName, email, phone, airportMap, utils) {
    var flightDetails = response.flightDetails || [];

    // Construir los segments enriquecidos
    var segments = [];
    var flatSegments = [];

    for (var i = 0; i < flightDetails.length; i++) {
      var seg = flightDetails[i];
      var enriched = enrichSegment(seg, airportMap, utils);
      segments.push(enriched);
      flatSegments.push({
        segmentId: enriched.segmentId,
        tripId: enriched.tripId,
        pnrCode: response.pnr,
        flightNumber: enriched.flightNumber,
        departureDatetime: enriched.departure.datetime,
        windowType: enriched.windowType,
        hoursToDeparture: enriched.hoursToDeparture,
        isCheckedIn: false,
        isFlown: false,
        lifecycleState: 'FREE',
        disruptionType: null,
        mockedIn: []
      });
    }

    // Agrupar en trips
    var trips = [];
    var outboundSegs = segments.filter(function (s) { return s.tripId === 'TRIP-1'; });
    var inboundSegs = segments.filter(function (s) { return s.tripId === 'TRIP-2'; });

    if (outboundSegs.length > 0) {
      trips.push({
        tripId: 'TRIP-1',
        direction: 'OUTBOUND',
        shape: outboundSegs.length > 1 ? 'SCALE' : 'DIRECT',
        segments: outboundSegs
      });
    }
    if (inboundSegs.length > 0) {
      trips.push({
        tripId: 'TRIP-2',
        direction: 'INBOUND',
        shape: inboundSegs.length > 1 ? 'SCALE' : 'DIRECT',
        segments: inboundSegs
      });
    }

    // Pasajero
    var passenger = {
      passengerId: 'PAX-1',
      type: 'ADT',
      firstName: firstName || 'AUTOMATION',
      lastName: lastName,
      email: email || null,
      phone: phone || null,
      ticket: {
        ticketNumber: response.orderId || 'UNKNOWN',
        status: 'ISSUED',
        issuedAt: new Date().toISOString()
      },
      isCheckedIn: false
    };

    return {
      pnrCode: response.pnr,
      orderId: response.orderId,             // ← NUEVO campo real
      createdAt: new Date().toISOString(),
      createdAtEnv: 'INT',
      flightType: flightType,
      tripShape: tripShape,
      passengerCount: 1,
      segmentCount: segments.length,
      passengers: [passenger],
      trips: trips,
      payment: { method: 'CARD', currency: 'EUR', totalAmount: 0 },
      addOns: [],
      isCheckedIn: false,
      hasDisruption: false,
      disruptionTypes: [],
      mockedIn: [],
      isFullyFlown: false,
      _flatSegments: flatSegments
    };
  }

  return { build: build };
})()
