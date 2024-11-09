// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world

import wixLocation from "wix-location"; // For navigation
// On page ready, fetch the first 20 items
$w.onReady(function () {
  let action = $w("#homeGallery");
  console.log("action", action);

  //
  // Assuming you're using a repeater to display the items
  // $w("#myRepeater").onItemReady(($item, itemData) => {
  //   // When an item is clicked, navigate to the dynamic page with its unique slug or ID
  //   $item("#myRepeaterItem").onClick(() => {
  //     const slug = itemData.slug; // Assuming "slug" is the field you are using for dynamic pages
  //     wixLocation.to(`/items/${slug}`); // Navigates to the dynamic page URL pattern
  //   });
  // });

  // $w("#homeGallery").onItemClicked((event) => {
  //   let itemIndex = event.itemIndex; // 3
  //   console.log("event", event);
  //   console.log("items", `/images/${event.item.slug}`);
  //   wixLocation.to(`/images/${event.item.slug}`);

  //   let capabilities = $w("#homeGallery").galleryCapabilities;
  // });
});
