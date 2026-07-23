import {
  decodeFont,
  decodeImage,
  FileAsset,
  FontAsset,
  ImageAsset,
} from "@rive-app/react-webgl2";

const ASSET_PATH = "/assets/rive/";

const fetchAsset = <T extends any>(
  url: string,
  assetName: string,
  assetType: string,
  decode: (bytes: Uint8Array) => Promise<T>,
  applyFn: (decoded: T) => void
): void => {
  fetch(url, { cache: "force-cache" })
    .then(async (res) => {
      const bytes = new Uint8Array(await res.arrayBuffer());
      const decoded = await decode(bytes);
      if (decoded) {
        applyFn(decoded);
        if (typeof (decoded as any).unref === 'function') {
          try {
            (decoded as any).unref();
          } catch (e) {
            console.warn(`[Rive] Failed to unref ${assetType} ${assetName}:`, e);
          }
        }
      }
    })
    .catch((error) => {
      console.error(`Error in fetching rive ${assetType} asset: ${url}`, error);
    });
};

const setImageAsset = (asset: ImageAsset): void => {
  fetchAsset(
    `${ASSET_PATH}${asset.name}`,
    asset.name,
    "image",
    decodeImage,
    (image) => asset.setRenderImage(image)
  );
};

const setFontAsset = (asset: FontAsset): void => {
  fetchAsset(
    `${ASSET_PATH}${asset.name}.ttf`,
    asset.name,
    "font",
    decodeFont,
    (font) => asset.setFont(font as any)
  );
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
