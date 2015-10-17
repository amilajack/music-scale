var vows = require('vows')
var assert = require('assert')
var scale = require('../scale')

vows.describe('scale').addBatch({
  'build scale from intervals': function () {
    assert.deepEqual(scale('1 2 3 4', 'C'), ['C', 'D', 'E', 'F'])
  },
  'build scale from notes': function () {
    assert.deepEqual(scale('C2 D E4 F G A B', 'D5'), ['D5', 'E5', 'F#5', 'G5', 'A5', 'B5', 'C#6'])
    assert.deepEqual(scale('D E F G A B C', 'C'), [ 'C', 'D', 'Eb', 'F', 'G', 'A', 'Bb' ])
  },
  'partial scale': function () {
    var major = scale('1 3 5')
    assert.deepEqual(major('D'), ['D', 'F#', 'A'])
    var lydian = scale('C D E F# G A B')
    assert.deepEqual(lydian('A'), ['A', 'B', 'C#', 'D#', 'E', 'F#', 'G#'])
    var aeolian = scale('A B C D E F G')
    assert.deepEqual(aeolian('Eb'), [ 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'Cb', 'Db' ])
  }
}).export(module)
