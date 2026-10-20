
(function () {

  function build(pnrResponse, fare, flightType, tripShape, lastName, utils) {
    var windowInfo = utils.calculateWindow(pnrResponse.departure.datetime);
    var checkIn = utils.calculateCheckInWindow(pnrResponse.departure.datetime, false);

    var passenger = {
      passengerId: 'PAX-1',
      type: 'ADT',
      firstName: 'Juan',
      lastName: lastName,
      ticket: {
        ticketNumber: pnrResponse.ticketNumber,
        status: 'ISSUED',
        issuedAt: new Date().toISOString()
      },
      isCheckedIn: false
    };

    var segment = {
      segmentId: 'SEG-1',
      tripId: 'TRIP-1',
      segmentOrder: 1,
      flightNumber: pnrResponse.flightNumber,
      marketingCarrier: 'IB',
      operatingCarrier: 'IB',
      carrierGroup: 'IB_GROUP',
      isCodeshare: false,
      isOtherGroupAirline: true,
      departure: pnrResponse.departure,
      arrival: pnrResponse.arrival,
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

    var trip = {
      tripId: 'TRIP-1',
      direction: 'OUTBOUND',
      shape: tripShape,
      segments: [segment]
    };

    return {
      pnrCode: pnrResponse.pnr,
      createdAt: new Date().toISOString(),
      createdAtEnv: 'INT',
      flightType: flightType,
      tripShape: tripShape,
      passengerCount: 1,
      segmentCount: 1,
      passengers: [passenger],
      trips: [trip],
      payment: {
        method: 'CARD',
        currency: 'EUR',
        totalAmount: fare.price.amount
      },
      addOns: [],
      isCheckedIn: false,
      hasDisruption: false,
      disruptionTypes: [],
      mockedIn: [],
      isFullyFlown: false,
      _flatSegments: [{
        segmentId: 'SEG-1',
        tripId: 'TRIP-1',
        pnrCode: pnrResponse.pnr,
        flightNumber: pnrResponse.flightNumber,
        departureDatetime: pnrResponse.departure.datetime,
        windowType: windowInfo.windowType,
        hoursToDeparture: windowInfo.hoursToDeparture,
        isCheckedIn: false,
        isFlown: false,
        lifecycleState: 'FREE',
        disruptionType: null,
        mockedIn: []
      }]
    };
  }

  return {
    build: build
  };
})()
