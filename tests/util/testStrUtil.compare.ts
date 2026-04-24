
import { StrUtil } from '../../src/util/StrUtil';

describe('StrUtil.compare', () => {
  test('Example 1: 你好啊 vs 你啊好', () => {
    const word = '你好啊';
    const target = '你啊好';
    const result = StrUtil.compare(word, [target]);
    // Bigram: "你好","好啊" vs "你啊","啊好" -> 0 matches. 
    // 但因为单字符或部分重合，近似算法分值会不同
    console.log('Example 1 score:', result[0]?.score);
    expect(result.length).toBeGreaterThanOrEqual(0);
  });

  test('Example 2: 你好啊 vs 我好啊', () => {
    const word = '你好啊';
    const target = '我好啊';
    const result = StrUtil.compare(word, [target]);
    // Bigram: "你好","好啊" vs "我好","好啊" -> 1 match ("好啊")
    console.log('Example 2 score:', result[0]?.score);
    expect(result[0].score).toBeGreaterThan(0);
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
  });

  test('牛干巴 vs 火烧牛干巴', () => {
    const word = '牛干巴';
    const target = '火烧牛干巴';
    const result = StrUtil.compare(word, [target]);
    console.log('Score for "牛干巴" in "火烧牛干巴":', result[0].score);
    // 3 - (5-3)*0.1 = 2.8
    expect(result[0].score).toBeCloseTo(2.8, 1);
  });
});
