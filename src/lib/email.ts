import { Application, Payment } from "@/types/admissions";
import { firstName } from "@/lib/validation";

const academy = {
  name: "Arizon Academy",
  tagline: "Code. Learn. Grow.",
  email: "arizonacademy1@gmail.com",
  phone: "09135739518"
};

function appUrl(path = "") {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${base}${path}`;
}

function shell(title: string, body: string) {
  return `
    <div style="font-family:Arial,sans-serif;background:#080b12;color:#e5eefc;padding:32px">
      <div style="max-width:620px;margin:auto;border:1px solid rgba(44,228,255,.22);border-radius:18px;padding:28px;background:#0e1422">
        <h1 style="color:#2ce4ff;margin:0 0 12px">${title}</h1>
        <div style="font-size:16px;line-height:1.65">${body}</div>
        <p style="margin-top:28px;color:#94a3b8">${academy.name}<br>${academy.tagline}</p>
      </div>
    </div>
  `;
}

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "Arizon Academy <onboarding@resend.dev>";

  if (!apiKey) {
    console.log("[email:mock]", { to, subject });
    return { mocked: true };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ from, to, subject, html })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Resend failed: ${text}`);
  }

  return response.json();
}

export async function sendApplicationReceived(app: Application) {
  return sendEmail(
    app.email,
    "Application Received - Arizon Academy",
    shell(
      "Application Received",
      `<p>Dear ${firstName(app.fullName)},</p>
       <p>Thank you for applying to Arizon Academy. Your application has been received and is currently under review. We will contact you by email once a decision has been made.</p>`
    )
  );
}

export async function sendApplicationApproved(app: Application) {
  return sendEmail(
    app.email,
    "Congratulations! Your Application Has Been Approved",
    shell(
      "Congratulations!",
      `<p>Dear ${firstName(app.fullName)},</p>
       <p>Your application to the <strong>Arizon Academy Web Development VIP Cohort</strong> has been approved.</p>
       <p>To complete your enrollment, please visit the link below:</p>
       <p><a href="${appUrl("/vip-enrollment")}" style="display:inline-block;background:#2ce4ff;color:#08111f;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:700">Complete Your Enrollment</a></p>
       <p>We look forward to welcoming you.</p>`
    )
  );
}

export async function sendApplicationRejected(app: Application) {
  return sendEmail(
    app.email,
    "Update on Your Arizon Academy Application",
    shell(
      "Application Update",
      `<p>Dear ${firstName(app.fullName)},</p>
       <p>Thank you for your interest in Arizon Academy. After review, we are unable to approve your application for this cohort.</p>
       <p>We appreciate your time and encourage you to apply again for a future cohort.</p>`
    )
  );
}

export async function sendPaymentReceived(payment: Payment) {
  return sendEmail(
    payment.email,
    "Payment Confirmation Received",
    shell(
      "Payment Submitted",
      `<p>Dear ${firstName(payment.fullName)},</p>
       <p>Your payment evidence has been received and is awaiting verification by the admin team.</p>
       <p>We will email you when verification is complete.</p>`
    )
  );
}

export async function notifyAdminPayment(payment: Payment) {
  return sendEmail(
    process.env.ADMIN_EMAIL || academy.email,
    "New Payment Evidence Awaiting Verification",
    shell(
      "Payment Evidence Submitted",
      `<p>${payment.fullName} submitted payment evidence for NGN ${payment.amountPaid.toLocaleString()}.</p>
       <p>Email: ${payment.email}<br>Phone: ${payment.phone}</p>
       <p>Please review it in the admin dashboard.</p>`
    )
  );
}

export async function sendPaymentVerified(app: Application) {
  const telegram = process.env.TELEGRAM_VIP_LINK || "https://t.me/your-vip-community";
  return sendEmail(
    app.email,
    "Welcome to Arizon Academy!",
    shell(
      "Welcome to Arizon Academy!",
      `<p>Dear ${firstName(app.fullName)},</p>
       <p>Congratulations! Your payment has been successfully verified.</p>
       <p>You are now officially enrolled in the <strong>Arizon Academy Web Development VIP Cohort</strong>.</p>
       <p>Your next steps:</p>
       <ol>
         <li>Join the Telegram VIP Community: <a href="${telegram}" style="color:#44f3b1">${telegram}</a></li>
         <li>Check your class schedule.</li>
         <li>Install the required software before the first class.</li>
       </ol>
       <p>If you have any questions, contact us:<br>Phone: ${academy.phone}<br>Email: ${academy.email}</p>`
    )
  );
}

export async function sendMoreInfoRequested(payment: Payment) {
  return sendEmail(
    payment.email,
    "More Payment Information Required",
    shell(
      "Payment Information Needed",
      `<p>Dear ${firstName(payment.fullName)},</p>
       <p>We need a little more information before we can verify your payment. Please reply with a clearer receipt or additional payment reference details.</p>`
    )
  );
}
