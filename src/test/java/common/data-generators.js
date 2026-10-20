// src/test/java/common/data-generators.js

/**
 * Genera un código PNR aleatorio de 5 caracteres alfanuméricos.
 * @returns {string} Código PNR.
 */
function generatePnrCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Genera un número de ticket aleatorio de 13 dígitos.
 * @returns {string} Número de ticket.
 */
function generateTicketNumber() {
  let result = '075'; // Prefijo de aerolínea
  for (let i = 0; i < 10; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}

// Exportamos las funciones para que Karate las pueda usar.
// En Karate, las funciones JS se exponen como un objeto `dataGenerators`.
var dataGenerators = {
  pnrCode: generatePnrCode,
  ticketNumber: generateTicketNumber
};
