import { lightbox } from "wix-window-frontend";

$w.onReady(function () {
  let receivedData = lightbox.getContext();
  $w("#yesBtn").onClick(() => clickHandler(true));
  $w("#noBtn").onClick(() => clickHandler(false));
});

function clickHandler(isConfirm) {
  lightbox.close(isConfirm);
}

