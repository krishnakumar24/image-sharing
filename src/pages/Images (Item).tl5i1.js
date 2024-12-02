import wixWindowFrontend from "wix-window-frontend";
import { currentMember } from "wix-members-frontend";
import { authentication } from "wix-members-frontend";
import wixData from "wix-data";
import wixLocation from "wix-location";

let currentData;

$w.onReady(function () {
  /**
   * Hidings elements before enabling them by checking authorization
   */
  $w("#editTagsBtn").hide();
  $w("#deleteButton").hide();
  $w("#selectionTags").hide();
  /**
   * Since its Dynamic page, retrieving the data used to generate the page
   */
  const dynamicDataset = $w("#dynamicDataset");

  dynamicDataset.onReady(() => {
    // Get the current item
    currentData = dynamicDataset.getCurrentItem();

    $w("#editTagsBtn").onClick(() => openEditTags());
    $w("#deleteButton").onClick(() => deleteImage());

    console.log("currentData", currentData);

    // SEO
    $w("#mainImg").alt = currentData.title;

    $w("#selectionTags").options = currentData.arraystring.map((tag) => {
      return { label: tag, value: tag };
    });
    $w("#selectionTags").show();
    // $w("#selectionTags").value = currentData.arraystring.map((tag) => {
    //   return { label: tag, value: tag };
    // });

    /**
     * On Login not refreshing issue workaround
     */
    authentication.onLogin(async (member) => {
      const loggedInMember = await member.getMember();
      console.log(`editTagsBtn --- authentication -----`, {
        loggedInMember,
        currentData,
      });
      if (loggedInMember?._id) {
        $w("#editTagsBtn").show();

        if (currentData.userId === loggedInMember._id)
          $w("#deleteButton").show();
      }
    });

    const options = {
      fieldsets: ["PUBLIC"],
    };
    currentMember
      .getMember(options)
      .then((member) => {
        console.log(`editTagsBtn --- currentMember -----`, {
          member,
          currentData,
        });
        if (member) {
          $w("#editTagsBtn").show();

          if (currentData.userId === member._id) $w("#deleteButton").show();
        }

        return member;
      })
      .catch((error) => {
        console.error("Custom error : fetching current user in images");
        console.error(error);
      });
  });

  function openEditTags() {
    const imageId = currentData._id;

    wixWindowFrontend
      .openLightbox("EditTags", { imageId })
      .then((updatedTags) => {
        refreshTagsData(updatedTags);
      });
  }

  // Function to delete the image
  function deleteImage() {
    const imageId = currentData._id;

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
  }

  function refreshTagsData(updatedTags) {
    console.log("data refreshing... tags data", updatedTags);
    if (updatedTags && updatedTags.length > 0) {
      $w("#selectionTags").options = updatedTags.map((tag) => {
        return { label: tag, value: tag };
      });
      $w("#selectionTags").show();
    } else {
      $w("#selectionTags").hide();
    }
  }
});

