import wixData from "wix-data";
import wixLocationFrontend from "wix-location-frontend";

const loaderVideoSelector = "#loaderVideo";

$w.onReady(function () {
  try {
    $w(loaderVideoSelector).hide();
    $w("#addImageButton").onClick(() => {
      let result = $w("#addImgForm");
      console.log("result", result);

      if ($w("#imageUpload").value.length > 0) {
        //   $w("#text1").text = "Uploading " + $w("#uploadButton1").value[0].name;

        $w(loaderVideoSelector).show();

        $w("#imageUpload")
          .uploadFiles()
          .then((uploadedFiles) => {
            const title = $w("#addImgTitleInput").value; // Assuming titleInput is the ID of the title input field
            const image = uploadedFiles[0].fileUrl; // Assuming imageUpload is the ID of the image upload button
            // const tags = $w("#tagsInput").value.split(","); // Assuming tags are comma-separated in the input field
            const description = $w("#descriptionInput").value;
            const isPublic = $w("#isPublicInput").value; // Assuming isPublicToggle is a toggle or dropdown for public status

            // Create an object to insert into the collection
            const newItem = {
              title: title,
              image: image, // This should be a valid file path or File object
              //   tags: tags,
              description: description,
              isPublic: isPublic,
            };

            console.log("newItem:", newItem);

            // Insert the item into the collection
            wixData
              .insert("Images", newItem)
              .then((result) => {
                console.log("Item added:", result);
                $w(loaderVideoSelector).hide();
                if (isPublic.toLowerCase() === "public") {
                  wixLocationFrontend.to("/");
                } else {
                  wixLocationFrontend.to("/my-images");
                }
                // Add any success messages or redirects here
              })
              .catch((error) => {
                console.error("Error adding item:", error);
                // Handle errors here
              });
          })
          .catch((uploadError) => {
            //   $w("#text1").text = "File upload error";
            console.log("File upload error: " + uploadError.errorCode);
            console.log(uploadError.errorDescription);
          });
      } else {
        //   $w("#text1").text = "Please choose a file to upload.";
      }
    });
  } catch (e) {
    console.log("Exception", e);
  }
});

