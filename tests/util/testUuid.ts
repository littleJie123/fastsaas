import UuidUtil from '../../src/util/UuidUtil';

it('最大公约数和最小公倍数', () => {
  console.log(UuidUtil.getUuid());
  console.time('uuid')
  for (let i = 0; i < 1000; i++) {
    UuidUtil.getUuid();
  }


  console.timeEnd('uuid')
});