
// src/test/java/common/utils.js
// Utilidades reutilizables para todos los features.
// Se usa con: * def utils = call read('classpath:common/utils.js')
// Se expone como IIFE para que sea válido tanto en Karate como en el IDE.

(function () {

  function uuid() {
    return java.util.UUID.randomUUID() + '';
  }

  function timestamp() {
    return java.lang.System.currentTimeMillis() + '';
  }

  function randomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function randomPnrCode() {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var result = '';
    for (var i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  function randomTicketNumber() {
    var result = '075';
    for (var i = 0; i < 10; i++) {
      result += Math.floor(Math.random() * 10);
    }
    return result;
  }

  function calculateWindow(departureDatetime) {
    var dep = new Date(departureDatetime);
    var now = new Date();
    var hoursToDeparture = (dep - now) / (1000 * 60 * 60);
    return {
      windowType: hoursToDeparture > 48 ? 'VC' : 'VO',
      hoursToDeparture: Math.round(hoursToDeparture * 100) / 100
    };
  }

  function calculateCheckInWindow(departureDatetime, isInternational) {
    var dep = new Date(departureDatetime);
    var windowHours = isInternational ? 48 : 24;
    var opensAt = new Date(dep.getTime() - windowHours * 60 * 60 * 1000);
    var now = new Date();
    return {
      isEligible: now >= opensAt && now <= dep,
      isInternational: isInternational,
      windowHours: windowHours,
      opensAt: opensAt.toISOString(),
      closesAt: dep.toISOString()
    };
  }

  function writeJson(path, data) {
    var Files = Java.type('java.nio.file.Files');
    var Paths = Java.type('java.nio.file.Paths');
    var Charsets = Java.type('java.nio.charset.StandardCharsets');
    var content = JSON.stringify(data, null, 2);
    var bytes = new java.lang.String(content).getBytes(Charsets.UTF_8);
    Files.write(Paths.get(path), bytes);
  }

  return {
    uuid: uuid,
    timestamp: timestamp,
    randomInt: randomInt,
    randomPnrCode: randomPnrCode,
    randomTicketNumber: randomTicketNumber,
    calculateWindow: calculateWindow,
    calculateCheckInWindow: calculateCheckInWindow,
    writeJson: writeJson
  };
})()
