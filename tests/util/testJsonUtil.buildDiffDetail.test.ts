import JsonUtil from '../../src/util/JsonUtil';

describe('JsonUtil.buildDiffDetail', () => {
  it('should return empty string when objects are identical', async () => {
    const obj1 = { name: 'test', age: 10 };
    const obj2 = { name: 'test', age: 10 };
    const opt = {
      names: {
        name: '姓名',
        age: '年龄'
      }
    };
    const result = await JsonUtil.buildDiffDetail(obj1, obj2, opt);
    expect(result).toBe('');
  });

  it('should return difference for simple fields', async () => {
    const obj1 = { name: 'test1', age: 10 };
    const obj2 = { name: 'test2', age: 20 };
    const opt = {
      names: {
        name: '姓名',
        age: '年龄'
      }
    };
    const result = await JsonUtil.buildDiffDetail(obj1, obj2, opt);
    // Note: details.join('') uses empty string as separator, so "姓名:test2年龄:20"
    expect(result).toBe('姓名:test2年龄:20');
  });

  it('should handle nested fields using dot notation', async () => {
    const obj1 = { person: { name: 'test1', info: { age: 10 } } };
    const obj2 = { person: { name: 'test2', info: { age: 20 } } };
    const opt = {
      names: {
        'person.name': '姓名',
        'person.info.age': '年龄'
      }
    };
    const result = await JsonUtil.buildDiffDetail(obj1, obj2, opt);
    expect(result).toBe('姓名:test2年龄:20');
  });

  it('should use custom diff and getStr from opt.values', async () => {
    const obj1 = { status: 1 };
    const obj2 = { status: 2 };
    const opt = {
      names: {
        status: '状态'
      },
      values: {
        status: {
          diff: (v1: any, v2: any) => v1 !== v2,
          getStr: (v2: any) => v2 === 1 ? '启用' : '禁用'
        }
      }
    };
    const result = await JsonUtil.buildDiffDetail(obj1, obj2, opt);
    expect(result).toBe('状态:禁用');
  });

  it('should handle null or undefined values', async () => {
    const obj1 = { name: 'test' };
    const obj2 = { name: null };
    const opt = {
      names: {
        name: '姓名'
      }
    };
    const result = await JsonUtil.buildDiffDetail(obj1, obj2, opt);
    expect(result).toBe('姓名:');
  });

  it('should handle missing fields in one object', async () => {
    const obj1 = { age: 10 };
    const obj2 = { name: 'test', age: 10 };
    const opt = {
      names: {
        name: '姓名',
        age: '年龄'
      }
    };
    const result = await JsonUtil.buildDiffDetail(obj1, obj2, opt);
    expect(result).toBe('姓名:test');
  });

  it('should handle $toArray operator in key names', async () => {
    const obj1 = { items: [{ id: 1 }, { id: 2 }] };
    const obj2 = { items: [{ id: 1 }, { id: 3 }] };
    const opt = {
      names: {
        'items.$toArray|id': '项目ID'
      }
    };
    const result = await JsonUtil.buildDiffDetail(obj1, obj2, opt);
    // [1, 2] vs [1, 3] -> different. 
    // getStr([1, 3]) -> "1,3" (assuming default toString for array)
    expect(result).toBe('项目ID:1,3');
  });
});
