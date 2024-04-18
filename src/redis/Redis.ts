
import ConfigFac from './../config/ConfigFac';
import IoRedis from 'ioredis'


var get = function ():any {
      var redisConfig = ConfigFac.get('redis');
      
      if(redisConfig == null || redisConfig.host == null){
            return null;
      }
      var db = 0;
      if(redisConfig.db != null)
            db = redisConfig.db;
      let opt = {
            host: redisConfig.host,
            port: redisConfig.port,
            password: redisConfig.password,
            db,
            maxRetriesPerRequest: 0
            
      }
      if(redisConfig.tls){
            opt['tls'] = {}
      }
      return new IoRedis(opt)
}
export default {get}

