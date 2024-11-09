import { lightbox } from "wix-window-frontend";

$w.onReady(function () {
  let receivedData = lightbox.getContext();

  $w("#greeting").text = receivedData.greeting.toUpperCase();
  $w("#subject").text = receivedData.subject.toUpperCase();

  $w("#blueButton").onClick(clickHandler);
  $w("#greenButton").onClick(clickHandler);
  $w("#pinkButton").onClick(clickHandler);
});

function clickHandler(event) {
  lightbox.close(event.target.label);
}

$w.onReady(function () {});

