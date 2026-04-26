import {
  decodeFont,
  decodeImage,
  FileAsset,
  FontAsset,
  ImageAsset,
} from "@rive-app/react-webgl2";

const ASSET_PATH = "/assets/rive/";

const setImageAsset = (asset: ImageAsset): void => {
  const url = `${ASSET_PATH}${asset.name}`;
  fetch(url, { cache: "force-cache" })
    .then(async (res) => {
      const bytes = new Uint8Array(await res.arrayBuffer());
      const image = await decodeImage(bytes);
      if (image) {
        asset.setRenderImage(image);
        if (typeof image.unref === 'function') {
          try {
            image.unref();
          } catch (e) {
            console.warn(`[Rive] Failed to unref image ${asset.name}:`, e);
          }
        }
      }
    })
    .catch((error) => {
      console.error(`Error in fetching rive image asset: ${url}`, error);
    });
};

const setFontAsset = (asset: FontAsset): void => {
  const url = `${ASSET_PATH}${asset.name}.ttf`;
  fetch(url, { cache: "force-cache" })
    .then(async (res) => {
      const bytes = new Uint8Array(await res.arrayBuffer());
      const font = await decodeFont(bytes);
      if (font) {
        asset.setFont(font as any);
        if (typeof font.unref === 'function') {
          try {
            font.unref();
          } catch (e) {
            console.warn(`[Rive] Failed to unref font ${asset.name}:`, e);
          }
        }
      }
    })
    .catch((error) => {
      console.error(`Error in fetching rive font asset: ${url}`, error);
    });
};

export const riveAssetLoaderHandler = (
  asset: FileAsset,
  bytes: Uint8Array
): boolean => {
  if (asset.isImage && bytes.length === 0) {
    setImageAsset(asset as ImageAsset);
    return true;
  }
  if (asset.isFont && bytes.length === 0) {
    setFontAsset(asset as FontAsset);
    return true;
  }
  return false;
};
