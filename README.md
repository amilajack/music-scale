# music-scale

The aim of this library is to give programmatically access to all the possible
scales in western music.

Sources of knowledge:
- [LucyTune scales](http://www.lucytune.com/scales/)
- [Walter Zettel blog](http://www.muzuu.org/new_life/pics/simpleblog/scales/scalesadvice.html)
- [allthescales.org](http://www.allthescales.org/)
- [Quora: How many music scales are there?](http://www.quora.com/How-many-music-scales-are-there)

Library usage example:

```
var Scale = require('music-scale');
var major = new Scale('major');
major.intervals(); // => ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7']
```

`music-scales` is implemented using binary numbers. Inspired by [Rich Cochrane](http://cochranemusic.com) and Phil O'Donnell


## Usage

#### Installation

Install with npm: `npm install music-scale` and require it:

```
var Scale = require('music-scale')
```

#### Create scales

You can create scales with a name, a binary string or its decimal equivalent (read the theory below). To create a major scale:

```
new Scale('major')
new Scale('101011010101')
new Scale(2772)
```

#### Scale names

Just 3 ('major', 'minor melodic', 'minor harminic'). A bigger dictionary is in process.

#### Scale intervals

All scales have a `intervals()` method that returns an array of intervals.

```
var major = new Scale(2772)
major.intervals() // => ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7']
```

If you need note names, I recommend (ejem, my own library) [note-pitch](http://github.com/danigb/note-pitch):

```
var Note = require('note-pitch')
Note.transpose('C', major.intervals()) //=> ['c4', 'd4', 'e4', 'f4', 'g4', 'a4', 'b4']
```

#### Modes

```
major = new Scale(2772)
ionian = major.mode(1) // same scale
dorian = major.mode(2)
mixolydian = major.mode(5)
```

#### Coscale relationship

```
var majorPentatonic = new Scale(2772).coscale()
majorPentatonic.binary // => '101001010100'
```

#### Scale reflection

```
var major = new Scale(2772)
var lydian = major.reflection()
```

## Theory

This is a implementation of binary scales as presented in the awesome book [Arpeggio & Scale Resources](https://archive.org/details/ScaleAndArpeggioResourcesAGuitarEncyclopedia) by Rich Cochrane, chapter 18.

The following explanations are extracted from the book. (The book has a Creative Commons Usage Attribution-Noncommercial-No Derivative Works 3.0... thanks a lot Rich!)

### Binary representations of scales

The major scale is `1 0 1 0 1 1 0 1 0 1 0 1`. This number (2773 in decimal, see previous example) uniquely represents the Major scale. The method of representation is simple: each position, reading left to right, represents a note: 1, b2, 2 and so on. A `1` in that position means the note is included in the scale and a `0` means it is not included. So we have:

```
1   0   1   0   1   1    0   1   0   1   0   1
1  b2   2  b3   3   4   b5   5  b6   6  b7   7
```

### Scale modes

Note that modes of a scale are obtained by the technique known as 'bit rotation'. We would normally eliminate all those rows that begin with a zero, since they don't contain a root note:

```
101011010101 // ionian
010110101011
101101010110 // dorian
011010101101
110101011010 // phrygian
101010110101 // lydian
010101101011
101011010110 // mixolydian
010110101101
101101011010 // aeolian
011010110101
110101101010 // locrian
```
