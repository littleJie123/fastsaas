import DaoUtil from './../util/DaoUtil';

/**
 * 在上下文注册builder
 */


interface SysTimeOpt {
  addCol?: string
  updateCol?: string
  /**
   *   是否需要时区修正
   */
  needTimezone?: boolean;
}
export default function (opt?: SysTimeOpt) {
  let needTimezone: boolean = null;
  if (opt == null) {
    opt = { addCol: 'sysAddTime', updateCol: 'sysModifyTime' };
  } else {

    needTimezone = opt.needTimezone

  }
  return DaoUtil.createAddAndUpdate({
    addCol: opt.addCol,
    updateCol: opt.updateCol,
    processFun: function (dao: any) { 
      return new Date();
    }
  })
}

