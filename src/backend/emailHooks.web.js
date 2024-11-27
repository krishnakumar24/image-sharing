import wixData from "wix-data";
import { triggeredEmails } from "wix-crm-backend";
import { Permissions, webMethod } from "wix-web-module";

// Hook for the `Images` collection

export const Images_afterInsert = webMethod(
  Permissions.Anyone,
  async (userId) => {
    console.log("Images_afterInsert", userId);
    // Query to check if it's the user's first public image
    wixData
      .query("Images")
      .eq("userId", userId) // Ensure `userId` links images to users
      .eq("isPublic", "Public")
      .count()
      .then((count) => {
        console.log(
          "count of images uploaded this account which is public",
          count
        );
        if (count === 1) {
          // First public image
          sendCongratulatoryEmail(userId); // Call the email function
        }
      })
      .catch((err) => {
        console.error("Error checking public images count:", err);
      });
  }
);

// Function to send the congratulatory email
function sendCongratulatoryEmail(userId) {
  triggeredEmails
    .emailMember("CongratulatoryEmail", userId, {
      variables: {
        SITE_URL: "https://akkg21.wixstudio.com/imgshare",
      },
    })
    .then(() => {
      console.log("Email sent successfully!");
    })
    .catch((err) => {
      console.error("Error sending email:", err);
    });
}
