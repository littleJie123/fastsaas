import Importor from "../../src/import/Importor";
import ImportorObj from "../../src/import/dto/ImportorObj";
it('testChange', async () => {

  let ret: ImportorObj = {};
  let importor = new Importor({ key: 'name' })
  importor.change({ name: 0 }, ret);
  console.log(ret)
})