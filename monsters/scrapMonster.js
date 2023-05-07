// language = 'fr'
// language = 'es'
// language = 'eng'
// c = document.querySelectorAll('#content > div')

// export const getDataMob = (element, size) => [...Array(size).keys()] .map((x,i) => Number(element.getAttribute(`data-rank-${i+1}`)))

// export const getNameAndIdFromSelectorA = (selector) => ({
//   name: {[language]: selector.textContent || undefined },
//   id: Number(selector.href.match(/\d+/g)[0]) || undefined
// })


// export const getLanguageName = (selector) => {
//   names = selector.querySelectorAll('.card-solo-monster-title a')
//   title = {[language]: names[0].textContent }
//   nameArchi = {[language]: names[1]?.textContent }
//   content = selector.querySelector('.card-solo-item-content-light')
//   column1 = content.querySelector('div:nth-child(1)')
//   idDofus = Number(column1.querySelector('.icon-vita').getAttribute('data-mobid'))
//   return {
//     idDofus,
//     name: title,
//     nameArchi,
//   }
// }


// if (language !== 'fr') {
//   infoMonstersLanguage = Array.from(c).map(getLanguageName)
// }

/*if (language === 'fr') {
  infoMonsters = Array.from(c).map(x => {
    names = x.querySelectorAll('.card-solo-monster-title a')
    title = {[language]: names[0].textContent }
    nameArchi = {[language]: names[1]?.textContent }
    idArchi = Number(names[1]?.href.match(/\d+/g)[0]) || undefined
    size = Array.from(x.querySelectorAll('.card-solo-monster-title')[1].querySelectorAll('div')).length - 1
    level = getDataMob(x.querySelectorAll('.card-solo-monster-title')[1].querySelector('div:last-child span'), size)
    content = x.querySelector('.card-solo-item-content-light')
    body = x.querySelector('.card-solo-monster-body')
  
    image = body.querySelector('.card-solo-monster-img img').src
    ecosystemInfo = body.querySelectorAll('div:nth-child(2) a')[0]
    ecosystem = {
      id: Number(ecosystemInfo.href.match(/\d+/g)[0]),
    }
    
    raceInfo = body.querySelectorAll('div:nth-child(2) a')[1]
    race = getNameAndIdFromSelectorA(raceInfo)
  
    column1 = content.querySelector('div:nth-child(1)')
    column2 = content.querySelector('div:nth-child(2)')
    column3 = content.querySelector('div:nth-child(3)')
    column4 = content.querySelector('div:nth-child(4)')
    idDofus = Number(column1.querySelector('.icon-vita').getAttribute('data-mobid'))
  
    life = getDataMob(column1.querySelector('.icon-vita'), size)
    pa = getDataMob(column1.querySelector('.icon-pa'), size)
    pm = getDataMob(column1.querySelector('.icon-pm'), size)
    xp = getDataMob(column1.querySelector('.icon-xp'), size)
    
    init = getDataMob(column2.querySelector('.icon-init'), size)
    strength = getDataMob(column2.querySelector('.icon-earthbonus'), size)
    fire = getDataMob(column2.querySelector('.icon-firebonus'), size)
    water = getDataMob(column2.querySelector('.icon-waterbonus'), size)
    wind = getDataMob(column2.querySelector('.icon-airbonus'), size)
  
    dodgeAp = getDataMob(column3.querySelector('.icon-pa span'), size)
    dodgeMp = getDataMob(column3.querySelector('.icon-pm span'), size)
    
    resistanceNeutral = getDataMob(column4.querySelector('.icon-neutral span'), size)
    resistanceStrength = getDataMob(column4.querySelector('.icon-earth span'), size)
    resistanceFire = getDataMob(column4.querySelector('.icon-fire span'), size)
    resistanceWater = getDataMob(column4.querySelector('.icon-water span'), size)
    resistanceWind = getDataMob(column4.querySelector('.icon-air span'), size)
    
    spells = Array.from(body.querySelectorAll('div')[15].querySelectorAll('a')).map(getNameAndIdFromSelectorA)
  
  
    subAreas = Array.from((body.querySelectorAll('div')[22]?.querySelectorAll('div a'))||[]).map(getNameAndIdFromSelectorA)
      
    loots = Array.from((body.querySelectorAll('div')[22]?.querySelectorAll('div a'))||[]).map(getNameAndIdFromSelectorA) 
  
    return {
      idDofus,
      numberOfLevel: size,
      name: title,
      nameArchi,
      idArchi,
      level,
      ecosystem,
      image,
      race,
      life,
      pa,
      pm,
      xp,
      init,
      strength,
      fire,
      water,
      wind,
      dodgeAp,
      dodgeMp,
      resistanceNeutral,
      resistanceStrength,
      resistanceFire,
      resistanceWater,
      resistanceWind,
      spells,
      subAreas,
      loots
    }
  
  })
}
*/

// export const getDataMob = (element, size) => [...Array(size).keys()].map((x, i) => {
//   return Number(element.getAttribute(`data-rank-${i + 1}`))
// })



export const getDataMob = async (element, size) => await Promise.all([...Array(size).keys()].map(async (x, i) => {
  return Number(await (element.evaluate((e, ii) => e.getAttribute(`data-rank-${ii + 1}`), i)))
})
)
export const getNameAndIdFromSelectorA = async (selector, language) => ({
  name: { [language]: await selector.evaluate(e => e.textContent.replace(/\s#\d+/, "")) || undefined },
  id: Number(await selector.evaluate(e => e.href.match(/\d+/g)[0])) || undefined
})


export const getLanguageName = async (selector, language) => {
  const names = await selector.$$('.card-solo-monster-title a')
  const title = { [language]: await names[0].evaluate(e => e.textContent) }
  const nameArchi = { [language]: await names[1]?.evaluate(e => e.textContent) }
  const content = await selector.$('.card-solo-item-content-light')
  const column1 = await content.$('div:nth-child(1)')
  const idDofus = Number(await column1.$eval('.icon-vita', e => e.getAttribute('data-mobid')))
  return {
    idDofus,
    name: title,
    nameArchi,
  }
}