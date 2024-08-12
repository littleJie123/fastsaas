import MySqlUtil from '../../src/util/MySqlUtil'; 
it('test mysql util',()=>{
  let sql = MySqlUtil.buildCaseSql('cost')
  sql.addCaseSql("type='normal' and cnt=1",'1'),
  sql.addNullCol("type'/*",'2/*')
  sql.addValSql('type',3,'4');
  sql.elseValue('5');
  console.log(sql.toSql())
})