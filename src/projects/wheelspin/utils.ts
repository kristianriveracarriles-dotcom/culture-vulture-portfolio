import {
  decodeFont,
  decodeImage,
  FileAsset,
  FontAsset,
  ImageAsset,
} from "@rive-app/react-webgl2";

const ASSET_PATH = "/assets/rive/";

const loadRiveAsset = (
  asset: FileAsset,
  url: string,
  decode: (bytes: Uint8Array) => Promise<any>,
  setAsset: (decoded: any) => void,
  assetType: "image" | "font"
): void => {
  fetch(url, { cache: "force-cache" })
    .then(async (res) => {
      const bytes = new Uint8Array(await res.arrayBuffer());
      const decoded = await decode(bytes);
      if (decoded) {
        setAsset(decoded);
        if (typeof decoded.unref === 'function') {
          try {
            decoded.unref();
          } catch (e) {
            console.warn(`[Rive] Failed to unref ${assetType} ${asset.name}:`, e);
          }
        }
      }
    })
    .catch((error) => {
      console.error(`Error in fetching rive ${assetType} asset: ${url}`, error);
    });
};

const setImageAsset = (asset: ImageAsset): void => {
  loadRiveAsset(
    asset,
    `${ASSET_PATH}${asset.name}`,
    decodeImage,
    (image) => asset.setRenderImage(image),
    "image"
  );
};

const setFontAsset = (asset: FontAsset): void => {
  loadRiveAsset(
    asset,
    `${ASSET_PATH}${asset.name}.ttf`,
    decodeFont,
    (font) => asset.setFont(font as any),
    "font"
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
