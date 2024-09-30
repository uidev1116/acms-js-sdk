import { describe, it, expect } from 'vitest';
import { splitPath } from './utils';

describe('splitPath function', () => {
  it('should split on unescaped slashes', () => {
    const path = 'part1/part2/part3';
    const result = splitPath(path);
    expect(result).toEqual(['part1', 'part2', 'part3']);
  });

  it('should not split on escaped slashes', () => {
    const path = 'part1/part2\\/part3/part4';
    const result = splitPath(path);
    expect(result).toEqual(['part1', 'part2\\/part3', 'part4']);
  });

  it('should handle multiple escaped slashes', () => {
    const path = 'part1\\/part2\\/part3/part4';
    const result = splitPath(path);
    expect(result).toEqual(['part1\\/part2\\/part3', 'part4']);
  });

  it('should handle escaped slashes at the end', () => {
    const path = 'part1/part2/part3\\';
    const result = splitPath(path);
    expect(result).toEqual(['part1', 'part2', 'part3\\']);
  });

  it('should handle trailing slash and escaped slashed', () => {
    const path = 'part1/part2\\/part3/part4';
    const result = splitPath(path);
    expect(result).toEqual(['part1', 'part2\\/part3', 'part4']);
  });

  it('should handle leading slash and escaped slashes', () => {
    const path = '/part1/part2\\/part3/part4';
    const result = splitPath(path);
    expect(result).toEqual(['part1', 'part2\\/part3', 'part4']);
  });

  it('should handle multiple escaped slash', () => {
    const path = 'part1/part2\\/part3/part4\\/part5';
    const result = splitPath(path);
    expect(result).toEqual(['part1', 'part2\\/part3', 'part4\\/part5']);
  });

  it('should handle empty string', () => {
    const path = '';
    const result = splitPath(path);
    expect(result).toEqual([]);
  });
});
