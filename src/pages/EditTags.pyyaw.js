import { lightbox } from "wix-window-frontend";
import wixData from "wix-data";

$w.onReady(function () {
  $w("#selectionTags").hide();
  $w("#errorMessageText").hide();

  let receivedData = lightbox.getContext();
  console.log(receivedData);
  const imageId = receivedData.imageId;
  $w("#yesBtn").onClick(() => updateHandler(imageId));
  $w("#noBtn").onClick(() => lightbox.close([]));

  $w("#tagsInput").onCustomValidation((value) => {
    console.log("tagsInput value", value);
    const tagArray = value.split(",").map((tag) => tag.trim());
    // .filter((tag) => tag !== "");
    const isTagsFieldIsInvalid = tagArray.length > 4;
    if (isTagsFieldIsInvalid) {
      $w("#errorMessageText").hide();
    } else {
      $w("#errorMessageText").show();
    }
  });

  console.log("receivedData", receivedData);
  wixData
    .get("Images", imageId)
    .then((item) => {
      if (item) {
        const tags = item.arraystring ?? [];
        console.log(`Tags for item ${imageId}:`, tags);
        $w("#selectionTags").options = tags.map((tag) => {
          return { label: tag, value: tag };
        });
        $w("#tagsInput").value = tags.join(",");
      } else {
        $w("#selectionTags").value = [];
        $w("#tagsInput").value = "";
        console.log(`No item found with ID ${imageId}`);
      }
      $w("#selectionTags").show();
    })
    .catch((err) => {
      console.error("Error retrieving item:", err);
    });
});

export function updateHandler(imageId) {
  const newTags = $w("#tagsInput")
    .value.split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag !== "");

  // Fetch the current data for the image
  console.log("newTags Value from:", newTags);
  wixData
    .get("Images", imageId)
    .then((imageData) => {
      // Ensure Tags field is an array
      let updatedTags = imageData.Tags || [];

      // Merge new tags, ensuring no duplicates
      updatedTags = [...new Set([...updatedTags, ...newTags])];

      // Update the image data
      //   imageData.Tags = updatedTags;
      imageData.arraystring = updatedTags;
      lightbox.close(updatedTags);

      return wixData.update("Images", imageData);
    })
    .then(() => {
      console.log("Tags added successfully.");
    })
    .catch((err) => {
      console.error("Error updating tags:", err);
    });
}

