
// src/test/java/e2e/build-fixture.js
// Construye el objeto PnrFixture completo desde JS.
// Al venir de JS, no hay restricciones de sintaxis Gherkin.

(function () {

  function build(pnrs, env, shape, disruption) {
    var now = new Date().toISOString();

    // Calcular estadísticas
    var byFlightType = { OW: 0, RT: 0 };
    var byDisruptionType = {};
    var byWindow = { VC: 0, VO: 0 };
    var totalPassengers = 0;
    var totalSegments = 0;

    pnrs.forEach(function (pnr) {
      byFlightType[pnr.flightType] = (byFlightType[pnr.flightType] || 0) + 1;
      totalPassengers += pnr.passengerCount || 0;
      totalSegments += pnr.segmentCount || 0;

      (pnr.trips || []).forEach(function (trip) {
        (trip.segments || []).forEach(function (seg) {
          byWindow[seg.windowType] = (byWindow[seg.windowType] || 0) + 1;
          if (seg.disruption && seg.disruption.type) {
            var t = seg.disruption.type;
            byDisruptionType[t] = (byDisruptionType[t] || 0) + 1;
          }
        });
      });
    });

    return {
      '$schema': './pnr-fixture.schema.json',
      version: '1.0.0',
      generatedAt: now,
      generator: {
        name: 'karate-disruption-generator',
        version: '1.0.0',
        environment: env,
        locale: 'es',
        vpn: { used: false }
      },
      filters: [{ shape: shape, disruptionType: disruption }],
      stats: {
        totalPnrs: pnrs.length,
        totalPassengers: totalPassengers,
        totalSegments: totalSegments,
        byFlightType: byFlightType,
        byDisruptionType: byDisruptionType,
        byWindow: byWindow
      },
      pnrs: pnrs
    };
  }

  return {
    build: build
  };
})()
