// tests/SpanCache.test.ts

import SpanCache, { Span, SpanOpt } from '../src/cache/SpanCache';

interface TestPojo {
  id: string;
  time: string; // Assuming time is a sortable string like 'YYYY-MM-DD HH:mm:ss' or just a number string
  value: string;
}

describe('SpanCache', () => {
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
      findFromDb: jest.fn(async (span: Span) => {
        if (span.begin === null || span.end === null) {
            // Handle infinite cases for mock
            const b = span.begin === null ? 1 : parseInt(span.begin as string, 10);
            const e = span.end === null ? 30 : parseInt(span.end as string, 10);
            return generateMockData(b.toString(), e.toString());
        }
        if (!span.begin || !span.end) {
          return [];
        }
        console.log(`Mock findFromDb called for: ${span.begin}-${span.end}`);
        return generateMockData(span.begin as string, span.end as string);
      }),
      getKeyFromPojo: jest.fn((pojo: TestPojo) => pojo.id),
      getKeysFromSpan: jest.fn((span: Span) => {
        if (span.begin === null || span.end === null) {
            const b = span.begin === null ? 1 : parseInt(span.begin as string, 10);
            const e = span.end === null ? 30 : parseInt(span.end as string, 10);
            const keys: string[] = [];
            for (let i = b; i <= e; i++) {
              keys.push(i.toString());
            }
            return keys;
        }
        if (!span.begin || !span.end) {
          return [];
        }
        const keys: string[] = [];
        const start = parseInt(span.begin as string, 10);
        const finish = parseInt(span.end as string, 10);
        for (let i = start; i <= finish; i++) {
          keys.push(i.toString());
        }
        return keys;
      }),
    };
    spanCache = new SpanCache<TestPojo>(mockSpanOpt);
  });

  // Test Case 1: Initial fetch (empty cache)
  test('should fetch data from DB and populate cache on initial call', async () => {
    const requestedSpan: Span = { begin: '1', end: '3' };
    const result = await spanCache.find(requestedSpan);

    expect(mockSpanOpt.findFromDb).toHaveBeenCalledTimes(1);
    expect(mockSpanOpt.findFromDb).toHaveBeenCalledWith(requestedSpan);
    expect(result).toHaveLength(3);
    expect(result.map(p => p.id)).toEqual(['1', '2', '3']);
  });

  // Test Case 2: Full cache hit
  test('should return data from cache if requested span is fully within cached span', async () => {
    // First, populate the cache
    await spanCache.find({ begin: '1', end: '5' });
    (mockSpanOpt.findFromDb as jest.Mock).mockClear(); // Clear mock calls

    const requestedSpan: Span = { begin: '2', end: '4' };
    const result = await spanCache.find(requestedSpan);

    expect(mockSpanOpt.findFromDb).not.toHaveBeenCalled(); // Should not call DB again
    expect(result).toHaveLength(3);
    expect(result.map(p => p.id)).toEqual(['2', '3', '4']);
  });

  // Test Case 3: Partial cache miss (before)
  test('should fetch missing data before current span and update cache', async () => {
    // Populate cache with '3' to '5'
    await spanCache.find({ begin: '3', end: '5' });
    (mockSpanOpt.findFromDb as jest.Mock).mockClear();

    const requestedSpan: Span = { begin: '1', end: '4' };
    const result = await spanCache.find(requestedSpan);

    expect(mockSpanOpt.findFromDb).toHaveBeenCalledTimes(1);
    expect(mockSpanOpt.findFromDb).toHaveBeenCalledWith({ begin: '1', end: '3' }); // Fetches '1', '2'
    expect(result).toHaveLength(4);
    expect(result.map(p => p.id).sort()).toEqual(['1', '2', '3', '4']); // Sort to handle potential order differences
  });

  // Test Case 4: Partial cache miss (after)
  test('should fetch missing data after current span and update cache', async () => {
    // Populate cache with '1' to '3'
    await spanCache.find({ begin: '1', end: '3' });
    (mockSpanOpt.findFromDb as jest.Mock).mockClear();

    const requestedSpan: Span = { begin: '2', end: '5' };
    const result = await spanCache.find(requestedSpan);

    expect(mockSpanOpt.findFromDb).toHaveBeenCalledTimes(1);
    expect(mockSpanOpt.findFromDb).toHaveBeenCalledWith({ begin: '3', end: '5' }); // Fetches '4', '5' (from 3 to 5, as 3 is the end of current span)
    expect(result).toHaveLength(4);
    expect(result.map(p => p.id).sort()).toEqual(['2', '3', '4', '5']);
  });

  // Test Case 5: Partial cache miss (both before and after)
  test('should fetch missing data both before and after current span and update cache', async () => {
    // Populate cache with '3' to '4'
    await spanCache.find({ begin: '3', end: '4' });
    (mockSpanOpt.findFromDb as jest.Mock).mockClear();

    const requestedSpan: Span = { begin: '1', end: '6' };
    const result = await spanCache.find(requestedSpan);

    expect(mockSpanOpt.findFromDb).toHaveBeenCalledTimes(2);
    expect(mockSpanOpt.findFromDb).toHaveBeenCalledWith({ begin: '1', end: '3' });
    expect(mockSpanOpt.findFromDb).toHaveBeenCalledWith({ begin: '4', end: '6' });
    expect(result).toHaveLength(6);
    expect(result.map(p => p.id).sort()).toEqual(['1', '2', '3', '4', '5', '6']);
  });

  test('和缓存不重叠', async () => {
    // Populate cache with '3' to '4'
    await spanCache.find({ begin: '6', end: '9' });
    (mockSpanOpt.findFromDb as jest.Mock).mockClear();

    const requestedSpan: Span = { begin: '1', end: '3' };
    const result = await spanCache.find(requestedSpan);

    expect(mockSpanOpt.findFromDb).toHaveBeenCalledTimes(1);
    expect(mockSpanOpt.findFromDb).toHaveBeenCalledWith({ begin: '1', end: '6' });
    expect(result).toHaveLength(3);
    expect(result.map(p => p.id).sort()).toEqual(['1', '2', '3']);
  });

  // --- Tests for null spans ---

  test('should fetch from -infinity when begin is null', async () => {
    await spanCache.find({ begin: '10', end: '20' });
    (mockSpanOpt.findFromDb as jest.Mock).mockClear();

    const requestedSpan: Span = { begin: null, end: '15' };
    await spanCache.find(requestedSpan);

    expect(mockSpanOpt.findFromDb).toHaveBeenCalledTimes(1);
    expect(mockSpanOpt.findFromDb).toHaveBeenCalledWith({ begin: null, end: '10' });
  });

  test('should fetch to +infinity when end is null', async () => {
    await spanCache.find({ begin: '10', end: '20' });
    (mockSpanOpt.findFromDb as jest.Mock).mockClear();

    const requestedSpan: Span = { begin: '15', end: null };
    await spanCache.find(requestedSpan);

    expect(mockSpanOpt.findFromDb).toHaveBeenCalledTimes(1);
    expect(mockSpanOpt.findFromDb).toHaveBeenCalledWith({ begin: '20', end: null });
  });

  test('should fetch from -infinity to +infinity when both are null', async () => {
    await spanCache.find({ begin: '10', end: '20' });
    (mockSpanOpt.findFromDb as jest.Mock).mockClear();

    const requestedSpan: Span = { begin: null, end: null };
    await spanCache.find(requestedSpan);

    expect(mockSpanOpt.findFromDb).toHaveBeenCalledTimes(2);
    expect(mockSpanOpt.findFromDb).toHaveBeenCalledWith({ begin: null, end: '10' });
    expect(mockSpanOpt.findFromDb).toHaveBeenCalledWith({ begin: '20', end: null });
  });

  test('should hit cache when requesting -infinity and cache starts at -infinity', async () => {
    await spanCache.find({ begin: null, end: '20' });
    (mockSpanOpt.findFromDb as jest.Mock).mockClear();

    const requestedSpan: Span = { begin: null, end: '10' };
    const result = await spanCache.find(requestedSpan);

    expect(mockSpanOpt.findFromDb).not.toHaveBeenCalled();
    expect(result.length).toBeGreaterThan(0);
  });

  test('should hit cache when requesting to +infinity and cache ends at +infinity', async () => {
    await spanCache.find({ begin: '10', end: null });
    (mockSpanOpt.findFromDb as jest.Mock).mockClear();

    const requestedSpan: Span = { begin: '20', end: null };
    const result = await spanCache.find(requestedSpan);

    expect(mockSpanOpt.findFromDb).not.toHaveBeenCalled();
    expect(result.length).toBeGreaterThan(0);
  });
});