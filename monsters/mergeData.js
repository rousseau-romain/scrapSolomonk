

const mergeData = (jsonFr, jsonEs, jsonEng) => {
  const globlalJson = jsonFr
  const keysJsonEs = Object.keys(jsonEs)
  const keysJsonEng = Object.keys(jsonEng)
  Object.keys(jsonFr).forEach(x => {
    if (typeof globlalJson[x] === 'object' && keysJsonEs.includes(x)) {
      globlalJson[x]['es'] = jsonEs[x]['es']
    }
  })
  Object.keys(jsonFr).forEach(x => {
    if (typeof globlalJson[x] === 'object' && keysJsonEng.includes(x)) {
      globlalJson[x]['eng'] = jsonEng[x]['eng']
    }
  })
  return globlalJson

}


export default (arrayObjectFr, arrayObjectEs, arrayObjectEng) => {
  return arrayObjectFr.map(x => {
    const jsonEs = arrayObjectEs.find(es => es.idDofus === x.idDofus)
    const jsonEng = arrayObjectEng.find(eng => eng.idDofus === x.idDofus)
    if (jsonEs && jsonEng) {
      return mergeData(x, jsonEs, jsonEng)
    } else {
      console.log(`This item can't be merged: ${JSON.stringify(x)}`);
    }
  })

}