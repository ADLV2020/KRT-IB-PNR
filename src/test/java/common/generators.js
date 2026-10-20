
(function () {

  function pnrCode() {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var result = '';
    for (var i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  function ticketNumber() {
    var result = '075';
    for (var i = 0; i < 10; i++) {
      result += Math.floor(Math.random() * 10);
    }
    return result;
  }

  return {
    pnrCode: pnrCode,
    ticketNumber: ticketNumber
  };
})()
