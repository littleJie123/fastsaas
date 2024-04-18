/**
 * 为属性指定bean
 */

export default function(beanId?:string) {
    return function(target: any, propertyName: string) {
        
       BeanConfig.addProperty(target,propertyName,beanId)
    }
}
import BeanConfig from '../bean/BeanConfig'
