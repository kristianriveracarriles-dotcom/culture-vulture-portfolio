import {
  decodeFont,
  decodeImage,
  FileAsset,
  FontAsset,
  ImageAsset,
} from "@rive-app/react-webgl2";

const ASSET_PATH = "/assets/rive/";

const imageCache = new Map<string, Promise<any>>();
const fontCache = new Map<string, Promise<any>>();

const setImageAsset = (asset: ImageAsset): void => {
  const url = `${ASSET_PATH}${asset.name}`;
if (!imageCache.has(url)) {
    const promise = fetch(url, { cache: "force-cache" })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const bytes = new Uint8Array(await res.arrayBuffer());
        return await decodeImage(bytes);
      })
      .catch((error) => {
        console.error(`Error in fetching rive image asset: ${url}`, error);
        imageCache.delete(url);
        return null;
      });
    imageCache.set(url, promise);
  }

  imageCache.get(url)!.then((image) => {
    if (image) {
      asset.setRenderImage(image);
    }
  });
};

const setFontAsset = (asset: FontAsset): void => {
  const url = `${ASSET_PATH}${asset.name}.ttf`;
if (!fontCache.has(url)) {
    const promise = fetch(url, { cache: "force-cache" })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const bytes = new Uint8Array(await res.arrayBuffer());
        return await decodeFont(bytes);
      })
      .catch((error) => {
        console.error(`Error in fetching rive font asset: ${url}`, error);
        fontCache.delete(url);
        return null;
      });
    fontCache.set(url, promise);
  }

  fontCache.get(url)!.then((font) => {
    if (font) {
      asset.setFont(font as any);
    }
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
