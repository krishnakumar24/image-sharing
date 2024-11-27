import wixWindowFrontend from "wix-window-frontend";
import { currentMember } from "wix-members-frontend";
import { authentication } from "wix-members-frontend";
import wixData from "wix-data";
import wixLocation from "wix-location";

$w.onReady(function () {
  $w("#editTagsBtn").hide();
  $w("#deleteButton").hide();

  $w("#editTagsBtn").onClick(() => openEditTags());
  $w("#deleteButton").onClick(() => deleteImage());

  /**
   * On Login not refreshing issue workaround
   */
  authentication.onLogin(async (member) => {
    const loggedInMember = await member.getMember();
    if (loggedInMember?._id) {
      $w("#editTagsBtn").show();
      $w("#deleteButton").show();
    }
  });

  const options = {
    fieldsets: ["PUBLIC"],
  };
  let user = currentMember
    .getMember(options)
    .then((member) => {
      console.log("member", member);
      if (member) {
        $w("#editTagsBtn").show();
        $w("#deleteButton").show();
      }

      return member;
    })
    .catch((error) => {
      console.error("Custom error : fetching current user in images");
      console.error(error);
    });

  function openEditTags() {
    // Ensure your dynamic page has a dataset connected
    const dynamicDataset = $w("#dynamicDataset"); // Replace with your dataset's ID

    // Check if the dataset is ready
    dynamicDataset.onReady(() => {
      // Get the current item
      const currentItem = dynamicDataset.getCurrentItem();

      // Log the data of the current record
      console.log("Current CMS Record Data:", currentItem);

      const id = currentItem._id;

      wixWindowFrontend
        .openLightbox("EditTags", { id })
        .then((receivedData) => {
          let isUpdate = receivedData;

          console.log("Received data", isUpdate);
        });
    });
  }

  // Function to delete the image
  function deleteImage() {
    const dynamicDataset = $w("#dynamicDataset"); // Replace with your dataset's ID
    dynamicDataset.onReady(() => {
      // Get the current item
      const currentItem = dynamicDataset.getCurrentItem();

      // Log the data of the current record
      console.log("Current CMS Record Data:", currentItem);

      const imageId = currentItem._id;
      wixWindowFrontend.openLightbox("ConfirmDeletion").then((receivedData) => {
        let isConfirm = receivedData;

        console.log("Received data", isConfirm);

        console.log("imageId trying to delete....", imageId);

        if (isConfirm) {
          wixData
            .remove("Images", imageId)
            .then(() => {
              console.log("Image deleted successfully");
              wixLocation.to("/my-images");
            })
            .catch((error) => {
              console.error("Error deleting image:", error);
            });
        }
      });
    });
  }
});

