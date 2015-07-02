'use strict'

module.exports = Scale

/*
 * rotates a string of 12 characters length (a scale binary number)
 */
function rotate (str, positions) {
  return str.slice(positions, 12) + str.slice(0, positions)
}

/*
 * cache the return value inside the Object
 * only for no arguments functions
 */
function memoize (name, func) {
  name = '__' + name
  return function () {
    return this[name] ? this[name] : this[name] = func.apply(this, arguments)
  }
}

function lengthOf (o) { return o.length }

function Scale (num, name) {
  if (!(this instanceof Scale)) return new Scale(num)

  if (/^[01]+$/.test(num)) {
    this.binary = num
    this.decimal = parseInt(num, 2)
  } else if (/^\d+$/.test(num)) {
    this.decimal = +num
    this.binary = this.decimal.toString(2)
  } else {
    throw Error('Invalid scale number: ' + num)
  }
  this.length = this.binary.match(/1/g).length
  if (name) this.name = name

  if (this.binary.length !== 12) {
    throw Error('Scale binary (' + this.binary + ') must have 12 digits: ' + this.binary.length)
  }
  if (this.binary.charAt(0) !== '1') {
    throw Error('Scale should have root: ' + this.binary + ' (' + num + ')')
  }
}

/*
 * Steps: the number of semitones required for each degree (step)
 * For example, the major scale is 2,2,1,2,2,2,1 — starting on any given
 * note (the first "degree"), the second degree is 2 semitones above the first,
 * the third is 2 semitones above the second, the fourth is 1 semitone above
 * the third, and so on.
 *
 * @return an array of semitones for each step
 *
 * @example Scale(2773).steps() // => [2, 2, 1, 2, 2, 2, 1]
 */
var STEPS = /1(0)*/g
Scale.prototype.steps = memoize('steps', function () {
  return (this.binary.match(STEPS)).map(lengthOf)
})

/*
 * leap
 *
 * Useful to limit the number of scales: "The requirement of no step greater
 * than a major third is somewhat arbitrary, but does allow us to include
 * commonly used scales like the Pentatonic" - William Zeitler
 *
 * @returns the maximum number of semitones between two notes of the scale
 */
Scale.prototype.leap = function () {
  return (this.binary.match(STEPS)).reduce(function (num, zeros) {
    return Math.max(num, zeros.length)
  }, 0)
}

var NUMBERS = ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7']
Scale.prototype.numbers = memoize('numbers', function () {
  return this.binary.split('')
    .map(function (digit, index) {
      return digit === '1' ? NUMBERS[index] : null
    })
    .filter(function (n) { return n })
})

Scale.fromNumbers = function (array) {
  var numbers = array.map(function (i) {
    return i.toString()
  })
  var binary = NUMBERS.map(function (num) {
    return numbers.indexOf(num) >= 0 ? '1' : '0'
  }).join('')
  return new Scale(binary)
}

var INTERVALS = ['P1', 'm2', 'M2', 'm3', 'M3', 'P4',
  'd5', 'P5', 'm6', 'M6', 'm7', 'M7']
Scale.prototype.intervals = memoize('intervals', function () {
  var intervals = this.binary.split('').map(function (digit, index) {
    return digit === '1' ? INTERVALS[index] : null
  })
  specialCase(intervals, 8, 'm6', 9, 'M6', 'A5')
  specialCase(intervals, 6, 'd5', 7, 'P5', 'A4')
  specialCase(intervals, 6, 'd5', 8, 'A5', 'A4')
  // specialCase(intervals, 6, 'd5', 8, 'm6', 'A4', 'A5')
  return intervals.filter(function (i) { return i })
})

function specialCase (intervals, a, aVal, b, bVal, aSus, bSus) {
  if (intervals[a] === aVal && intervals[b] === bVal) {
    if (aSus) intervals[a] = aSus
    if (bSus) intervals[b] = bSus
  }
}

Scale.prototype.modes = memoize('modes', function () {
  var modes = []
  for (var i = 0; i < 12; i++) {
    modes.push(rotate(this.binary, i))
  }
  return modes.filter(function (binary) {
    return binary.charAt(0) === '1'
  }).map(function (binary) {
    return new Scale(binary)
  })
})

Scale.prototype.cannonicalMode = memoize('cannonical', function () {
  var ordered = this.modes().sort(function (scaleA, scaleB) {
    var stepsA = +scaleA.steps().join('')
    var stepsB = +scaleB.steps().join('')
    return stepsA - stepsB
  })
  return ordered[ordered.length - 1]
})

Scale.prototype.mode = function (num) {
  var count = this.modes().length
  return this.modes()[(num - 1) % count]
}

/*
 */
Scale.prototype.isModeOf = function (other) {
  var binary = other.binary ? other.binary : other
  return binary.length === this.binary.length &&
    (binary + binary).indexOf(this.binary) !== -1
}

Scale.prototype.reflection = function () {
  return new Scale(this.binary.split('').reverse().join(''))
}

Scale.prototype.coscale = function () {
  var inv = this.binary.replace(/0/g, 'L').replace(/1/g, '0').replace(/L/g, 1)
  return new Scale(rotate(inv, inv.indexOf('1')))
}
