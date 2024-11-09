import { mediaManager } from "wix-media-backend";

import { Permissions, webMethod } from "wix-web-module";
import { files } from "wix-media.v2";
import { elevate } from "wix-auth";

/* Sample fileId value: 'd4dde1_dee18c9ada174a818ccf75c50e72c739~mv2.jpg'
 *
 * Sample options value:
 * {
 *   assetKeys: ['320kbs.mp3'],
 *   downloadFileName: 'MyAudio.mp3',
 *   expirationInMinutes: '60',
 *   expirationRedirectUrl: 'www.example.com/store'
 * }
 */

export const myGetDownloadUrlFunction = webMethod(
  Permissions.Anyone,
  async (fileId, options) => {
    try {
      const elevatedGenerateFileDonwloadUrl = elevate(
        files.generateFileDownloadUrl
      );
      const result = await elevatedGenerateFileDonwloadUrl(fileId);

      const url = result.downloadUrls[0].url;
      return url;
    } catch (error) {
      console.error(error);
      // Handle the error
    }
  }
);

export async function myGetDownloadUrlFunction1(fileUrl) {
  const myFileDownloadUrl = await mediaManager.getDownloadUrl(fileUrl);
  return myFileDownloadUrl;
}
