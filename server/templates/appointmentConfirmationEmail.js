// Generates the HTML email template for appointment confirmation
module.exports = function generateAppointmentConfirmationEmail(appointment) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Your Appointment Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background-color: #007bff; border-radius: 8px 8px 0 0; padding: 20px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Appointment Confirmation</h1>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding: 30px;">
                  <p style="color: #333333; font-size: 16px; line-height: 1.5;">Dear ${
                    appointment.patientId.name
                  },</p>
                  <p style="color: #333333; font-size: 16px; line-height: 1.5;">
                    Your appointment has been successfully booked. Below are the details:
                  </p>
                  <table width="100%" cellpadding="10" cellspacing="0" style="border: 1px solid #e0e0e0; border-radius: 4px; margin: 20px 0;">
                    <tr>
                      <td style="font-weight: bold; color: #333333;">Patient Name:</td>
                      <td style="color: #333333;">${
                        appointment.patientId.name
                      }</td>
                    </tr>
                    <tr>
                      <td style="font-weight: bold; color: #333333;">Paid Amount:</td>
                      <td style="color: #333333;">$${appointment.fee}</td>
                    </tr>
                    <tr>
                      <td style="font-weight: bold; color: #333333;">Appointed Date & Time:</td>
                      <td style="color: #333333;">${appointment.date} at ${
    appointment.time
  }</td>
                    </tr>
                    <tr>
                      <td style="font-weight: bold; color: #333333;">Doctor:</td>
                      <td style="color: #333333;">Dr. ${
                        appointment.doctorId.name
                      }</td>
                    </tr>
                  </table>
                  <p style="color: #333333; font-size: 16px; line-height: 1.5;">
                    Thank you for booking with us! If you have any questions, please contact our support team.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; border-radius: 0 0 8px 8px; padding: 20px; text-align: center;">
                  <p style="color: #666666; font-size: 14px; margin: 0;">
                    &copy; ${new Date().getFullYear()} DocHub. All rights reserved.
                  </p>
                  <p style="color: #666666; font-size: 14px; margin: 5px 0 0;">
                    <a href="mailto:support@DocHub.com" style="color: #007bff; text-decoration: none;">Contact Support</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};
