import secrets from "wix-secrets-backend";
export async function sendEmailViaApi(email, subject, body, html) {
  const apiUrl = "https://api.mailersend.com/v1/email";
  const apiKey = await secrets.getSecret("mailApiKey");

  const emailData = {
    from: {
      email: "MS_L7qnVQ@trial-neqvygmv615g0p7w.mlsender.net",
    },
    to: [
      {
        email: email,
      },
    ],
    subject: subject,
    text: body,
  };
  if (html) emailData["html"] = html;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(emailData),
    });

    if (response.ok) {
      console.log(`Email sent to ${email}`);
    } else {
      const errorText = await response.text();
      console.error("Failed to send email:", errorText);
    }
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
