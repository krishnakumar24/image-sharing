import wixLocation from "wix-location";
import wixData from "wix-data";

let images = [];

//Pagingation Variables
let skip = 0;
const limit = 12;
const loadMoreCount = 10;

$w.onReady(() => {
  // $w("#homeGallery").delete;
  // $w("#homeGallery").restore;
  // @ts-ignore
  $w("#homeGallery").items = [];
  loadImages(skip, limit);

  $w("#loadMoreButton").onClick(() => {
    skip += loadMoreCount;
    loadImages(skip, loadMoreCount);
  });
});

function loadImages(skipCount, limitCount) {
  const siteUrl = wixLocation.baseUrl;

  console.log("Current site URL:", siteUrl);
  wixData
    .query("Images")
    .eq("isPublic", "Public")
    .skip(skipCount)
    .limit(limitCount)
    .find()
    .then((results) => {
      if (results?.items && results.items.length > 0) {
        images = images.concat(
          results.items.map((item) => {
            return {
              src: item.image,
              title: item.title || "",
              description: item.description || "",
              link: item["link-images-title"] || "",
              alt: item.title || "",
            };
          })
        );

        // @ts-ignore gallery api not recognized
        $w("#homeGallery").items = images;

        if (results.items.length < limitCount) {
          $w("#loadMoreButton").hide();
        }
      } else {
        $w("#loadMoreButton").hide();
      }
    })
    .catch((err) => {
      console.error("Error loading images:", err);
    });
}
