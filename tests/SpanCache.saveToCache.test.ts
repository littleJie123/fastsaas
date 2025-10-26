
// tests/SpanCache.saveToCache.test.ts

import SpanCache, { Span, SpanOpt, SpanCacheKeyType } from '../src/cache/SpanCache';

interface TestPojo {
  id: string;
  time: string;
  value: string;
}

describe('SpanCache saveToCache', () => {
  let mockSpanOpt: SpanOpt<TestPojo>;
  let spanCache: SpanCache<TestPojo>;

  // Helper to generate mock data
  const generateMockData = (begin: string, end: string): TestPojo[] => {
    const data: TestPojo[] = [];
    const start = parseInt(begin, 10);
    const finish = parseInt(end, 10);
    for (let i = start; i <= finish; i++) {
      data.push({ id: i.toString(), time: `2023-01-${String(i).padStart(2, '0')}`, value: `Value ${i}` });
    }
    return data;
  };

  beforeEach(() => {
    mockSpanOpt = {
      findFromDb: jest.fn(), // Not directly used by saveToCache, but required by interface
      getKeyFromPojo: jest.fn((pojo: TestPojo) => pojo.id),
      getKeysFromSpan: jest.fn(), // Not directly used by saveToCache, but required by interface
      isAdjacent: jest.fn((key1: SpanCacheKeyType, key2: SpanCacheKeyType) => {
        if (typeof key1 === 'number' && typeof key2 === 'number') {
          return key1 + 1 === key2;
        }
        if (typeof key1 === 'string' && typeof key2 === 'string') {
          return parseInt(key1, 10) + 1 === parseInt(key2, 10);
        }
        return false;
      }),
    };
    spanCache = new SpanCache<TestPojo>(mockSpanOpt);
  });

  // Test Case 1: Initial save (empty cache)
  test('should initialize cache and span on first save', async () => {
    const param: Span = { begin: '1', end: '3' };
    const datas = generateMockData('1', '3');
    await spanCache.saveToCache(param, datas);

    // @ts-ignore - Access private property for testing
    expect(spanCache.span).toEqual(param);
    // @ts-ignore
    expect(Object.keys(spanCache.cacheMap)).toEqual(['1', '2', '3']);
    expect(mockSpanOpt.findFromDb).toHaveBeenCalledTimes(0);
  });

  // Test Case 2: Valid adjacency (before)
  test('should extend cache span when new data is adjacent before current span', async () => {
    // Initial cache: [3, 5]
    await spanCache.saveToCache({ begin: '3', end: '5' }, generateMockData('3', '5'));
    // @ts-ignore
    expect(spanCache.span).toEqual({ begin: '3', end: '5' });

    // New data: [1, 2] - adjacent before [3,5]
    const param: Span = { begin: '1', end: '2' };
    const datas = generateMockData('1', '2');
    await spanCache.saveToCache(param, datas);

    // @ts-ignore
    expect(spanCache.span).toEqual({ begin: '1', end: '5' });
    // @ts-ignore
    expect(Object.keys(spanCache.cacheMap).sort()).toEqual(['1', '2', '3', '4', '5']);
    expect(mockSpanOpt.isAdjacent).toHaveBeenCalledWith('2', '3'); // newEnd, currentBegin
  });

  // Test Case 3: Valid adjacency (after)
  test('should extend cache span when new data is adjacent after current span', async () => {
    // Initial cache: [1, 3]
    await spanCache.saveToCache({ begin: '1', end: '3' }, generateMockData('1', '3'));
    // @ts-ignore
    expect(spanCache.span).toEqual({ begin: '1', end: '3' });

    // New data: [4, 5] - adjacent after [1,3]
    const param: Span = { begin: '4', end: '5' };
    const datas = generateMockData('4', '5');
    await spanCache.saveToCache(param, datas);

    // @ts-ignore
    expect(spanCache.span).toEqual({ begin: '1', end: '5' });
    // @ts-ignore
    expect(Object.keys(spanCache.cacheMap).sort()).toEqual(['1', '2', '3', '4', '5']);
    expect(mockSpanOpt.isAdjacent).toHaveBeenCalledWith('3', '4'); // currentEnd, newBegin
  });

  // Test Case 4: Error: Overlap (strict overlap)
  test('should throw error if new span strictly overlaps with current span', async () => {
    // Initial cache: [1, 5]
    await spanCache.saveToCache({ begin: '1', end: '5' }, generateMockData('1', '5'));

    // New data: [3, 7] - overlaps
    const param: Span = { begin: '3', end: '7' };
    const datas = generateMockData('3', '7');
    await expect(spanCache.saveToCache(param, datas)).rejects.toThrow(
      "您的参数不合法，不能合并"
    );
  });

  // Test Case 5: Error: Overlap (touching, as per user's new definition)
  test('should throw error if new span touches current span (user-defined overlap)', async () => {
    // Initial cache: [1, 5]
    await spanCache.saveToCache({ begin: '1', end: '5' }, generateMockData('1', '5'));

    // New data: [5, 7] - touches at '5', which is now considered overlap
    const param: Span = { begin: '5', end: '7' };
    const datas = generateMockData('5', '7');
    await expect(spanCache.saveToCache(param, datas)).rejects.toThrow(
      "您的参数不合法，不能合并"
    );
    
  });

  // Test Case 6: Error: Gap
  test('should throw error if new span has a gap with current span', async () => {
    // Initial cache: [1, 5]
    await spanCache.saveToCache({ begin: '1', end: '5' }, generateMockData('1', '5'));

    // New data: [7, 9] - has a gap
    const param: Span = { begin: '7', end: '9' };
    const datas = generateMockData('7', '9');
    await expect(spanCache.saveToCache(param, datas)).rejects.toThrow(
      "您的参数不合法，不能合并"
    );
    
  });

  // Test Case 7: Error: isAdjacent not provided
  test('should throw error if isAdjacent is not provided for existing spans', async () => {
    // Initial cache: [1, 3]
    await spanCache.saveToCache({ begin: '1', end: '3' }, generateMockData('1', '3'));

    // Remove isAdjacent from mockSpanOpt
    mockSpanOpt.isAdjacent = undefined;

    const param: Span = { begin: '4', end: '5' };
    const datas = generateMockData('4', '5');
    await expect(spanCache.saveToCache(param, datas)).rejects.toThrow(
      "您的参数不合法，不能合并"
    );
  });

  // Test Case 8: Valid adjacency with null (before)
  test('should extend cache to -infinity when new data is adjacent before with null begin', async () => {
    // Initial cache: [10, 20]
    await spanCache.saveToCache({ begin: '10', end: '20' }, generateMockData('10', '20'));

    // New data: [null, 9] - adjacent before [10, 20]
    const param: Span = { begin: null, end: '9' };
    const datas = generateMockData('1', '9'); // Assuming some data for the null range
    
    await spanCache.saveToCache(param, datas);

    // @ts-ignore
    expect(spanCache.span).toEqual({ begin: null, end: '20' });
  });

  // Test Case 9: Valid adjacency with null (after)
  test('should extend cache to +infinity when new data is adjacent after with null end', async () => {
    // Initial cache: [10, 20]
    await spanCache.saveToCache({ begin: '10', end: '20' }, generateMockData('10', '20'));

    // New data: [21, null] - adjacent after [10, 20]
    const param: Span = { begin: '21', end: null };
    const datas = generateMockData('21', '30'); // Assuming some data for the null range
    
    await spanCache.saveToCache(param, datas);

    // @ts-ignore
    expect(spanCache.span).toEqual({ begin: '10', end: null });
  });

  // Test Case 10: Error: Overlap with null begin
  test('should throw error if new span with null begin overlaps with current span', async () => {
    // Initial cache: [10, 20]
    await spanCache.saveToCache({ begin: '10', end: '20' }, generateMockData('10', '20'));

    // New data: [null, 15] - overlaps
    const param: Span = { begin: null, end: '15' };
    const datas = generateMockData('1', '15');
    await expect(spanCache.saveToCache(param, datas)).rejects.toThrow(
      "您的参数不合法，不能合并"
    );
  });
});
