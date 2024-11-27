import { currentMember } from "wix-members-frontend";
import { onLogin, currentUser } from "wix-users";
import { authentication } from "wix-members-frontend";

$w.onReady(function () {
  $w("#addImgBtn").hide();
  $w("#myImagesBtn").hide();

  /**
   * On Login Rem
   */
  authentication.onLogin(async (member) => {
    const loggedInMember = await member.getMember();
    console.log("authentication API data", loggedInMember);
    if (loggedInMember?._id) {
      $w("#addImgBtn").show();
      $w("#myImagesBtn").show();
    }
  });

  const options = {
    fieldsets: ["PUBLIC"],
  };
  let user = currentMember
    .getMember(options)
    .then((member) => {
      console.log("member", member);
      if (member) {
        $w("#addImgBtn").show();
        $w("#myImagesBtn").show();
      }

      return member;
    })
    .catch((error) => {
      console.error("Custom error : fetching current user in global");
      console.error(error);
    });
});
