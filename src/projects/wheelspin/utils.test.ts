import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { riveAssetLoaderHandler } from './utils';
import { FileAsset, ImageAsset, FontAsset } from '@rive-app/react-webgl2';

vi.mock('@rive-app/react-webgl2', () => ({
  decodeImage: vi.fn().mockResolvedValue({
    unref: vi.fn(),
  }),
  decodeFont: vi.fn().mockResolvedValue({
    unref: vi.fn(),
  }),
}));

describe('riveAssetLoaderHandler', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn().mockResolvedValue({
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    });
    global.fetch = mockFetch as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should handle image asset with 0 bytes', () => {
    const asset = {
      isImage: true,
      isFont: false,
      name: 'test-image.png',
      setRenderImage: vi.fn(),
    } as unknown as ImageAsset;

    const bytes = new Uint8Array(0);

    const result = riveAssetLoaderHandler(asset as FileAsset, bytes);

    expect(result).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith('/assets/rive/test-image.png', { cache: 'force-cache' });
  });

  it('should handle font asset with 0 bytes', () => {
    const asset = {
      isImage: false,
      isFont: true,
      name: 'test-font',
      setFont: vi.fn(),
    } as unknown as FontAsset;

    const bytes = new Uint8Array(0);

    const result = riveAssetLoaderHandler(asset as FileAsset, bytes);

    expect(result).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith('/assets/rive/test-font.ttf', { cache: 'force-cache' });
  });

  it('should return false for image asset with >0 bytes', () => {
    const asset = {
      isImage: true,
      isFont: false,
      name: 'test-image.png',
      setRenderImage: vi.fn(),
    } as unknown as ImageAsset;

    const bytes = new Uint8Array([1, 2, 3]);

    const result = riveAssetLoaderHandler(asset as FileAsset, bytes);

    expect(result).toBe(false);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should return false for font asset with >0 bytes', () => {
    const asset = {
      isImage: false,
      isFont: true,
      name: 'test-font',
      setFont: vi.fn(),
    } as unknown as FontAsset;

    const bytes = new Uint8Array([1, 2, 3]);

    const result = riveAssetLoaderHandler(asset as FileAsset, bytes);

    expect(result).toBe(false);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should return false for non-image and non-font asset', () => {
    const asset = {
      isImage: false,
      isFont: false,
      name: 'test-audio.mp3',
    } as unknown as FileAsset;

    const bytes = new Uint8Array(0);

    const result = riveAssetLoaderHandler(asset, bytes);

    expect(result).toBe(false);
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
