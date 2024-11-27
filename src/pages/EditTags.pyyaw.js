import { lightbox } from "wix-window-frontend";
import wixData from "wix-data";

$w.onReady(function () {
  let receivedData = lightbox.getContext();
  console.log(receivedData);
  const imageId = receivedData.id;
  $w("#yesBtn").onClick(() => updateHandler(imageId));
  $w("#noBtn").onClick(() => lightbox.close());

  wixData
    .get("Images", imageId)
    .then((item) => {
      if (item) {
        const tags = item.arraystring ?? []; // Replace 'Tags' with the actual field key
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
    })
    .catch((err) => {
      console.error("Error retrieving item:", err);
    });
});

export function updateHandler(imageId) {
  const commaCount = ($w("#tagsInput").value.match(/,/g) || []).length;

  if (commaCount <= 3) {
    $w("#errorMessageText").hide();

    const newTags = $w("#tagsInput")
      .value.trim()
      .split(",")
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
        lightbox.close();

        return wixData.update("Images", imageData);
      })
      .then(() => {
        console.log("Tags added successfully.");
      })
      .catch((err) => {
        console.error("Error updating tags:", err);
      });
  } else {
    $w("#errorMessageText").show();
  }
}

