/**
 * IsNullCdt / IsNotNullCdt 在 toSql 时检查字段。
 * isHit 不检查。
 */
import IsNullCdt from '../../src/dao/query/cdt/imp/IsNullCdt';
import IsNotNullCdt from '../../src/dao/query/cdt/imp/IsNotNullCdt';

function sqlText(cdt: { toSql(colChanger?: any): { toSql(): string } }): string {
  return cdt.toSql().toSql().trim();
}

describe('IsNullCdt.toSql', () => {
  it('允许普通字段', () => {
    expect(sqlText(new IsNullCdt('age'))).toBe('`age` is null');
  });

  it('允许表.字段', () => {
    expect(sqlText(new IsNullCdt('note.title'))).toBe('`note`.`title` is null');
    expect(sqlText(new IsNullCdt('note_item.warehouse_id'))).toBe('`note_item`.`warehouse_id` is null');
  });

  it('拒绝非法字段', () => {
    expect(() => new IsNullCdt('1=1 or age').toSql()).toThrow('Cdt字段不合法');
    expect(() => new IsNullCdt('age` or 1=1').toSql()).toThrow('Cdt字段不合法');
    expect(() => new IsNullCdt('max(sysAddTime)').toSql()).toThrow('Cdt字段不合法');
    expect(() => new IsNullCdt('').toSql()).toThrow('Cdt字段不合法');
  });

  it('isHit 不检查字段', () => {
    expect(new IsNullCdt('1=1 or age').isHit({})).toBe(true);
    expect(new IsNullCdt('age').isHit({ age: 1 })).toBe(false);
    expect(new IsNullCdt('age').isHit({ age: null })).toBe(true);
  });
});

describe('IsNotNullCdt.toSql', () => {
  it('允许普通字段', () => {
    expect(sqlText(new IsNotNullCdt('changeCnt'))).toBe('`changeCnt` is not null');
  });

  it('允许表.字段', () => {
    expect(sqlText(new IsNotNullCdt('note.title'))).toBe('`note`.`title` is not null');
  });

  it('拒绝非法字段', () => {
    expect(() => new IsNotNullCdt('1=1 or age').toSql()).toThrow('Cdt字段不合法');
    expect(() => new IsNotNullCdt('age` or 1=1').toSql()).toThrow('Cdt字段不合法');
    expect(() => new IsNotNullCdt('note . title').toSql()).toThrow('Cdt字段不合法');
  });

  it('isHit 不检查字段', () => {
    expect(new IsNotNullCdt('1=1 or age').isHit({ '1=1 or age': 1 })).toBe(true);
    expect(new IsNotNullCdt('age').isHit({ age: null })).toBe(false);
    expect(new IsNotNullCdt('age').isHit({})).toBe(false);
  });
});
