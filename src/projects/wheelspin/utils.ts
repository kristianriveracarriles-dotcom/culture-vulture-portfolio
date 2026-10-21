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

const fetchAndDecodeAsset = <T>(
  url: string,
  cache: Map<string, Promise<T | null>>,
  assetType: string,
  decodeFn: (bytes: Uint8Array) => Promise<T>,
  applyFn: (decoded: T) => void
): void => {
  if (!cache.has(url)) {
    const promise = fetch(url, { cache: "force-cache" })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const bytes = new Uint8Array(await res.arrayBuffer());
        return await decodeFn(bytes);
      })
      .catch((error) => {
        console.error(`Error in fetching rive ${assetType} asset: ${url}`, error);
        cache.delete(url);
        return null;
      });
    cache.set(url, promise);
  }

  cache.get(url)!.then((decoded) => {
    if (decoded) {
      applyFn(decoded);
    }
  });
};

export const sanitizeAssetName = (name: string): string => {
  let sanitized = name;
  try {
    let prev = "";
    while (sanitized !== prev && sanitized.includes("%")) {
      prev = sanitized;
      sanitized = decodeURIComponent(sanitized);
    }
  } catch {
    // Fall back to raw string if decodeURIComponent fails
  }
  return sanitized
    .replace(/[\x00-\x1F\x7F]/g, "")
    .replace(/^(\.\.[\/\\])+/g, "")
    .replace(/[\/\\]/g, "");
};

const setImageAsset = (asset: ImageAsset): void => {
  const safeName = sanitizeAssetName(asset.name);
  const url = `${ASSET_PATH}${safeName}`;
  fetchAndDecodeAsset(
    url,
    imageCache,
    "image",
    decodeImage,
    (image) => asset.setRenderImage(image)
  );
};

const setFontAsset = (asset: FontAsset): void => {
  const safeName = sanitizeAssetName(asset.name);
  const url = `${ASSET_PATH}${safeName}.ttf`;
  fetchAndDecodeAsset(
    url,
    fontCache,
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
