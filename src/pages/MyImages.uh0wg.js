import wixData from "wix-data";
import wixUsers from "wix-users";
import { myGetDownloadUrlFunction } from "backend/files-manager.web.js";
import wixLocationFrontend from "wix-location-frontend";
import wixLocation from "wix-location";

const myImageRepeater = "#imageRepeater";

$w.onReady(() => {
  loadRepeater();
});

function loadRepeater() {
  const user = wixUsers.currentUser;

  if (user.loggedIn || true) {
    // const userId = user.id; // Get the logged-in user's ID

    // console.log("userId", userId);
    // Query the "Images" collection for images uploaded by the current user
    wixData
      .query("Images")
      //   .eq("owner", userId) // Filter by the current user's ID
      .eq("isPublic", "Private")
      .find()
      .then((results) => {
        console.log("query Result ---", results);
        if (results.items.length > 0) {
          // Set the results as the repeater data
          $w(myImageRepeater).data = results.items;

          // Map each repeater item to the data
          $w(myImageRepeater).onItemReady(($item, itemData, index) => {
            // Bind the image data to the repeater's image element
            $item("#imageItem").src = itemData.image;

            // Bind the delete button click event
            $item("#deleteButton").onClick(() => {
              console.log(`delete clicked - ${itemData._id}`);
              deleteImage(itemData._id);
            });

            // Bind the download button click event
            $item("#downloadButton").onClick(() => {
              console.log(`download clicked - ${itemData.image}`);
              downloadImage(itemData.image);
            });
          });

          // Ensure the repeater uses a 2-column layout
          //   $w(myImageRepeater).style.gridTemplateColumns = "repeat(2, 1fr)"; // CSS grid layout with 2 columns
        } else {
          // Show a message if no images are found
          //   $w("#noImagesMessage").show();
          console.error("no images are found");
        }
      })
      .catch((error) => {
        console.error("Failed to load images:", error);
      });
  } else {
    // Show a message if the user isn't logged in
    // $w("#loginMessage").show();
    console.error("the user isn't logged innnn");
  }
}

// Function to delete the image
function deleteImage(imageId) {
  wixData
    .remove("Images", imageId)
    .then(() => {
      console.log("Image deleted successfully");
      loadRepeater();
    })
    .catch((error) => {
      console.error("Error deleting image:", error);
    });
}

// Function to download the image
function downloadImage(imageUrl) {
  try {
    console.log("imageUrl", imageUrl);

    myGetDownloadUrlFunction(imageUrl).then((downloadUrl) => {
      console.log("imageUrl", imageUrl);
      // wixLocationFrontend.to(imageUrl);
      console.log("downloadUrl", downloadUrl);
      // wixLocationFrontend.to(downloadUrl);
      wixLocation.to(downloadUrl);
      // wixLocation.to(imageUrl);
    });
  } catch (error) {
    console.error("error at downloading file");
    console.error(error);
  }
}

