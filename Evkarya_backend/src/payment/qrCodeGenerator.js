const QRCode = require('qrcode');

const generateQRCode = (orderId, amount) => {
  return new Promise((resolve, reject) => {
   
    const qrData = `order:${orderId},amount:${amount}`; 
    QRCode.toDataURL(qrData, (err, url) => {
      if (err) {
        reject('Error generating QR code');
      } else {
        resolve(url); 
      }
    });
  });
};

module.exports = { generateQRCode };
