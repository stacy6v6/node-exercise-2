const csvjson = require('csvjson')
const fs = require('fs')
const yargs = require('yargs/yargs')(process.argv.slice(2)).argv

const data = fs.readFileSync('biostats.csv', 'utf8')
const options = {
  delimiter: ',',
  quote: '"',
}

const [, flag] = Object.keys(yargs)
const argLength = Object.keys(yargs).length
const csvData = csvjson.toObject(data, options)
yargs.name = yargs.name[0].toUpperCase() + yargs.name.slice(1).toLowerCase()
class BioStat {
  constructor(name, sex, age, height, weight) {
    this.name = name
    this.sex = sex
    this.age = age
    this.height = height
    this.weight = weight
  }
}

const create = (bioArr, createBio) => {
  if (createBio.name === undefined || createBio.sex === undefined || createBio.age === undefined
    || createBio.height === undefined || createBio.weight === undefined || argLength > 8
    || argLength < 4) {
    console.log('Invalid no. of arguments')
    process.exit(1)
  }
  for (let z = 0; z < bioArr.length; z += 1) {
    if (bioArr[z].name.toUpperCase() === createBio.name.toUpperCase()) {
      console.log('Bio data already exists')
      process.exit(1)
    }
    if (createBio.sex.toUpperCase() !== 'F' && createBio.sex.toUpperCase() !== 'M') {
      console.log('Invalid input for sex.')
      process.exit(1)
    }
    if (parseInt(createBio.age, 10) < 18
    || Number.isInteger(parseInt(createBio.age, 10)) === false
    || Number.isNaN(parseInt(createBio.age, 10)) === true) {
      console.log('Invalid age input!')
      process.exit(1)
    }
    if (Number.isInteger(parseInt(createBio.height, 10)) === false
    || Number.isNaN(parseInt(createBio.age, 10)) === true) {
      console.log('Invalid height input.')
      process.exit(1)
    }
    if (Number.isInteger(parseInt(createBio.weight, 10)) === false
    || Number.isNaN(parseInt(createBio.age, 10)) === true) {
      console.log('Invalid weight input.')
      process.exit(1)
    }
  }
  console.log('BEFORE CREATION: \n', csvData)
  bioArr.push(createBio)
  fs.writeFileSync('biostats.csv', csvjson.toCSV(bioArr, { headers: 'key', delimiter: ',\t\t\t\t\t' }))
  console.log('AFTER CREATION: \n', csvData)
}

const read = (bioArr, bioName) => {
  if (bioName === undefined || argLength > 4) {
    console.log('Invalid no. of arguments')
    process.exit(1)
  }
  let found = 0
  for (let z = 0; z < bioArr.length; z += 1) {
    if (bioArr[z].name.toUpperCase() === bioName.toUpperCase()) {
      found = 1
      console.log(bioArr[z])
    }
  }
  if (found === 0) {
    console.log('Bio data not found.')
    process.exit(1)
  }
}

const update = (bioArr, updateBio) => {
  let found = 0
  if (updateBio.name === undefined || updateBio.sex === undefined || updateBio.age === undefined
    || updateBio.height === undefined || updateBio.weight === undefined || argLength > 8
    || argLength < 4) {
    console.log('Invalid no. of arguments')
    process.exit(1)
  }
  for (let x = 0; x < bioArr.length; x += 1) {
    if (bioArr[x].name.toUpperCase() === updateBio.name.toUpperCase()) {
      found = 1
      if (updateBio.sex.toUpperCase() !== 'F' && updateBio.sex.toUpperCase() !== 'M') {
        console.log('Invalid input for sex.')
        process.exit(1)
      }
      if (parseInt(updateBio.age, 10) < 18
      || Number.isNaN(parseInt(updateBio.age, 10)) === true
      || Number.isInteger(parseInt(updateBio.age, 10)) === false) {
        console.log('Invalid age input!')
        process.exit(1)
      }
      if (Number.isInteger(parseInt(updateBio.height, 10)) === false
      || Number.isNaN(parseInt(updateBio.age, 10)) === true) {
        console.log('Invalid height input.')
        process.exit(1)
      }
      if (Number.isInteger(parseInt(updateBio.weight, 10)) === false
      || Number.isNaN(parseInt(updateBio.age, 10)) === true) {
        console.log('Invalid weight input.')
        process.exit(1)
      }
      console.log('BEFORE UPDATE: \n', csvData)
      const updateData = bioArr
      updateData[x] = updateBio
      fs.writeFileSync('biostats.csv', csvjson.toCSV(updateData, { headers: 'key', delimiter: ',\t\t\t\t\t' }))
      console.log('AFTER UPDATE: \n', csvData)
    }
  }
  if (found === 0) {
    console.log('Bio data not found.')
  }
}

const del = (bioArr, bioName) => {
  if (bioName === undefined || argLength > 4) {
    console.log('Invalid no. of arguments')
    process.exit(1)
  }
  let found = 0
  for (let z = 0; z < bioArr.length; z += 1) {
    if (bioArr[z].name.toUpperCase() === bioName.toUpperCase()) {
      found = 1
      console.log('BEFORE DELETION: \n', csvData)
      bioArr.splice(z, 1)
      fs.writeFileSync('biostats.csv', csvjson.toCSV(bioArr, { headers: 'key', delimiter: ',\t\t\t\t\t' }))
      console.log('AFTER DELETION: \n', csvData)
    }
  }
  if (found === 0) {
    console.log('Bio data not found.')
    process.exit(1)
  }
}

switch (flag.toLowerCase()) {
  case 'c':
    create(
      csvData,
      new BioStat(yargs.name, yargs.sex.toUpperCase(), yargs.age, yargs.height, yargs.weight),
    )
    break
  case 'r':
    read(csvData, yargs.name)
    break
  case 'u':
    update(
      csvData,
      new BioStat(yargs.name, yargs.sex.toUpperCase(), yargs.age, yargs.height, yargs.weight),
    )
    break
  case 'd':
    del(csvData, yargs.name)
    break
  default:
    console.log('Invalid argument. Please input -c, -r, -u, or -d.')
}
