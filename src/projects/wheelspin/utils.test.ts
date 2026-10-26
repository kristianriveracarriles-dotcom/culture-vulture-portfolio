import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { riveAssetLoaderHandler, sanitizeAssetName } from './utils';
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
      ok: true,
      status: 200,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    });
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
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

describe('sanitizeAssetName', () => {
  it('should return filename unchanged if safe', () => {
    expect(sanitizeAssetName('wheel_bg.png')).toBe('wheel_bg.png');
    expect(sanitizeAssetName('fonts/inter.ttf')).toBe('fontsinter.ttf');
  });

  it('should strip path traversal sequences and slashes', () => {
    expect(sanitizeAssetName('../../../etc/passwd')).toBe('etcpasswd');
    expect(sanitizeAssetName('..\\..\\windows\\system32')).toBe('windowssystem32');
  });

  it('should handle edge cases and URL-encoded path traversal sequences', () => {
    expect(sanitizeAssetName('..')).toBe('');
    expect(sanitizeAssetName('../..')).toBe('');
    expect(sanitizeAssetName('..\\..')).toBe('');
    expect(sanitizeAssetName('%2e%2e%2fetc%2fpasswd')).toBe('etcpasswd');
    expect(sanitizeAssetName('%2e%2e')).toBe('');
    expect(sanitizeAssetName('.env')).toBe('env');
  });
});

