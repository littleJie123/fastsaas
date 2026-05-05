import Importor from "../../src/import/Importor";

describe('Importor.isEmpty', () => {
  it('should return false for 0', () => {
    const importor = new Importor({ key: 'test' });
    const result = (importor as any).isEmpty(0);
    expect(result).toBe(false);
  });

  it('should return true for null', () => {
    const importor = new Importor({ key: 'test' });
    const result = (importor as any).isEmpty(null);
    expect(result).toBe(true);
  });

  it('should return true for undefined', () => {
    const importor = new Importor({ key: 'test' });
    const result = (importor as any).isEmpty(undefined);
    expect(result).toBe(true);
  });

  it('should return true for empty string', () => {
    const importor = new Importor({ key: 'test' });
    const result = (importor as any).isEmpty('');
    expect(result).toBe(true);
  });

  it('should return true for whitespace string', () => {
    const importor = new Importor({ key: 'test' });
    const result = (importor as any).isEmpty('   ');
    expect(result).toBe(true);
  });

  it('should return false for non-empty string', () => {
    const importor = new Importor({ key: 'test' });
    const result = (importor as any).isEmpty('hello');
    expect(result).toBe(false);
  });
});
