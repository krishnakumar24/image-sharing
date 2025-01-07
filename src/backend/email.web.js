export async function sendEmailViaApi(email, subject, body) {
  const apiUrl = "https://api.mailersend.com/v1/email"; // Replace with your API endpoint
  const apiKey =
    "mlsn.29a2a8539f6cb27063d67c0acf650b0fa11fdbe72838e945a3dbf1e5670f3358"; // Add your API key or authentication token

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
    // "html": "Greetings from the team, you got this message through MailerSend."
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`, // If your API requires Bearer token authentication
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
