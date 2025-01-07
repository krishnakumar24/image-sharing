import { Images_afterInsert } from "backend/emailHooks.web.js";
import wixData from "wix-data";
import wixLocationFrontend from "wix-location-frontend";
import { currentMember } from "wix-members-frontend";

const loaderVideoSelector = "#loaderVideo";

let uploadedFiles;

$w.onReady(function () {
  try {
    $w(loaderVideoSelector).hide();
    $w("#imageUpload").required = true;
    $w("#fileNeedErrorMsg").hide();
    $w("#max4MsgNormal").show();
    $w("#max4MsgError").hide();
    $w("#imageUpload").onChange(async (event) => {
      console.log("upload event ", event);
      $w("#fileNeedErrorMsg").hide();
      try {
        if ($w("#imageUpload").value.length > 0) {
          uploadedFiles = await $w("#imageUpload").uploadFiles();
        } else {
          uploadedFiles = [];
        }
      } catch (uploadError) {
        console.error(uploadError);
      }
    });

    $w("#tagsInput").onCustomValidation((value) => {
      console.log("tagsInput value", value);
      const tagArray = value.split(",").map((tag) => tag.trim());
      // .filter((tag) => tag !== "");
      const isTagsFieldIsInvalid = tagArray.length > 4;
      if (isTagsFieldIsInvalid) {
        $w("#max4MsgNormal").hide();
        $w("#max4MsgError").show();
      } else {
        $w("#max4MsgNormal").show();
        $w("#max4MsgError").hide();
      }
    });

    /**
     * On Submit Clicked
     */
    $w("#addImageButton").onClick(async () => {
      const options = {
        fieldsets: ["FULL"],
      };
      let user = await currentMember.getMember(options);
      console.log("userData while adding image", user);
      if (!user?._id) {
        console.error("Error getting user while adding image");
        return;
      }

      const newTags = $w("#tagsInput")
        .value.split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");
      console.log("newTags", newTags);

      // Check if any required fields are invalid
      const isImageUploadEmpty = !($w("#imageUpload").value.length > 0);
      const isTitleEmpty = !$w("#addImgTitleInput").value;
      const isDescriptionEmpty = !$w("#descriptionInput").value;
      const isTagsFieldIsInvalid = newTags.length > 4;

      // Show error message for empty file upload
      if (isImageUploadEmpty) $w("#fileNeedErrorMsg").show();
      if (isTitleEmpty) $w("#addImgTitleInput").value = null;
      if (isDescriptionEmpty) $w("#descriptionInput").value = null;

      // Prevent further execution if any field is invalid
      if (
        isImageUploadEmpty ||
        isTitleEmpty ||
        isDescriptionEmpty ||
        isTagsFieldIsInvalid
      ) {
        return;
      }
      $w(loaderVideoSelector).show();

      const title = $w("#addImgTitleInput").value;
      const image = uploadedFiles[0].fileUrl; // Assuming imageUpload is the ID of the image upload button
      const description = $w("#descriptionInput").value;
      const isPublic = $w("#isPublicInput").value;

      //CMS Record Object
      const newItem = {
        title: title,
        image: image,
        description: description,
        isPublic: isPublic,
        arraystring: newTags,
        userId: user._id,
      };

      console.log("newItem -- before inserting data: ", newItem);

      // Insert the item into the collection
      wixData
        .insert("Images", newItem)
        .then((result) => {
          console.log("Item added:", result);

          Images_afterInsert(user._id, isPublic, user.loginEmail);

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
    });
  } catch (e) {
    console.log("Exception", e);
  }
});

