const generateOrderUpdateMail = (status, userName, orderId, eventDate,vendorUpiId ) => {
  let message = "";

  if (status === "completed") {
    message = `🎉 Your order <b>#${orderId}</b> for <b>${eventDate}</b> has been successfully completed!`;
  } else if (status === "cancelled") {
    message = `⚠️ Your order <b>#${orderId}</b> scheduled for <b>${eventDate}</b> has been cancelled.`;
  } else if (status === "waiting for partial payment") {
    message = `📦 Your order <b>#${orderId}</b> for <b>${eventDate}</b> is now waiting for a partial payment. Please use the QR code below to make the payment.`;
  } else {
    message = `📦 Your order <b>#${orderId}</b> has been updated. Please review the changes.`;
  }

  return `
   <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
  <p style="font-size: 16px;">Hi <b style="color: #007bff;">${userName}</b>,</p>

  <p style="font-size: 16px;">${message}</p>

  ${status === "waiting for partial payment" ? 
    `<p style="font-size: 16px;">To complete your booking, please make the partial payment using the UPI ID below:</p>
     <p style="font-size: 16px; font-weight: bold; color: #28a745;">
       UPI ID: ${vendorUpiId}
     </p>` 
    : ""}
  
  <p style="font-size: 16px;">Thank you for choosing <b style="color: #007bff;">EvKarya</b>!</p>
  
  <p style="font-size: 14px; color: #666;">If you have any questions, feel free to contact our support team.</p>
</div>

  `;
};

module.exports = { generateOrderUpdateMail };
