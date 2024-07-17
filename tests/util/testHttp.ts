import HttpUtil from '../../src/http/HttpUtil';
it('testhttp',async ()=>{
  let res = await HttpUtil.post('http://35.86.105.120:8080/api/xplugin',
    {
      "classes": [
          "friendly",
          "malicious",
          "neutral"
      ],
      "comments": [
          {
              "1111": "you are a bad man"
          },
          {
              "2a22": "i like you"
          }
      ]
    }
  )
  console.log(res);
})