// src/test/java/e2e/load-batch-config.js
// Carga la config del batch para un tag dado, con overrides por system properties.
//
// Uso:
//   * def cfg = configLoader.load('UN', batchConfigJson)
//
// Precedencia (mayor gana):
//   1. System property: -Dbatch.origin=MAD
//   2. Valor del JSON: e2e/data/batch-config.json -> UN.origin
//   3. null

(function () {

  // Claves soportadas
  var KEYS = [
    'origin', 'destination', 'flightDate', 'flightType',
    'flightNumber', 'tripShape', 'lastName', 'firstName', 
    'email', 'phone'
  ];

  // Normaliza el flightNumber:
  //   "0787"     -> "IB0787"
  //   "IB0789"   -> "IB0789"
  //   "I20787"   -> "I20787"
  //   null/''    -> null
  function normalizeFlightNumber(value, defaultCarrier) {
    if (!value) return null;
    var s = String(value).trim().toUpperCase();
    if (s.length === 0) return null;
    // Solo dígitos -> prefija carrier
    if (/^\d+$/.test(s)) {
      return (defaultCarrier || 'IB') + s;
    }
    // Ya tiene prefijo -> tal cual
    return s;
  }

  function load(tag, batchConfigJson) {
    var section = (batchConfigJson && batchConfigJson[tag]) || {};
    var result = {};

    for (var i = 0; i < KEYS.length; i++) {
      var key = KEYS[i];
      // 1. Override por system property
      var sysVal = karate.properties['batch.' + key];
      if (sysVal !== null && sysVal !== undefined && sysVal !== '') {
        result[key] = sysVal;
        continue;
      }
      // 2. Valor del JSON
      if (section[key] !== null && section[key] !== undefined && section[key] !== '') {
        result[key] = section[key];
        continue;
      }
      // 3. null
      result[key] = null;
    }

    // Normalizar flightNumber
    result.flightNumber = normalizeFlightNumber(result.flightNumber, 'IB');

    return result;
  }

  return {
    load: load,
    normalizeFlightNumber: normalizeFlightNumber
  };
})()
