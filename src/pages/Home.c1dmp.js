import wixLocation from "wix-location";
import wixData from "wix-data";

let images = []; // Array to store loaded images
let skip = 0; // Number of items to skip in the query
const limit = 12; // Initial limit
const loadMoreCount = 10; // Number of images to load on "Load More"

$w.onReady(() => {
  $w("#homeGallery").delete;
  $w("#homeGallery").restore;
  // @ts-ignore
  $w("#homeGallery").items = [];
  loadImages(skip, limit);

  $w("#loadMoreButton").onClick(() => {
    skip += loadMoreCount; // Increase the skip count
    loadImages(skip, loadMoreCount); // Load more images
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
      console.log("images query results in home page", results);

      console.log(`HOME PAGE  --> results.items.length`, results.items.length);
      if (results?.items && results.items.length > 0) {
        // Add the new images to the existing array
        images = images.concat(
          results.items.map((item) => {
            console.log(`item["link-images-title"]`, item["link-images-title"]);
            return {
              src: item.image,
              title: item.title || "",
              description: item.description || "",
              link: item["link-images-title"] || "",
              alt: item.title || "",
            };
          })
        );

        // Update the gallery with the new images
        console.log(
          `images used in the home gallery ------------------`,
          images
        );
        // @ts-ignore gallery api not recognized
        $w("#homeGallery").items = images;
        // console.log("$w(#homeGallery)", JSON.stringify($w("#homeGallery")));

        // If fewer items than requested are returned, hide the Load More button
        if (results.items.length < limitCount) {
          $w("#loadMoreButton").hide();
        }
      } else {
        // If no items are returned, hide the Load More button
        $w("#loadMoreButton").hide();
      }
    })
    .catch((err) => {
      console.error("Error loading images:", err);
    });
}
