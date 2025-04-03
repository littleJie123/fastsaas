import Hat from "./Hat"

export default class PojoHat extends Hat{
  protected _processData(data, hatData) {
    let dataCol = this.acqDataCol()
	  data[this._opt.key] = {
      [dataCol]:hatData[dataCol],
      name:hatData.name
    }
	}
}