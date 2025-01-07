import wixData from "wix-data";
import { triggeredEmails } from "wix-crm-backend";
import { Permissions, webMethod } from "wix-web-module";
import { sendEmailViaApi } from "./email.web";

// Hook for the `Images` collection

export const Images_afterInsert = webMethod(
  Permissions.Anyone,
  async (userId, isPublic, userEmail) => {
    console.log("Images_afterInsert", userId);
    console.log("isPublic from emailHooks", isPublic.toLowerCase());
    // Query to check if it's the user's first public image

    if (isPublic.toLowerCase() === "public") {
      wixData
        .query("Images")
        .eq("userId", userId) // Ensure `userId` links images to users
        .eq("isPublic", "Public")
        .count()
        .then(async (count) => {
          console.log(
            "count of images uploaded this account which is public",
            count
          );

          let userRecord = await wixData
            .query("User")
            .eq("userId", userId)
            .count();
          console.log("userRecord", userRecord);
          if (userRecord < 1) {
            // First public image
            const userRecord = {
              userId: userId,
              isFirstMailSent: true,
            };

            // Insert the record into the 'User' collection
            wixData
              .insert("User", userRecord)
              .then((result) => {
                console.log("Record inserted successfully:", result);
              })
              .catch((err) => {
                console.error("Error inserting record:", err);
              });

            // Send MAIL
            sendCongratulatoryEmail(userEmail); // Call the email function
          }
        })
        .catch((err) => {
          console.error("Error checking public images count:", err);
        });
    }
  }
);

// Function to send the congratulatory email
async function sendCongratulatoryEmail(email) {
  console.log("SENDING MAIL TO " + email);
  await sendEmailViaApi(
    email,
    "Congratulations on Your First Image Upload!",
    `<p>Congratulations on uploading your first image!</p>`
  );
}
