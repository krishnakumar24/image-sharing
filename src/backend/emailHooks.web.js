import wixData from "wix-data";
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
    "Congratulations on Your First Image Upload! 🎉",
    `Hi,

      We noticed you’ve just uploaded your very first image—congratulations! 🎊
      At Your ImgShare, we love seeing our users take the first steps toward achieving their goals. Your upload is just the beginning, and we’re here to support you every step of the way.

      We can’t wait to see what amazing things you’ll create.

      Warm regards,
      The ImgShare Team`,
    `
        <p>Hi,</p>
        <p>We noticed you’ve just uploaded your very first image—congratulations! 🎊</p>
        <p>At <strong>ImgShare</strong>, we love seeing our users take the first steps toward achieving their goals. Your upload is just the beginning, and we’re here to support you every step of the way.</p>
        <p>We can’t wait to see what amazing things you’ll create.</p>
        <br>
        <p>Warm regards,</p>
        <p><strong>The ImgShare Team</strong></p>
      `
  );
}
async function sendMailForSevenDays(email) {
  console.log("SENDING MAIL TO " + email + " FOR SEVEN DAYS");
  await sendEmailViaApi(
    email,
    "🎉 7 Days with ImgShare - You're Amazing!",
    `Hi,
      Congratulations on reaching your 7-day milestone with ImgShare! 🎉

      We're thrilled to have you on board and are so excited to see the amazing things you're creating and sharing on our platform.

      Your journey with ImgShare is just getting started, and we're here to support you every step of the way. If you need help or have questions, don't hesitate to reach out.

      Thanks for being part of the ImgShare community. We can't wait to see what you'll share next!

      Warm regards,  
      The ImgShare Team`,

    `
    <p>Hi,</p>
    <p>Congratulations on reaching your 7-day milestone with ImgShare! 🎉</p>
    <p>We're thrilled to have you on board and are so excited to see the amazing things you're creating and sharing on our platform.</p>
    <p>Your journey with ImgShare is just getting started, and we're here to support you every step of the way. If you need help or have questions, don't hesitate to reach out.</p>
    <p>Thanks for being part of the ImgShare community. We can't wait to see what you'll share next!</p>
    <br/>
    <p>Warm regards,</p>
    <p><strong>The ImgShare Team</strong></p>
`
  );
}

export const checkUserWeek = webMethod(Permissions.Anyone, async () => {
  try {
    const currentDate = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(currentDate.getDate() - 7);

    // Format to ignore time (just match the date part)
    sevenDaysAgo.setHours(0, 0, 0, 0);
    const nextDay = new Date(sevenDaysAgo);
    nextDay.setDate(sevenDaysAgo.getDate() + 1);

    // Query the PrivateMembersData collection
    const result = await wixData
      .query("Members/PrivateMembersData")
      .ge("_createdDate", sevenDaysAgo) // Greater than or equal to 7 days ago (midnight)
      .lt("_createdDate", nextDay) // Less than 8 days ago (midnight)
      .find();

    const members = result.items;

    // Iterate through the members and send emails
    for (const member of members) {
      const email = member.loginEmail;

      if (email) {
        await sendMailForSevenDays(email);
        console.log(`Email sent to: ${email}`);
      } else {
        console.warn(`No email found for member: ${member._id}`);
      }
    }
  } catch (error) {
    console.error("ERROR OCCURED IN CRON", error);
  }
});
