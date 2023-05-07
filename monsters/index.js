import puppeteer from 'puppeteer';
import path from "path";
import fs from "fs";
import { getNameAndIdFromSelectorA, getDataMob, getLanguageName } from "./scrapMonster.js"
import mergeData from "./mergeData.js"


(async () => {
  let language = 'fr'
  const browser = await puppeteer.launch({ headless: true });
  const scriptUrl = new URL(import.meta.url);
  const dirPath = path.dirname(scriptUrl.pathname);
  const filePathFr = path.join(dirPath, './fr/Bestiaire - Solomonk.fr - FanSite Dofus Rétro.htm');
  const filePathEs = path.join(dirPath, './es/Bestiario - Solomonk.fr - FanSite Dofus Rétro.htm');
  const filePathEng = path.join(dirPath, './eng/Bestiary - Solomonk.fr - FanSite Dofus Rétro.htm');

  const pageFr = await browser.newPage();
  await pageFr.goto(`file://${filePathFr}`, { waitUntil: 'load', timeout: 0 });
  const infoMonsters = await Promise.all((await pageFr.$$('#content > div')).map(async (x) => {
    const names = await x.$$('.card-solo-monster-title a')
    const title = { [language]: await names[0].evaluate(x => x.textContent) }
    const nameArchi = { [language]: await names[1]?.evaluate(x => x.textContent) }
    const idArchiDofus = Number(await names[1]?.evaluate(x => x.href.match(/\d+/g)[0])) || undefined
    const size = Array.from(await (await x.$$('.card-solo-monster-title'))[1].$$('div')).length - 1
    const level = await getDataMob((await (await x.$$('.card-solo-monster-title'))[1].$('div:last-child span')), size)
    const content = await x.$('.card-solo-item-content-light')
    const body = await x.$('.card-solo-monster-body')

    const image = await body.$eval('.card-solo-monster-img img', e => e.src.match(/(?<=\/)[^/]+\.[^.]+$/i)[0])
    const ecosystemInfo = (await body.$$('div:nth-child(2) a'))[0]
    const ecosystem = {
      id: Number(await ecosystemInfo.evaluate(e => e.href.match(/\d+/g)[0])),
    }

    const raceInfo = (await body.$$('div:nth-child(2) a'))[1]
    const race = await getNameAndIdFromSelectorA(raceInfo, language)

    const column1 = await content.$('div:nth-child(1)')
    const column2 = await content.$('div:nth-child(2)')
    const column3 = await content.$('div:nth-child(3)')
    const column4 = await content.$('div:nth-child(4)')
    const idDofus = Number(await ((await column1.$('.icon-vita')).evaluate(e => e.getAttribute('data-mobid'))))

    const life = await getDataMob(await column1.$('.icon-vita'), size)
    const pa = await getDataMob(await column1.$('.icon-pa'), size)
    const pm = await getDataMob(await column1.$('.icon-pm'), size)
    const xp = await getDataMob(await column1.$('.icon-xp'), size)

    const init = await getDataMob(await column2.$('.icon-init'), size)
    const strength = await getDataMob(await column2.$('.icon-earthbonus'), size)
    const fire = await getDataMob(await column2.$('.icon-firebonus'), size)
    const water = await getDataMob(await column2.$('.icon-waterbonus'), size)
    const wind = await getDataMob(await column2.$('.icon-airbonus'), size)

    const dodgeAp = await getDataMob(await column3.$('.icon-pa span'), size)
    const dodgeMp = await getDataMob(await column3.$('.icon-pm span'), size)

    const resistanceNeutral = await getDataMob(await column4.$('.icon-neutral span'), size)
    const resistanceStrength = await getDataMob(await column4.$('.icon-earth span'), size)
    const resistanceFire = await getDataMob(await column4.$('.icon-fire span'), size)
    const resistanceWater = await getDataMob(await column4.$('.icon-water span'), size)
    const resistanceWind = await getDataMob(await column4.$('.icon-air span'), size)


    const elementSpells = (await body.$('div[data-collapse-target="bestiaryCollapseSpells"]'))
    let spells = []
    if (elementSpells) {
      spells = await Promise.all((await elementSpells.$$('a'))
        .map(e => getNameAndIdFromSelectorA(e, language))
      )
    }


    const elementSubAreas = (await body.$('div[data-collapse-target="bestiaryCollapseSubareas"]'))
    let subAreas = []
    if (elementSubAreas) {
      subAreas = await Promise.all((await elementSubAreas.$$('a'))
        .map(e => getNameAndIdFromSelectorA(e, language))
      )
    }

    const elementLoots = (await body.$('div[data-collapse-target="bestiaryCollapseDrops"]'))
    let loots = []
    if (elementLoots) {
      loots = await Promise.all((await elementLoots.$$('a'))
        .map(e => getNameAndIdFromSelectorA(e, language))
      )
    }



    return {
      idDofus,
      numberOfLevel: size,
      name: title,
      nameArchi,
      idArchiDofus,
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
  }))

  language = 'es'

  const pageEs = await browser.newPage();
  await pageEs.goto(`file://${filePathEs}`, { waitUntil: 'load', timeout: 0 });
  const infoMonstersEs = await Promise.all((await pageEs.$$('#content > div')).map(async (x) => await getLanguageName(x, language)))


  language = 'eng'

  const pageEng = await browser.newPage();
  await pageEng.goto(`file://${filePathEng}`, { waitUntil: 'load', timeout: 0 });
  const infoMonstersEng = await Promise.all((await pageEng.$$('#content > div')).map(async (x) => await getLanguageName(x, language)))


  const finalData = mergeData(infoMonsters, infoMonstersEs, infoMonstersEng)

  fs.writeFile('./monsters/monsters.json', JSON.stringify(finalData), function (err) {
    if (err) throw err;
    console.log('File is saved successfully!');
  });

  await browser.close();
})();