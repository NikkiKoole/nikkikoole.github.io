---
timestamp=1785168349
date='27 Jul 2026'
title='Pedalboard'
draft=true
thumb='../assets/images/pedalboard.png'
score=0.5
order=9
meta=true
metaDescription="A guitar you play through a pedalboard you build: drag stompboxes into the chain, drag them around to reorder, and hear the order change the tone. Bitcrush, tape, fuzz, wah, a talking vowel filter, amp and Leslie cabinets. Built as a single cart in dreamengine, playable in your browser."
metaImg='/assets/images/pedalboard.png'
metaUrl='https://mipolai.com/makes/pedalboard.html'
---


## Pedalboard

<video autoplay loop muted playsinline poster="../assets/images/pedalboard-poster.webp" style="width:640px;max-width:100%"><source src="../assets/images/pedalboard.mp4" type="video/mp4"></video>

An electric guitar you play, through a chain of stompboxes you build. The pedals sit in a row
along the top, left to right, and that row *is* the signal path: the order they sit in is the
order they run. So dragging the bitcrush in front of the EQ instead of behind it genuinely
changes the sound. Nothing is faked, you are rewiring the thing.

### Have a play

<iframe src="../play/pedalboard/?audio=plain" style="width:100%;max-width:720px;aspect-ratio:16/10;border:0;border-radius:6px;background:#000" allow="autoplay; fullscreen" title="Pedalboard, playable"></iframe>

*(Sound needs a tap first, since browsers block audio until you click. If it misbehaves in the
little frame, [open it fullscreen](../play/pedalboard/?audio=plain).)* It boots strumming itself,
so you can just start turning things on. Keys 1 to 9 stomp the footswitches by position, the
`Z X C V B N M` row walks up the neck, `A S D F G` picks the chord shape, space strums.

### Building the board

Tap **≡ PEDALS** and a tray of every effect slides up: bitcrush, EQ, chorus, phaser, flanger,
tape, tremolo, wah, filter, ring mod, delay, lo-fi, fuzz, grains, gate, shimmer, autopan, a
vowel filter. Then it's all dragging:

* drag a chip **up** into the row to add that pedal,
* drag a pedal sideways by its label to **reorder** it, and the sound reorders with it,
* drag one **down** out of the row to get rid of it.

Every pedal has its real knob row (drag a knob to dial it) and a footswitch to stomp. Run out of
room and the board keeps going off the edge with a scrollbar to pan along it, like a real
pedalboard that got out of hand.

The reverb and delay are proper dry/wet inserts rather than a send off to the side, which is the
whole reason their position is audible: put the reverb before the bitcrush and you crush the wet
tail, put it after and you reverb the crushed guitar. Two different, both correct, sounds.

The **OD** pedal has a VOICE knob that picks which famous dirt box it is being: raw, a Tube
Screamer with its mid hump, a RAT hard clipping into its filter, or a Big Muff fuzz with the
scooped mids. Same pedal, four different bad decisions available to you.

My favourite is the **vowel** pedal, a formant filter that makes the guitar talk. Its MOD knob
decides what moves the vowel: by hand, opened by each pick, a fresh vowel per pick so it reads as
a spoken syllable, or an LFO left to sweep on its own.

### The guitar half

Under the board is a real six string in standard tuning, not a keyboard pretending. The fretting
hand moves a moveable E shape up the neck (power, minor, major, sus4, dominant 7) and the
strumming hand sweeps across the body to strum, or taps a single string on the neck to pick it.
Mouse and touch both work, and every finger is its own pointer, so you can hold a chord, stomp a
switch and strum at once.

Past the pedals sits a pinned **cabinet**: none, a guitar amp with five voicings, or a rotating
Leslie speaker. And if you cannot be bothered building a board, the **RIGS** button loads a whole
setup at once: clean twang, jangle, crunch, hi gain, psych swirl, lo-fi broken cassette. Load one,
then wreck it.

### Where it came from

This one started as a test for an engine feature rather than as a toy. I wanted effects that could
be reordered at runtime, an honest serial insert chain instead of a fixed set of knobs, and the
only convincing way to prove it worked was to build something where you can *hear* yourself moving
a pedal. It turned into the cart I keep opening to noodle on. It is one file of C, and the whole
thing runs in the browser up there.
