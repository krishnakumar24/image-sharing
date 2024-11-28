import wixData from "wix-data";
import wixUsers from "wix-users";
import { myGetDownloadUrlFunction } from "backend/files-manager.web.js";
import wixLocationFrontend from "wix-location-frontend";
import wixLocation from "wix-location";
import wixWindowFrontend from "wix-window-frontend";
import { currentMember } from "wix-members-frontend";

const myImageRepeater = "#imageRepeater";

$w.onReady(() => {
  $w("#noImagesMsg").hide();
  $w(myImageRepeater).hide();

  loadRepeater();
});

const getUser = async () => {
  const options = {
    fieldsets: ["PUBLIC"],
  };
  try {
    let user = await currentMember.getMember(options);
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

async function loadRepeater() {
  let user = await getUser();
  console.log(`Querying details ${user._id}`, user);
  wixData
    .query("Images")
    .eq("userId", user._id) // Filter by the current user's ID
    .eq("isPublic", "Private")
    .find()
    .then((results) => {
      $w(myImageRepeater).show();
      $w("#noImagesMsg").hide();

      if (results.items.length > 0) {
        $w(myImageRepeater).data = results.items;
        $w(myImageRepeater).onItemReady(($item, itemData, index) => {
          $item("#imageItem").src = itemData.image;
          $item("#imageItem").alt = itemData.title;

          $item("#deleteButton").onClick(() => {
            console.log(`delete clicked - ${itemData._id}`);
            deleteImage(itemData._id);
          });

          $item("#downloadButton").onClick(() => {
            console.log(`download clicked - ${itemData.image}`);
            downloadImage(itemData.image);
          });
        });

        //   $w(myImageRepeater).style.gridTemplateColumns = "repeat(2, 1fr)"; // CSS grid layout with 2 columns
      } else {
        $w("#noImagesMsg").show();
        $w(myImageRepeater).data = [];
        console.error("no images are found");
      }
    })
    .catch((error) => {
      console.error("Failed to load images:", error);
    });
}

// Function to delete the image
function deleteImage(imageId) {
  wixWindowFrontend.openLightbox("ConfirmDeletion").then((receivedData) => {
    let isConfirm = receivedData;

    console.log("Received data", isConfirm);

    if (isConfirm) {
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

