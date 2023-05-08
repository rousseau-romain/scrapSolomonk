export const getDataMob = async (element, size) => await Promise.all([...Array(size).keys()].map(async (x, i) => {
  return Number(await (element.evaluate((e, ii) => e.getAttribute(`data-rank-${ii + 1}`), i)))
})
)
export const getNameAndIdFromSelectorA = async (selector, language) => ({
  name: { [language]: await selector.evaluate(e => e.textContent.replace(/\s#\d+/, "")) || undefined },
  idDofus: Number(await selector.evaluate(e => e.href.match(/\d+/g)[0])) || undefined
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