const csvjson = require('csvjson')
const fs = require('fs')
const yargs = require('yargs/yargs')(process.argv.slice(2)).argv

class BioStat {
  constructor(name, sex, age, height, weight) {
    this.name = name[0].toUpperCase() + yargs.name.slice(1).toLowerCase()
    this.sex = sex
    this.age = Number(age)
    this.height = Number(height)
    this.weight = Number(weight)
  }

  isValidName() {
    return typeof this.name === 'string' && this.name !== undefined
  }

  isValidSex() {
    return typeof this.sex.toUpperCase() === 'string' && this.sex.toUpperCase()
    && this.sex.length === 1
    && 'MF'.includes(this.sex.toUpperCase())
  }

  isValidAge() {
    return !Number.isNaN(this.age) && this.age >= 18
  }

  isValidHeight() {
    return !Number.isNaN(this.height) && this.height > 0
  }

  isValidWeight() {
    return typeof this.weight === 'number'
  }
}

const csvFile = './biostats.csv'
const data = fs.readFileSync(csvFile, 'utf8')
const options = {
  delimiter: ',',
  quote: '"',
}

const [, flag] = Object.keys(yargs)
const argLength = Object.keys(yargs).length
const csvData = csvjson.toObject(data, options)
const bioMap = new Map(csvData.map((object) => [object.name.toUpperCase(), object]))

const isValidCreateUpdateParams = () => {
  if (yargs.name === undefined || yargs.sex === undefined || yargs.age === undefined
    || yargs.height === undefined || yargs.weight === undefined || argLength > 8) {
    console.log('Invalid no. of arguments')
    process.exit()
  }
}

const isValidDeleteReadParams = () => {
  if (yargs.name === undefined || argLength > 4) {
    console.log('Invalid no. of arguments')
    process.exit()
  }
}

const verify = (bioData) => {
  if (bioData.isValidSex() === false) {
    console.log('Invalid input for sex.')
    process.exit(1)
  }
  if (bioData.isValidAge() === false) {
    console.log('Invalid age input!')
    process.exit(1)
  }
  if (bioData.isValidHeight() === false) {
    console.log('Invalid height input.')
    process.exit(1)
  }
  if (bioData.isValidWeight() === false) {
    console.log('Invalid weight input.')
    process.exit(1)
  }
}

const writeNewFile = (csvPath, newData) => {
  try {
    fs.writeFileSync(csvPath, csvjson.toCSV(Array.from(newData.values()), { headers: 'key', delimiter: ',\t\t\t\t\t' }))
    return true
  } catch (error) {
    return false
  }
}
const createBioStat = (map, createBio) => {
  if (map.has(createBio.name.toUpperCase())) {
    console.log('Bio data already exists')
    process.exit(1)
  }
  verify(createBio)
  map.set(createBio.name.toUpperCase(), createBio)
  writeNewFile(csvFile, map)
}

const readBioStat = (map, bioName) => {
  if (bioName === undefined || argLength > 4) {
    console.log('Invalid no. of arguments')
    process.exit(1)
  }
  if (map.has(bioName.toUpperCase())) {
    const readData = map.get(bioName.toUpperCase())
    console.log(`
    ++++++++++++++ BIO DATA ++++++++++++++

    · Name: ${readData.name}
    · Sex: ${readData.sex === 'M' ? 'Male' : 'Female'}
    · Age: ${readData.age} years old
    · Height: ${readData.height} in ${readData.height * 2.54} cm
    · Weight: ${readData.weight} lbs ${(readData.weight / 2.205).toFixed(2)} kilos

    ++++++++++++++++++++++++++++++++++++++
    `)
  }
}

const updateBioStat = (map, updateBio) => {
  if (!map.has(updateBio.name.toUpperCase())) {
    console.log('Bio data not found')
    process.exit(1)
  }
  verify(updateBio)
  const existingData = map.set(updateBio.name.toUpperCase(), updateBio)
  writeNewFile(csvFile, existingData)
}

const deleteBioStat = (map, bioName) => {
  if (!map.has(bioName.toUpperCase())) {
    console.log('Bio data not found')
    process.exit(1)
  }
  map.delete(bioName.toUpperCase())
  writeNewFile(csvFile, map)
}

switch (flag) {
  case 'c':
  {
    isValidCreateUpdateParams()
    createBioStat(
      bioMap,
      new BioStat(yargs.name, yargs.sex.toUpperCase(), yargs.age, yargs.height, yargs.weight),
    )
    break
  }
  case 'r':
  {
    isValidDeleteReadParams()
    readBioStat(bioMap, yargs.name)
    break
  }
  case 'u':
  {
    isValidCreateUpdateParams()
    updateBioStat(
      bioMap,
      new BioStat(yargs.name, yargs.sex.toUpperCase(), yargs.age, yargs.height, yargs.weight),
    )
    break
  }
  case 'd':
  {
    isValidDeleteReadParams()
    deleteBioStat(bioMap, yargs.name)
    break
  }
  default:
    console.log('Invalid argument. Please input -c, -r, -u, or -d. The flag is case-sensitive.')
    console.log(flag)
}
