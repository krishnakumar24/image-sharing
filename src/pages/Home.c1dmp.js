import wixLocation from "wix-location"; // For navigation
// // On page ready, fetch the first 20 items
// $w.onReady(function () {
//   let action = $w("#homeGallery");
//   console.log("action", action);

//   //
//   // Assuming you're using a repeater to display the items
//   // $w("#myRepeater").onItemReady(($item, itemData) => {
//   //   // When an item is clicked, navigate to the dynamic page with its unique slug or ID
//   //   $item("#myRepeaterItem").onClick(() => {
//   //     const slug = itemData.slug; // Assuming "slug" is the field you are using for dynamic pages
//   //     wixLocation.to(`/items/${slug}`); // Navigates to the dynamic page URL pattern
//   //   });
//   // });

//   // $w("#homeGallery").onItemClicked((event) => {
//   //   let itemIndex = event.itemIndex; // 3
//   //   console.log("event", event);
//   //   console.log("items", `/images/${event.item.slug}`);
//   //   wixLocation.to(`/images/${event.item.slug}`);

//   //   let capabilities = $w("#homeGallery").galleryCapabilities;
//   // });
// });
import wixData from "wix-data";

let images = []; // Array to store loaded images
let skip = 0; // Number of items to skip in the query
const limit = 12; // Initial limit
const loadMoreCount = 10; // Number of images to load on "Load More"

$w.onReady(() => {
  // // let galleryDetails = $w("#homeGallery").galleryCapabilities;
  // // console.log("gallerydetails", galleryDetails);
  // // Load initial set of images
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

      if (results.items.length > 0) {
        // Add the new images to the existing array
        images = images.concat(
          results.items.map((item) => {
            return {
              src: item.image, // Image field
              title: item.title || "", // Optional title
              description: item.description || "", // Optional description
              link: item["link-images-title"],
            };
          })
        );

        // Update the gallery with the new images
        // @ts-ignore gallery api not recognized
        $w("#homeGallery").items = images;
        console.log("$w(#homeGallery)", JSON.stringify($w("#homeGallery")));

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
