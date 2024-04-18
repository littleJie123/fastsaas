import {
     snakeCase
} from 'lodash/fp'
import createHumps from './createHumps'
/**
 * 驼峰转下划线
 */
export default createHumps(snakeCase)