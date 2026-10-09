/**
 * Cdt.toSql 字段、操作符白名单。
 * 空数组值仍返回 1=2，不检查。isHit 不检查。
 */
import Cdt from '../../src/dao/query/cdt/imp/Cdt';
import IColChanger from '../../src/dao/colChanger/IColChanger';

function sqlText(cdt: Cdt, colChanger?: IColChanger): string {
  return cdt.toSql(colChanger).toSql().trim();
}

describe('Cdt.toSql', () => {
  it('允许普通字段和比较符', () => {
    let cdt = new Cdt('age', 1, '>');
    expect(sqlText(cdt)).toBe('`age`  >  ?');
    expect(cdt.toSql().toVal()).toEqual([1]);
  });

  it('允许表.字段和 like，值仍走占位符', () => {
    let cdt = new Cdt('note.title', '%_test%', 'like');
    expect(sqlText(cdt)).toBe('`note.title`  like  ?');
    expect(cdt.toSql().toVal()).toEqual(['%_test%']);
  });

  it('允许下划线字段', () => {
    expect(sqlText(new Cdt('note.create_time', 1, '>='))).toBe('`note.create_time`  >=  ?');
    expect(sqlText(new Cdt('note_item.warehouse_id', 1, '='))).toBe('`note_item.warehouse_id`  =  ?');
    expect(sqlText(new Cdt('note.is_del', 0))).toBe('`note.is_del`  =  ?');
  });

  it('允许多字段 in', () => {
    let cdt = new Cdt(['tableId', 'tableName'], [1, 'note']);
    expect(sqlText(cdt)).toBe('(`tableId`,`tableName`)  in  (?,?)');
    expect(cdt.toSql().toVal()).toEqual([1, 'note']);
  });

  it('操作符去掉空白并转成规范写法', () => {
    expect(sqlText(new Cdt('age', 1, ' LIKE '))).toBe('`age`  like  ?');
    expect(sqlText(new Cdt('age', [1], ' Not In '))).toBe('`age`  not in  (?)');
    expect(sqlText(new Cdt('age', 1, '<>'))).toBe('`age`  <>  ?');
  });

  it('空数组值仍返回 1=2，不检查字段和操作符', () => {
    expect(sqlText(new Cdt('1=1 or age', [], 'like "%%" ## '))).toBe('1=2');
  });

  it('isHit 不检查注入', () => {
    expect(new Cdt('1=1 or age', 1, '>').isHit({ age: 2 })).toBe(false);
    expect(new Cdt('age', 1, '>').isHit({ age: 2 })).toBe(true);
  });

  it('合法字段仍交给 colChanger', () => {
    let seen = '';
    let changer = {
      changeSql(sql: string) {
        seen = sql;
        return 'note.title';
      }
    } as IColChanger;
    expect(sqlText(new Cdt('note.title', 'aaa', 'like'), changer)).toBe('note.title  like  ?');
    expect(seen).toBe('note.title');
  });

  it('非法字段在 colChanger 之前报错', () => {
    let called = false;
    let changer:any = {
      changeSql() {
        called = true;
        return 'x';
      }
    };
    expect(() => new Cdt('max(sysAddTime)', 1, '>').toSql(changer)).toThrow('Cdt字段不合法');
    expect(called).toBe(false);
  });

  let badCols = [
    '1=1 or age',
    'max(sysAddTime)',
    "if(name='aa',0,1)",
    'count(*)',
    'age--',
    'age#',
    'age/*',
    'age;drop',
    "age'",
    '`age`',
    ' age',
    'note . title',
    'note.title\n',
    'a.b.c',
    'note.1title',
    'note.title;drop',
    '1age',
    ''
  ];

  for (let col of badCols) {
    it('拒绝字段 ' + JSON.stringify(col), () => {
      expect(() => new Cdt(col, 1, '>').toSql()).toThrow('Cdt字段不合法');
    });
  }

  it('拒绝数组中的非法字段', () => {
    expect(() => new Cdt(['tableId', '1=1 or age'], [1, 2]).toSql()).toThrow('Cdt字段不合法');
  });

  let badOps = [
    'like "%%" ## ',
    '= 1 or 1=1',
    'in) or 1=1 --',
    'like--',
    'like/*',
    ';',
    '',
    'not  in',
    'like\nor 1=1',
    '+',
    '*',
    ',',
    'regexp',
    'rlike'
  ];

  for (let op of badOps) {
    it('拒绝操作符 ' + JSON.stringify(op), () => {
      expect(() => new Cdt('age', 1, op).toSql()).toThrow('Cdt操作符不合法');
    });
  }
});
