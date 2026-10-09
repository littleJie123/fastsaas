/**
 * NoteSafeCdt 跳过字段、操作符白名单，其余 toSql 行为与 Cdt 相同。
 */
import Cdt from '../../src/dao/query/cdt/imp/Cdt';
import NoteSafeCdt from '../../src/dao/query/cdt/imp/NoteSafeCdt';
import IColChanger from '../../src/dao/colChanger/IColChanger';

function sqlText(cdt: Cdt, colChanger?: IColChanger): string {
  return cdt.toSql(colChanger).toSql().trim();
}

describe('NoteSafeCdt.toSql', () => {
  it('函数字段不报错，并交给 colChanger', () => {
    let seen = '';
    let changer = {
      changeSql(sql: string) {
        seen = sql;
        return sql;
      }
    } as IColChanger;
    let cdt = new NoteSafeCdt('max(sysAddTime)', 1, '>');
    expect(sqlText(cdt, changer)).toBe('max(sysAddTime)  >  ?');
    expect(seen).toBe('max(sysAddTime)');
    expect(cdt.toSql(changer).toVal()).toEqual([1]);
  });

  it('操作符按原文写入', () => {
    let sql = sqlText(new NoteSafeCdt('note.title', 'aaa', 'like "%%" ## '));
    expect(sql).toContain('`note.title`');
    expect(sql).toContain('like "%%" ## ');
    expect(sql).toContain('?');
  });

  it('带空白的操作符不收成规范写法', () => {
    expect(sqlText(new NoteSafeCdt('age', 1, ' LIKE '))).toContain(' LIKE ');
  });

  it('没有 colChanger 时字段仍走 quoteField', () => {
    expect(sqlText(new NoteSafeCdt('max(sysAddTime)', 1, '>'))).toBe('`max(sysAddTime)`  >  ?');
  });

  it('普通字段与 Cdt 一致', () => {
    expect(sqlText(new NoteSafeCdt('age', 1, '>'))).toBe(sqlText(new Cdt('age', 1, '>')));
    expect(sqlText(new NoteSafeCdt('note.create_time', 1, '>='))).toBe('`note.create_time`  >=  ?');
  });

  it('空数组值仍返回 1=2', () => {
    expect(sqlText(new NoteSafeCdt('max(sysAddTime)', [], '>'))).toBe('1=2');
  });

  it('同样的输入 Cdt 会拒绝', () => {
    expect(() => new Cdt('max(sysAddTime)', 1, '>').toSql()).toThrow('Cdt字段不合法');
    expect(() => new Cdt('age', 1, 'like "%%" ## ').toSql()).toThrow('Cdt操作符不合法');
  });
});
