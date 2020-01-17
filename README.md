# Mixxx-Pioneer-DDJ-SB3
Mixxx  controller mappings for the Pioneer DDJ SB3

These files are based on the DDJ-SB2 files that are part of the Mixxx distribution: https://github.com/mixxxdj/mixxx/tree/master/res/controllers

## Midi Message Lists
* Midi Message List for the SB3 (PDF): https://www.pioneerdj.com/-/media/pioneerdj/software-info/controller/ddj-sb3/ddj-sb3_midi_message_list_e1.pdf
* Midi Message List for the SB2 (PDF), for comparison against SB3: http://faq.pioneerdj.com/files/img/DDJ-SB2_List_of_MIDI_Messages_E.pdf

## Running the Tests
1. Install Node
1. Install Yarn
1. Install Jest
1. run yarn test

## Feature Matrix
Here we try and list what is working and what isn't

| Feature        | Deck 1 | Deck 2 | Deck 3 | Deck 4 |
|----------------|--------|--------|--------|--------|
| Play / Pause   | Yes    | Yes    | Yes    | Yes    |
| Cue            | Yes    | Yes    | Yes    | Yes    |
| Key Lock       | Yes    | Yes    | Yes    | Yes    |
| Sync           | Yes    | Yes    | Yes    | Yes    |
| FX1 / FX2      | Yes    | Yes    | Yes    | Yes    |
| Perfomance Pad | Yes    | Yes    | Yes    | Yes    |

### Performance PAD

| HotCue | FxFade | Scratch | Sample |
|--------|--------|---------|--------|
| Pad 1  | Pad 2  | Pad 3   | Pad 4  |
| Pad 5  | Pad 6  | Pad 7   | Pad 8  |


#### Hot-Cue (Hot-Cue Mode Button)

- Pressing a HotCue if its not set will set it to the current position.
- If Pressed and the HotCue is set it will Jump to the HotCue position.
- Shift+HotCue will unset the HotCue.
- Buttons assigned to a HotCue light up.

#### BeatJump (Shift + HotCue Mode Button)

| PAD | Function                                                           |
|-----|--------------------------------------------------------------------|
| 1   | While pressed continuously jumps backard on beat                   |
| 2   | Jumps backard 1 beat                                               |
| 3   | Jumps forward 1 beat                                               |
| 4   | While pressed continuously jumps forward on beat                   |
| 5   | Jumps to beginning of track                                        |
| 6   | Jumps backard 4 beat                                               |
| 7   | Jumps forward 4 beat                                               |
| 8   | No function                                                        |

#### FX-Fade (FX-Fade Mode Button)

| PAD | Function                                                           |
|-----|--------------------------------------------------------------------|
| 1   | Fade out using the SuperKnob                                       |
| 2   | Fade out using the SuperKnob                                       |
| 3   | Fade out Looping with size 4 and reduzing the loopsize over time   |
| 4   | No function                                                        |
| 5   | Fade out using the SuperKnob                                       |
| 6   | Fade out using the SuperKnob                                       |
| 7   | Fade out Looping with size 1                                       |
| 8   | No function                                                        |

##### All FX-Fade Buttons

- Disabling an active FX Fade sends the value of the Fader and the SuperEffect Knob, reseting them to their original values.

#### Scratch (Scratch Mode Button)

- While pressed the track is scratched useing a HotCue (default 1). It will set the HotCue to the current Position and resets it afterwords
- Shift while in Scratch mode allows to select HotCue 1-4 for scatching (Pad 1-4). Only HotCue 1 is implemented properly. Pad 5 can also be enabled and disabled but does nothing yet.

#### Sampler (Sampler Mode Button)

- Plays samples associated with the sampler slot
- Pad lights up while sample is playes
- When pressed while sample is played the sample is stopped
- TBD: Shift + Pad should unload/load sample, freeing the Trans Pad

#### Trans (Shift + Sampler Mode Button)

- Loads selected Track in sampler
- Shift + Pad unloads the sample
