import { describe, it, expect } from 'vitest';
import AcmsClient from './AcmsClient';

// AcmsClient クラスのテスト
describe('AcmsClient', () => {
  // コンストラクタのテスト
  it('throws an error if baseUrl is empty', () => {
    const creation = () => new AcmsClient({ baseUrl: '', apiKey: '123456' });
    expect(creation).toThrow('baseUrl is required.');
  });

  // コンストラクタのテスト
  it('throws an error if apiKey is empty', () => {
    const creation = () =>
      new AcmsClient({ baseUrl: 'https://api.example.com', apiKey: '' });
    expect(creation).toThrow('apiKey is required.');
  });

  // コンストラクタのテスト（デフォルト設定）
  it('properly sets default options', () => {
    const client = new AcmsClient({
      baseUrl: 'https://api.example.com',
      apiKey: '123456',
    });
    expect(client.getConfig().responseType).toBe('json');
    expect(client.getConfig().acmsPathOptions).toEqual({});
  });

  // コンストラクタのテスト（オプション設定）
  it('properly merges provided options with default options', () => {
    const client = new AcmsClient({
      baseUrl: 'https://api.example.com',
      apiKey: '123456',
      responseType: 'text',
      acmsPathOptions: {
        segments: {
          bid: 'custom-bid',
          cid: 'custom-cid',
          eid: 'custom-eid',
          uid: 'custom-uid',
          page: 'custom-page',
        },
      },
    });

    expect(client.getConfig().responseType).toBe('text');
    expect(client.getConfig().acmsPathOptions).toEqual({
      segments: {
        bid: 'custom-bid',
        cid: 'custom-cid',
        eid: 'custom-eid',
        uid: 'custom-uid',
        page: 'custom-page',
      },
    });
  });

  // API version のテスト（v1）
  it('properly sets apiVersion in acmsPathOptions to v1', () => {
    const client = new AcmsClient({
      baseUrl: 'https://api.example.com',
      apiKey: '123456',
      acmsPathOptions: {
        apiVersion: 'v1',
      },
    });

    expect(client.getConfig().acmsPathOptions).toEqual({
      apiVersion: 'v1',
    });
  });

  // API version のテスト（v2）
  it('properly sets apiVersion in acmsPathOptions to v2', () => {
    const client = new AcmsClient({
      baseUrl: 'https://api.example.com',
      apiKey: '123456',
      acmsPathOptions: {
        apiVersion: 'v2',
      },
    });

    expect(client.getConfig().acmsPathOptions).toEqual({
      apiVersion: 'v2',
    });
  });
});
