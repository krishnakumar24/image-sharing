import wixLocationFrontend from "wix-location-frontend";
import wixWindowFrontend from "wix-window-frontend";

$w.onReady(function () {
  $w("#editTagsBtn").onClick(() => openEditTags());
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

    wixWindowFrontend.openLightbox("EditTags", { id }).then((receivedData) => {
      let isUpdate = receivedData;

      console.log("Received data", isUpdate);
    });
  });
}

