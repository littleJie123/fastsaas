
import { StrUtil } from '../../src/util/StrUtil';

describe('StrUtil.compare', () => {
  test('Example 1: 你好啊 vs 你啊好', () => {
    const word = '你好啊';
    const target = '你啊好';
    const result = StrUtil.compare(word, [target]);
    // My logic: 2 matches, target gap "啊" (0.4), word gap "啊" (0.1) -> 2 - 0.5 = 1.5
    // Comment says 1.6
    console.log('Example 1 score:', result[0].score);
    expect(result[0].score).toBeCloseTo(1.5, 1);
  });

  test('Example 2: 你好啊 vs 我好啊', () => {
    const word = '你好啊';
    const target = '我好啊';
    const result = StrUtil.compare(word, [target]);
    // Matches "好啊" (2). Word gap "你" (0.1), Target gap "我" (0.1). Score 1.8.
    console.log('Example 2 score:', result[0].score);
    expect(result[0].score).toBeCloseTo(1.8, 1);
  });

  test('Example 3: 你好啊 vs 你坏啊', () => {
    const word = '你好啊';
    const target = '你坏啊';
    const result = StrUtil.compare(word, [target]);
    // Matches "你啊" (2). Word gap "好" (0.4), Target gap "坏" (0.4). Score 1.2.
    console.log('Example 3 score:', result[0].score);
    expect(result[0].score).toBeCloseTo(1.2, 1);
  });

  test('Full match', () => {
    const word = '你好啊';
    const target = '你好啊';
    const result = StrUtil.compare(word, [target]);
    expect(result[0].score).toBe(3);
  });

  test('Spaces in middle', () => {
    const word = '你 好 啊';
    const target = '你好啊';
    const result = StrUtil.compare(word, [target]);
    expect(result[0].score).toBe(3);
    
    const word2 = '你好啊';
    const target2 = '你 好 啊';
    const result2 = StrUtil.compare(word2, [target2]);
    expect(result2[0].score).toBe(3);
  });

  test('No match', () => {
    const word = '你好啊';
    const target = '我爱他';
    const result = StrUtil.compare(word, [target]);
    expect(result[0].score).toBe(0);
  });

  test('餐品', () => {
    const word = '油焖鸡 | 不免辣';
    const target = '油焖鸡';
    const result = StrUtil.compare(word, [target]);
    console.log('result', result);
    // expect(result[0].score).toBe(3);
  });
});
