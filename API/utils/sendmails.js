const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAILID_FOR_OTP,
    pass: process.env.PASSWORD_FOR_OTP,
  },
});

const sendOtpMail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"Web-Nexa Security" <${process.env.EMAILID_FOR_OTP}>`,
      to: email,
      subject: "Verify your email • OTP Code",
      html: `
  <div style="
    margin:0;
    padding:0;
    background:#f4f6f8;
    font-family:Arial,Helvetica,sans-serif;
  ">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">

          <table width="520" cellpadding="0" cellspacing="0"
            style="background:#ffffff;border-radius:12px;
            box-shadow:0 8px 24px rgba(0,0,0,0.08);
            padding:40px;">

            <!-- Logo -->
            <tr>
              <td align="center" style="padding-bottom:20px;">
                <h2 style="margin:0;color:#4f46e5;">
                  Web-Nexa
                </h2>
              </td>
            </tr>

            <!-- Title -->
            <tr>
              <td align="center">
                <h1 style="
                  margin:0;
                  font-size:22px;
                  color:#111827;
                  font-weight:600;">
                  Verify your email address
                </h1>
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td align="center" style="padding:18px 0;">
                <p style="
                  margin:0;
                  color:#6b7280;
                  font-size:15px;
                  line-height:1.6;">
                  Use the verification code below to complete your signup.
                  This code will expire in <b>5 minutes</b>.
                </p>
              </td>
            </tr>

            <!-- OTP BOX -->
            <tr>
              <td align="center" style="padding:20px 0;">
                <div style="
                  display:inline-block;
                  background:#f3f4f6;
                  border-radius:10px;
                  padding:18px 28px;
                  font-size:30px;
                  letter-spacing:8px;
                  font-weight:bold;
                  color:#111827;">
                  ${otp}
                </div>
              </td>
            </tr>

            <!-- Warning -->
            <tr>
              <td align="center">
                <p style="
                  font-size:13px;
                  color:#9ca3af;">
                  If you didn’t request this code, you can safely ignore this email.
                </p>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding:25px 0;">
                <hr style="border:none;border-top:1px solid #e5e7eb;">
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center">
                <p style="
                  margin:0;
                  font-size:12px;
                  color:#9ca3af;">
                  © ${new Date().getFullYear()} Web-Nexa • Secure Authentication
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </div>
  `,
    });
  } catch (error) {
    console.log("error sendOtpMail: ", error);
  }
};

const sendWelcomeMail = async (email, name) => {
  try {
    await transporter.sendMail({
      from: `"Web-Nexa Team" <${process.env.EMAILID_FOR_OTP}>`,
      to: email,
      subject: "Welcome to Web-Nexa — Start Creating Today!",
      html: `
    <div style="background:#f4f6f8;padding:40px;font-family:Arial,sans-serif;">
      <table width="100%" align="center">
        <tr>
          <td align="center">

            <table width="520" style="
              background:#ffffff;
              padding:40px;
              border-radius:12px;
              box-shadow:0 6px 18px rgba(0,0,0,0.08);
            ">

              <tr>
                <td align="center">
                  <h2 style="color:#4f46e5;margin:0;">
                    Welcome to Web-Nexa 🚀
                  </h2>
                </td>
              </tr>

              <tr>
                <td style="padding-top:20px;">
                  <p style="font-size:15px;color:#374151;">
                    Hi <b>${name}</b>,
                  </p>

                  <p style="font-size:15px;color:#374151;">
                    You’ve successfully registered with <b>Web-Nexa</b>!
                  </p>

                  <p style="font-size:15px;color:#6b7280;">
                    Now you can start writing blogs, sharing creativity,
                    and exploring stories from creators across the globe.
                  </p>

                  <ul style="color:#374151;font-size:15px;">
                    <li> Write and publish your own blogs</li>
                    <li> Use AI to generate blog ideas & content</li>
                    <li> Read storytelling and creative blogs worldwide</li>
                    <li> Connect with global writers</li>
                  </ul>

                  <p style="font-size:15px;color:#374151;">
                    Everything is <b>100% FREE</b> — no subscription required.
                  </p>

                  <p style="font-size:15px;color:#374151;">
                    For better security, you can create a password anytime
                    from your account settings.
                  </p>

                </td>
              </tr>

              <tr>
                <td align="center" style="padding:25px 0;">
                  <a href="https://blogs.webnexainfo.online"
                    style="
                      background:#4f46e5;
                      color:white;
                      padding:12px 24px;
                      text-decoration:none;
                      border-radius:8px;
                      font-weight:bold;
                    ">
                    Start Writing Now
                  </a>
                </td>
              </tr>

              <tr>
                <td align="center">
                  <p style="font-size:12px;color:#9ca3af;">
                    © ${new Date().getFullYear()} Web-Nexa —
                    Creativity Without Limits
                  </p>
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>
    </div>
    `,
    });
  } catch (error) {
    console.log("error sendWelcomeMail : ", error);
  }
};

const sendResetPassword = async (email, name, resetLink) => {
  try {
    await transporter.sendMail({
      from: `"Web-Nexa Support" <${process.env.EMAILID_FOR_OTP}>`,
      to: email,
      subject: "Reset Your Password",
      html: `
  <div style="background:#f4f6f8;padding:40px;font-family:Arial,sans-serif;">
    <table width="100%" align="center">
      <tr>
        <td align="center">
          <table width="520" style="
            background:#ffffff;
            padding:40px;
            border-radius:12px;
            box-shadow:0 6px 18px rgba(0,0,0,0.08);
          ">
            <tr>
              <td align="center">
                <h2 style="color:#4f46e5;margin:0;">
                  Password Reset Request
                </h2>
              </td>
            </tr>

            <tr>
              <td style="padding-top:20px;">
                <p style="font-size:15px;color:#374151;">
                  Hi <b>${name}</b>,
                </p>

                <p style="font-size:15px;color:#374151;">
                  We received a request to reset your password for your account at <b>Web-Nexa</b>.
                </p>

                <p style="font-size:15px;color:#6b7280;">
                  To reset your password, click the link below. Please note, this link will expire in 15 minutes.
                </p>

                <p style="font-size:15px;color:#374151;">
                  If you didn’t request a password reset, please ignore this email.
                </p>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:25px 0;">
                <a href="${resetLink}"
                  style="
                    background:#4f46e5;
                    color:white;
                    padding:12px 24px;
                    text-decoration:none;
                    border-radius:8px;
                    font-weight:bold;
                  ">
                  Reset Password
                </a>
              </td>
            </tr>

            <tr>
              <td align="center">
                <p style="font-size:12px;color:#9ca3af;">
                  If you did not request this password reset, please ignore this email. <br>
                  © ${new Date().getFullYear()} Web-Nexa — Creativity Without Limits
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
`,
    });
  } catch (error) {
    console.log("error sendResetPassword: ", error);
  }
};

module.exports = { sendOtpMail, sendWelcomeMail, sendResetPassword };
