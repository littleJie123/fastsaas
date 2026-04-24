
import { StrUtil } from '../../src/util/StrUtil';
import * as fs from 'fs';
import * as path from 'path';

describe('StrUtil File Compare Test', () => {
  const txt1Path = path.join(__dirname, '../../txt1.txt');
  const txt2Path = path.join(__dirname, '../../txt2.txt');

  const lines1 = fs.readFileSync(txt1Path, 'utf-8').split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const lines2 = fs.readFileSync(txt2Path, 'utf-8').split('\n').map(l => l.trim()).filter(l => l.length > 0);

  test('Batch compare txt1 and txt2 performance', () => {
    const start = Date.now();
    const results = StrUtil.compareList(lines1, lines2, { cnt: 1 });
    const end = Date.now();
    console.log(`Compare ${lines1.length} vs ${lines2.length} finished in ${end - start}ms`);
    expect(results.length).toBe(lines1.length);
  });

  test('Verify Case: 牛干巴 vs 火烧牛干巴', () => {
    const word = '牛干巴';
    const targets = ['火烧牛干巴', '牛干巴'];

    const results = StrUtil.compare(word, targets, { cnt: 5 });

    // 打印分值便于调试
    results.forEach(r => console.log(`Case 牛干巴: Score ${r.score.toFixed(2)} for "${r.data}"`));

    // 断言 1: 完全匹配项分数最高
    expect(results[0].data).toBe('牛干巴');
    // 断言 2: "火烧牛干巴" 分数应该大于 2.5 (3 - 2*0.1 = 2.8)
    const huoshao = results.find(r => r.data === '火烧牛干巴');
    expect(huoshao?.score).toBeGreaterThan(2.5);
  });

  test('Verify Case: 洋芋辣椒料 vs 炸洋芋料', () => {
    const word = '洋芋辣椒料';
    const targets = ['炸洋芋料', '贵州糊辣椒', '临沧糟辣椒'];

    const results = StrUtil.compare(word, targets, { cnt: 5 });

    // 打印分值便于调试
    results.forEach(r => console.log(`Case 洋芋辣椒料: Score ${r.score.toFixed(2)} for "${r.data}"`));

    // 断言: "炸洋芋料" 应该排在第一位（包含洋、芋、料三个字，综合评分最高）
    expect(results[0].data).toBe('炸洋芋料');
  });

  test('Verify threshold logic for short words', () => {
    const word = '大蒜'; // 长度为 2
    const targets = ['大蒜', '去皮蒜'];

    // 默认 threshold 是 1.5，对于 '大蒜' (满分 2.0) 应该能搜到
    const results = StrUtil.compare(word, targets);
    expect(results.some(r => r.data === '大蒜')).toBeTruthy();
  });

  test.only('去骨鸡爪', () => {
    const targets = ['带骨鸡腿', '无骨鸡爪', '鸡腿肉沫'];
    const word = '去骨鸡腿'
    const results = StrUtil.compareList([word], targets);
    console.log(JSON.stringify(results));
  })
});
