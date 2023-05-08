import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import monsters from './monsters.json' assert { type: "json" }


const idDofusNotPresent = (arr1, arr2) => {
  return arr2.filter(value => arr1.findIndex(x => x.idDofus === value.idDofus) === -1);
}

const uploadMonster = async monster => {
  const {
    idDofus,
    numberOfLevel,
    name,
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
  } = monster

  let monsterPrisma = await prisma.monster.findFirst({
    where: {
      idDofus: monster.idDofus
    }
  })
  if (monsterPrisma) {
    console.log('@@@@@@@@@@@@@@@@@@@already here@@@@@@@@@@@@@@@@@@@')
    return monsterPrisma
  }

  let ecosystemPrisma = await prisma.ecosystem.findFirst({
    where: {
      idDofus: ecosystem.idDofus
    }
  })
  let racePrisma = await prisma.race.findFirst({
    where: {
      idDofus: race.idDofus
    }
  })
  let spellPrisma = await prisma.spell.findMany({
    where: {
      idDofus: { in: spells.map(x => x.idDofus) }
    }
  })
  let subAreaPrisma = await prisma.subArea.findMany({
    where: {
      idDofus: { in: subAreas.map(x => x.idDofus) }
    }
  })
  let lootPrisma = await prisma.loot.findMany({
    where: {
      idDofus: { in: loots.map(x => x.idDofus) }
    }
  })

  if (!ecosystemPrisma) {
    ecosystemPrisma = await prisma.ecosystem.create({
      data: ecosystem
    })
  }

  if (!racePrisma) {
    racePrisma = await prisma.race.create({
      data: {
        idDofus: race.idDofus,
        name: {
          create: race.name
        }
      }
    })
  }

  const spellsNew = idDofusNotPresent(spellPrisma, spells)
  if (spellsNew) {
    const spellGenereated = await Promise.all(spellsNew.map(async x => {
      return await prisma.spell.create({
        data: {
          idDofus: x.idDofus,
          name: {
            create: x.name
          }
        }
      })
    }))
    spellPrisma = [...spellPrisma, ...spellGenereated]
  }

  const subAreasNew = idDofusNotPresent(subAreaPrisma, subAreas)
  if (subAreasNew) {
    const subAreaGenereated = await Promise.all(subAreasNew.map(async x => {
      return await prisma.subArea.create({
        data: {
          idDofus: x.idDofus,
          name: {
            create: x.name
          }
        }
      })
    }))
    subAreaPrisma = [...subAreaPrisma, ...subAreaGenereated]
  }

  const lootsNew = idDofusNotPresent(lootPrisma, loots)
  if (lootsNew) {
    const lootGenereated = await Promise.all(lootsNew.map(async x => {
      return await prisma.loot.create({
        data: {
          idDofus: x.idDofus,
          name: {
            create: x.name
          }
        }
      })
    }))
    lootPrisma = [...lootPrisma, ...lootGenereated]
  }

  const newMonster = await prisma.monster.create({
    data: {
      idDofus,
      numberOfLevel,
      name: {
        create: name
      },
      level,
      ecosystem: {
        connect: { id: ecosystemPrisma.id }
      },
      image,
      race: {
        connect: {
          id: racePrisma.id
        }
      },
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
      spells: {
        connect: spellPrisma.map(x => ({ id: x.id }))
      },
      subAreas: {
        connect: subAreaPrisma.map(x => ({ id: x.id }))
      },
      loots: {
        connect: lootPrisma.map(x => ({ id: x.id }))
      },
      ... (idArchiDofus ? { idArchiDofus } : {}),
      ... (Object.keys(nameArchi).length > 0 ? { nameArchi: { create: nameArchi } } : {}),
    }
  })

  console.log('************newMonster.id************')
  console.log(newMonster.id)
  console.log('************newMonster.id************')

  return newMonster
}

for (let index = 0; index < 120; index++) {
  const element = monsters[index];
  const response = await uploadMonster(element)
}