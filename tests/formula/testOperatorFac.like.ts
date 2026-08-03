/**
 * OperatorFac.like：
 * - 无 %：子串包含（原行为）
 * - 有 %：与 SQL LIKE 一致
 *
 * 通过 ArrayDao + Query.like 验证（内存过滤走 Cdt.isHit → OperatorFac）。
 */
import ArrayDao from '../../src/dao/imp/ArrayDao';
import Query from '../../src/dao/query/Query';

describe('OperatorFac like via ArrayDao', () => {
  let dao: any;

  beforeEach(() => {
    dao = new ArrayDao({
      tableName: 'material',
      array: [
        { name: '猪肉' },
        { name: '羊肉' },
        { name: '牛肉' },
        { name: '鸡蛋' },
        { name: '白菜' },
        { name: '肉丸' },
        { name: '红鸡蛋' },
        { name: '菜苔' }
      ]
    });
  });

  async function likeNames(pattern: string): Promise<string[]> {
    let list = await dao.find(new Query().like('name', pattern));
    return list.map((row: any) => row.name).sort();
  }

  it('无%：保持 contains，肉 命中猪羊牛肉丸', async () => {
    expect(await likeNames('肉')).toEqual(['牛肉', '猪肉', '肉丸', '羊肉'].sort());
  });

  it('无%：不含该子串则空', async () => {
    expect(await likeNames('鱼')).toEqual([]);
  });

  it('有%：肉% 仅匹配以肉开头', async () => {
    expect(await likeNames('肉%')).toEqual(['肉丸']);
  });

  it('有%：%肉 仅匹配以肉结尾', async () => {
    expect(await likeNames('%肉')).toEqual(['猪肉', '羊肉', '牛肉'].sort());
  });

  it('有%：%肉% 匹配任意位置含肉', async () => {
    expect(await likeNames('%肉%')).toEqual(['猪肉', '羊肉', '牛肉', '肉丸'].sort());
  });

  it('有%：鸡蛋% 精确前缀，不命中其他', async () => {
    expect(await likeNames('鸡蛋%')).toEqual(['鸡蛋']);
  });

  it('有%：%菜 后缀匹配白菜', async () => {
    expect(await likeNames('%菜')).toEqual(['白菜']);
  });

  it('有%：大小写不敏感', async () => {
    dao = new ArrayDao({
      tableName: 'material',
      array: [
        { name: 'ApplePie' },
        { name: 'Banana' },
      ]
    });
    expect(await likeNames('%apple%')).toEqual(['ApplePie']);
    expect(await likeNames('banana%')).toEqual(['Banana']);
  });
});
