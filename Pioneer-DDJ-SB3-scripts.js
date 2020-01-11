var PioneerDDJSB3 = {};

///////////////////////////////////////////////////////////////
//                       USER OPTIONS                        //
///////////////////////////////////////////////////////////////

// If true, vinyl mode will be enabled when Mixxx starts.
PioneerDDJSB3.vinylModeOnStartup = false;

// If true, the vinyl button activates slip. Vinyl mode is then activated by using shift.
// Allows toggling slip faster, but is counterintuitive.
PioneerDDJSB3.invertVinylSlipButton = false;

// If true, pressing shift + cue will play the track in reverse and enable slip mode,
// which can be used like a censor effect. If false, pressing shift + cue jumps to
// the beginning of the track and stops playback.
PioneerDDJSB3.reverseRollOnShiftCue = false;

// Sets the jogwheels sensivity. 1 is default, 2 is twice as sensitive, 0.5 is half as sensitive.
PioneerDDJSB3.jogwheelSensivity = 1.0;

// Sets how much more sensitive the jogwheels get when holding shift.
// Set to 1 to disable jogwheel sensitivity increase when holding shift.
PioneerDDJSB3.jogwheelShiftMultiplier = 100;

// Time per step (in ms) for pitch speed fade to normal
PioneerDDJSB3.speedRateToNormalTime = 200;

// If true Level-Meter shows VU-Master left & right. If false shows level of active deck.
PioneerDDJSB3.showVumeterMaster = false;

// If true VU-Level twinkle if AutoDJ is ON.
PioneerDDJSB3.twinkleVumeterAutodjOn = true;

// Delta Position to move in the track preview with the browser knob. 0.1 is jump in 10% steps
PioneerDDJSB3.deltaPreviewPosition = 0.1;

/*
    Pioneer DDJ-SB3 mapping for Mixxx
    Copyright (c) 2019 Enby Moa (moa.ziegler@posteo.net, licensed under PGL version 2 or later
    Copyright (c) 2019 Dancephy LLC (javier@dancephy.com), licensed under GPL version 3 or later
    Copyright (c) 2017 Be (be.0@gmx.com), licensed under GPL version 2 or later
    Copyright (c) 2014-2015 various contributors, licensed under MIT license

    Contributors and change log:
    - Emby Moa: Pioneer DDJ-SB3 updated mapping and added full functionality
      https://github.com/nbmoa/Mixxx-Pioneer-DDJ-SB3
    - Be (be.0@gmx.com): update effects and autoloop mode for Mixxx 2.1, fix level meter scaling,
      remove LED flickering when pressing shift, start porting to Components
    - Michael Stahl (DG3NEC): original DDJ-SB2 mapping for Mixxx 2.0
    - Joan Ardiaca Jové (joan.ardiaca@gmail.com): Pioneer DDJ-SB mapping for Mixxx 2.0
    - wingcom (wwingcomm@gmail.com): start of Pioneer DDJ-SB mapping
      https://github.com/wingcom/Mixxx-Pioneer-DDJ-SB
    - Hilton Rudham: Pioneer DDJ-SR mapping
      https://github.com/hrudham/Mixxx-Pioneer-DDJ-SR

    GPL license notice for current version:
    This program is free software; you can redistribute it and/or modify it under the terms of the
    GNU General Public License as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
    without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See
    the GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along with this program; if
    not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.


    MIT License for earlier versions:
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software
    and associated documentation files (the "Software"), to deal in the Software without
    restriction, including without limitation the rights to use, copy, modify, merge, publish,
    distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or
    substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
    BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

    TODO:
      - bug when touching jog wheel for first time in vinyl mode
*/



///////////////////////////////////////////////////////////////
//               INIT, SHUTDOWN & GLOBAL HELPER              //
///////////////////////////////////////////////////////////////
PioneerDDJSB3.longButtonPress = false;
PioneerDDJSB3.speedRateToNormalTimer = new Array(4);

PioneerDDJSB3.init = function (id) {
    // setup variables variables
    PioneerDDJSB3.scratchSettings = {
        'alpha': 1.0 / 8,
        'beta': 1.0 / 8 / 32,
        'jogResolution': 720,
        'vinylSpeed': 33 + 1 / 3,
        'safeScratchTimeout': 20
    };

    PioneerDDJSB3.channelGroups = {
        '[Channel1]': 0x00,
        '[Channel2]': 0x01,
        '[Channel3]': 0x02,
        '[Channel4]': 0x03
    };

    PioneerDDJSB3.samplerGroups = {
        '[Sampler1]': 0x00,
        '[Sampler2]': 0x01,
        '[Sampler3]': 0x02,
        '[Sampler4]': 0x03,
        '[Sampler5]': 0x04,
        '[Sampler6]': 0x05,
        '[Sampler7]': 0x06,
        '[Sampler8]': 0x07,
    };

    PioneerDDJSB3.shiftPressed = false;

    PioneerDDJSB3.chFaderStart = [
        null,
        null
    ];

    PioneerDDJSB3.scratchMode = [false, false, false, false];

    PioneerDDJSB3.ledGroups = {
        'hotCue': 0x00,
        'fxFade': 0x10,
        'padScratch': 0x20,
        'sampler': 0x30,
        'beatJump': 0x40,
        'roll': 0x50,
        'slicer': 0x60,
        'trans': 0x70
    };
    printObject("MOA1-2")

    PioneerDDJSB3.nonPadLeds = {
        'headphoneCue': 0x54,
        'shiftHeadphoneCue': 0x68,
        'cue': 0x0C,
        'shiftCue': 0x48,
        'keyLock': 0x1A,
        'shiftKeyLock': 0x60,
        'play': 0x0B,
        'shiftPlay': 0x47,
        'vinyl': 0x17,
        'shiftVinyl': 0x40,
        'sync': 0x58,
        'shiftSync': 0x5C,
        'loop': 0x14
    };

    PioneerDDJSB3.valueVuMeter = {
        '[Channel1]_current': 0,
        '[Channel2]_current': 0,
        '[Channel3]_current': 0,
        '[Channel4]_current': 0,
        '[Channel1]_enabled': 1,
        '[Channel2]_enabled': 1,
        '[Channel3]_enabled': 1,
        '[Channel4]_enabled': 1,

    };
    
    PioneerDDJSB3.deckSwitchTable = {
        '[Channel1]': '[Channel1]',
        '[Channel2]': '[Channel2]',
        '[Channel3]': '[Channel3]',
        '[Channel4]': '[Channel4]'
    
    };
    
    PioneerDDJSB3.deckShiftSwitchTable = {
        '[Channel1]': '[Channel3]',
        '[Channel2]': '[Channel4]',
        '[Channel3]': '[Channel1]',
        '[Channel4]': '[Channel2]'
    };

    // Create the deck elements
    PioneerDDJSB3.deck = [];
    PioneerDDJSB3.deck[1] = new PioneerDDJSB3.Deck(1);
    PioneerDDJSB3.deck[2] = new PioneerDDJSB3.Deck(2);
    PioneerDDJSB3.deck[3] = new PioneerDDJSB3.Deck(3);
    PioneerDDJSB3.deck[4] = new PioneerDDJSB3.Deck(4);

    // Create the effect elements
    PioneerDDJSB3.effectUnit = [];
    PioneerDDJSB3.effectUnit[1] = new PioneerDDJSB3.EffectUnit(1);
    PioneerDDJSB3.effectUnit[2] = new PioneerDDJSB3.EffectUnit(2);
    printObject("MOA1-5")

    // Bind Controlls
    PioneerDDJSB3.initNonDeckConnections(false);
    PioneerDDJSB3.initDeckConnections('[Channel1]');
    PioneerDDJSB3.initDeckConnections('[Channel2]');
    PioneerDDJSB3.initDeckConnections('[Channel3]');
    PioneerDDJSB3.initDeckConnections('[Channel4]');

    if (PioneerDDJSB3.twinkleVumeterAutodjOn) {
        PioneerDDJSB3.vu_meter_timer = engine.beginTimer(100, "PioneerDDJSB3.vuMeterTwinkle()");
    }
    printObject("MOA1-6")

    // init deck to enable all 4 decks, there is a bug that if the soundcard of the DDJ Controller is not used, the controller behaves strange and switching to deck 3 and 4 doesn't work 
    var sysex = [ 0xf0, 0x00, 0x20, 0x7f, 0x03, 0x01, 0xf7 ];
    midi.sendSysexMsg(sysex, sysex.length);
};

PioneerDDJSB3.shutdown = function () {
    // turn off button LEDs
    var skip = [0x72, 0x1B, 0x69, 0x1E, 0x6B, 0x20, 0x6D, 0x22, 0x6F, 0x70, 0x75];
    for (var channel = 0; channel <= 10; channel++) {
        for (var control = 0; control <= 127; control++) {
            // skip deck toggle buttons and pad mode buttons
            if (skip.indexOf(control) > -1) {
                continue;
            }
            midi.sendShortMsg(0x90 + channel, control, 0);
        }
    }


    // switch to decks 1 and 2 to turn off deck indication lights
    midi.sendShortMsg(0x90, 0x72, 0x7f);
    midi.sendShortMsg(0x91, 0x72, 0x7f);

    // turn off level meters
    for (channel = 0; channel <= 3; channel++) {
        midi.sendShortMsg(0xB0 + channel, 2, 0);
    }
};

///////////////////////////////////////////////////////////////
//                      CONTROL BINDING                      //
///////////////////////////////////////////////////////////////

PioneerDDJSB3.initNonDeckConnections = function (isUnbinding) {
    var samplerIndex,
        samplerControlsToFunctions = {
            'play': 'PioneerDDJSB3.samplerLeds',
        };

    printObject("MOA2-1")
    for (samplerIndex = 1; samplerIndex <= 8; samplerIndex++) {
    printObject("MOA2-1-" + samplerIndex)
        script.bindConnections('[Sampler'+samplerIndex+']', samplerControlsToFunctions, isUnbinding);
    }

    printObject("MOA2-2")

    if (PioneerDDJSB3.showVumeterMaster) {
        engine.connectControl('[Master]', 'VuMeterL', 'PioneerDDJSB3.VuMeterLeds', isUnbinding);
        engine.connectControl('[Master]', 'VuMeterR', 'PioneerDDJSB3.VuMeterLeds', isUnbinding);
    } else {
        engine.connectControl('[Channel1]', 'VuMeter', 'PioneerDDJSB3.VuMeterLeds', isUnbinding);
        engine.connectControl('[Channel2]', 'VuMeter', 'PioneerDDJSB3.VuMeterLeds', isUnbinding);
        engine.connectControl('[Channel3]', 'VuMeter', 'PioneerDDJSB3.VuMeterLeds', isUnbinding);
        engine.connectControl('[Channel4]', 'VuMeter', 'PioneerDDJSB3.VuMeterLeds', isUnbinding);
    }
};

PioneerDDJSB3.initDeckConnections = function (channelGroup, isUnbinding) {
    var i,
        index,
        controlsToFunctions = {
            'pfl': 'PioneerDDJSB3.headphoneCueLed',
            'keylock': 'PioneerDDJSB3.keyLockLed',
            //'filterLowKill': 'PioneerDDJSB3.lowKillLed',
            //'filterMidKill': 'PioneerDDJSB3.midKillLed',
            //'filterHighKill': 'PioneerDDJSB3.highKillLed',
            //'mute': 'PioneerDDJSB3.muteLed',
            'loop_enabled': 'PioneerDDJSB3.loopLed',
//            'beat_active': 'PioneerDDJSB3.bpmLed',
        };

    if (PioneerDDJSB3.invertVinylSlipButton) {
        controlsToFunctions.slip_enabled = 'PioneerDDJSB3.slipLed';
    }

    printObject("MOAe-1")
    for (i = 1; i <= 8; i++) {
        controlsToFunctions['hotcue_' + i + '_enabled'] = 'PioneerDDJSB3.hotCueLeds';
    }

    printObject("MOAe-2")
    script.bindConnections(channelGroup, controlsToFunctions, isUnbinding);
    printObject("MOAe-3")
    
    PioneerDDJSB3.nonPadLedControl(channelGroup, PioneerDDJSB3.nonPadLeds.shiftKeyLock, PioneerDDJSB3.channelGroups[channelGroup] > 1);
    PioneerDDJSB3.toggleScratch(null, null, PioneerDDJSB3.vinylModeOnStartup, null, channelGroup);
    printObject("MOAe-4")
};

//PioneerDDJSB3.initAllConnections = function (isUnbinding) {
//    var samplerIndex,
//        channelIndex;
//
////    for (samplerIndex = 1; samplerIndex <= 8; samplerIndex++) {
////        PioneerDDJSB3.bindSamplerControlConnections('[Sampler' + samplerIndex + ']', isUnbinding);
////    }
//
//    for (channelIndex = 1; channelIndex <= 2; channelIndex++) {
//        PioneerDDJSB3.bindDeckControlConnections('[Channel' + channelIndex + ']', isUnbinding);
//    }
//};

///////////////////////////////////////////////////////////////
//                      DECK DEFINITION                      //
///////////////////////////////////////////////////////////////

PioneerDDJSB3.Deck = function (deckNumber) {
    var theDeck = this;
    this.group = '[Channel' + deckNumber + ']';

    // MOA TBD Is this needed?
    this.scratchModeSave = false
    printObject("MOA1-d-1")
    this.shiftButton = function (channel, control, value, status, group) {
        if (value > 0) {
            theDeck.shift();
            PioneerDDJSB3.shiftPressed = true;
            PioneerDDJSB3.chFaderStart[deckNumber] = null;
        } else {
            theDeck.unshift();
            PioneerDDJSB3.shiftPressed = false;
        }
    };
    printObject("MOA1-d-2")
    
    this.playButton = new components.PlayButton({
        midi: [0x90 + deckNumber - 1, 0x0B],
        shiftOffset: 60,
        shiftControl: true,
        sendShifted: true,
    });
    printObject("MOA1-d-3")

    this.cueButton = new components.CueButton({
        midi: [0x90 + deckNumber - 1, 0x0C],
        shiftOffset: 60,
        shiftControl: true,
        sendShifted: true,
        reverseRollOnShift: PioneerDDJSB3.reverseRollOnShiftCue,
    });
    printObject("MOA1-d-4")

    this.syncButton = new components.SyncButton({
        midi: [0x90 + deckNumber - 1, 0x58],
        shiftOffset: 4,
        shiftControl: true,
        sendShifted: true,
    });
    printObject("MOA1-d-6")

    this.loopButton = function (channel, control, value, status, group) {
        printObject('MOA loopButton: channel ' + channel+', group '+ group)
        if (value) {
            if (engine.getValue(group, "loop_enabled")) {
              engine.setValue(group, "reloop_toggle", 1);
            } else {
              engine.setValue(group, "beatloop_activate", 1);
            }
        }
    };
    this.reLoopButton = function (channel, control, value, status, group) {
        printObject('MOA reLoopButton: channel ' + channel+', group '+ group)
        if (value) {
            engine.setValue(group, "reloop_toggle", 1);
        }
    };
    this.doubleLoopButton = function (channel, control, value, status, group) {
        printObject('MOA doubleButton: channel ' + channel+', group '+ group)
        if (value) {
            engine.setValue(group, "loop_double", 1);
        }
    };
    this.halveLoopButton = function (channel, control, value, status, group) {
        printObject('MOA halveButton: channel ' + channel+', group '+ group)
        if (value) {
            engine.setValue(group, "loop_halve", 1);
        }
    };
    this.inLoopButton = function (channel, control, value, status, group) {
        if (value) {
            if (engine.getValue(group, "loop_enabled")) {
              engine.setValue(group, "loop_move", -1);
            } else {
              engine.setValue(group, "loop_in", 1);
            }
        }
    };
    this.outLoopButton = function (channel, control, value, status, group) {
        if (value) {
            if (engine.getValue(group, "loop_enabled")) {
              engine.setValue(group, "loop_move", 1);
            } else {
              engine.setValue(group, "loop_out", 1);
            }
        }
    };

    // Needed for shift pot assignment
    var effectUnitNumber = deckNumber;
    if (deckNumber > 2) {
        effectUnitNumber -= 2;
    }
    printObject("MOA1-d-8")
    
    this.gainKnob = new components.Pot({
        unshift: function () {
            this.group = '[Channel' + deckNumber + ']';
            this.inKey = 'pregain';
            this.disconnect();
            this.connect();
        },
        shift: function () {
            var focusedEffect = engine.getValue('[EffectRack1_EffectUnit' + effectUnitNumber + ']', 'focused_effect');
            this.group = '[EffectRack1_EffectUnit' + effectUnitNumber + '_Effect' + focusedEffect + ']';
            this.inKey = 'parameter1';
            this.disconnect();
            this.connect();
        },
    });

    this.eqKnob = [];
    for (var k = 1; k <= 3; k++) {
        this.eqKnob[k] = new components.Pot({
            number: k,
            unshift: function () {
                this.group = '[EqualizerRack1_[Channel' + deckNumber + ']_Effect1]';
                this.inKey = 'parameter' + this.number;
                this.disconnect();
                this.connect();
            },
            shift: function () {
                var focusedEffect = engine.getValue('[EffectRack1_EffectUnit' + effectUnitNumber + ']', 'focused_effect');
                this.group = '[EffectRack1_EffectUnit' + effectUnitNumber + '_Effect' + focusedEffect + ']';
                this.inKey = 'parameter' + (5 - this.number);
                this.disconnect();
                this.connect();
            },
        });
    }

    this.quickEffectKnob = new components.Pot({
        unshift: function () {
            this.group = '[QuickEffectRack1_[Channel' + deckNumber + ']]';
            this.inKey = 'super1';
            this.disconnect();
            this.connect();
        },
        shift: function () {
            var focusedEffect = engine.getValue('[EffectRack1_EffectUnit' + effectUnitNumber + ']', 'focused_effect');
            this.group = '[EffectRack1_EffectUnit' + effectUnitNumber + '_Effect' + focusedEffect + ']';
            this.inKey = 'parameter5';
            this.disconnect();
            this.connect();
        },
    });

    this.tempoFader = new components.Pot({
        inKey: 'rate',
        //         relative: true,
        invert: true,
    });

    this.forEachComponent(function (c) {
        if (c.group === undefined) {
            c.group = theDeck.group;
            c.connect();
            c.trigger();
        }
    });
};
PioneerDDJSB3.Deck.prototype = components.ComponentContainer.prototype;


// MOA TBD isn't used at the moment
PioneerDDJSB3.longButtonPressWait = function () {
    engine.stopTimer(PioneerDDJSB3.longButtonPressTimer);
    PioneerDDJSB3.longButtonPress = true;
};

// MOA ????
PioneerDDJSB3.speedRateToNormal = function (group, deck) {
    var speed = engine.getValue(group, 'rate');
    if (speed > 0) {
        engine.setValue(group, 'rate_perm_down_small', true);
        if (engine.getValue(group, 'rate') <= 0) {
            engine.stopTimer(PioneerDDJSB3.speedRateToNormalTimer[deck]);
            engine.setValue(group, 'rate', 0);
        }
    } else if (speed < 0) {
        engine.setValue(group, 'rate_perm_up_small', true);
        if (engine.getValue(group, 'rate') >= 0) {
            engine.stopTimer(PioneerDDJSB3.speedRateToNormalTimer[deck]);
            engine.setValue(group, 'rate', 0);
        }
    }
};

// MOA DONE
///////////////////////////////////////////////////////////////
//                      VU - Meter                           //
///////////////////////////////////////////////////////////////

PioneerDDJSB3.blinkAutodjState = 0; // new for DDJ-SB2

PioneerDDJSB3.vuMeterTwinkle = function () {
    if (engine.getValue("[AutoDJ]", "enabled")) {
        PioneerDDJSB3.blinkAutodjState = PioneerDDJSB3.blinkAutodjState + 1;
        if (PioneerDDJSB3.blinkAutodjState > 3) {
            PioneerDDJSB3.blinkAutodjState = 0;
        }
        if (PioneerDDJSB3.blinkAutodjState === 0) {
            PioneerDDJSB3.valueVuMeter['[Channel1]_enabled'] = 0;
            PioneerDDJSB3.valueVuMeter['[Channel3]_enabled'] = 0;
            PioneerDDJSB3.valueVuMeter['[Channel2]_enabled'] = 0;
            PioneerDDJSB3.valueVuMeter['[Channel4]_enabled'] = 0;
        }
        if (PioneerDDJSB3.blinkAutodjState === 1) {
            PioneerDDJSB3.valueVuMeter['[Channel1]_enabled'] = 1;
            PioneerDDJSB3.valueVuMeter['[Channel3]_enabled'] = 1;
            PioneerDDJSB3.valueVuMeter['[Channel2]_enabled'] = 0;
            PioneerDDJSB3.valueVuMeter['[Channel4]_enabled'] = 0;
        }
        if (PioneerDDJSB3.blinkAutodjState === 2) {
            PioneerDDJSB3.valueVuMeter['[Channel1]_enabled'] = 1;
            PioneerDDJSB3.valueVuMeter['[Channel3]_enabled'] = 1;
            PioneerDDJSB3.valueVuMeter['[Channel2]_enabled'] = 1;
            PioneerDDJSB3.valueVuMeter['[Channel4]_enabled'] = 1;
        }
        if (PioneerDDJSB3.blinkAutodjState === 3) {
            PioneerDDJSB3.valueVuMeter['[Channel1]_enabled'] = 0;
            PioneerDDJSB3.valueVuMeter['[Channel3]_enabled'] = 0;
            PioneerDDJSB3.valueVuMeter['[Channel2]_enabled'] = 1;
            PioneerDDJSB3.valueVuMeter['[Channel4]_enabled'] = 1;
        }
    } else {
        PioneerDDJSB3.valueVuMeter['[Channel1]_enabled'] = 1;
        PioneerDDJSB3.valueVuMeter['[Channel3]_enabled'] = 1;
        PioneerDDJSB3.valueVuMeter['[Channel2]_enabled'] = 1;
        PioneerDDJSB3.valueVuMeter['[Channel4]_enabled'] = 1;
    }
};

// MOA DONE
///////////////////////////////////////////////////////////////
//                        AutoDJ                             //
///////////////////////////////////////////////////////////////

PioneerDDJSB3.autodjSkipNext = function (channel, control, value, status, group) {
    if (value === 0) {
        return;
    }
    if (engine.getValue("[AutoDJ]", "enabled")) {
        engine.setValue("[AutoDJ]", "skip_next", true);
    }
};

PioneerDDJSB3.autodjToggle = function (channel, control, value, status, group) {
    if (value === 0) {
        return;
    }
    if (engine.getValue("[AutoDJ]", "enabled")) {
        engine.setValue("[AutoDJ]", "enabled", false);
    } else {
        engine.setValue("[AutoDJ]", "enabled", true);
    }
};


// MOA DONE
///////////////////////////////////////////////////////////////
//                       DECK SWITCHING                      //
///////////////////////////////////////////////////////////////

PioneerDDJSB3.highResMSB = {
    '[Channel1]': {},
    '[Channel2]': {},
    '[Channel3]': {},
    '[Channel4]': {}
};

PioneerDDJSB3.deckFaderMSB = function (channel, control, value, status, group) {
    PioneerDDJSB3.highResMSB[group].deckFader = value;
};

PioneerDDJSB3.deckFaderLSB = function (channel, control, value, status, group) {
    var fullValue = (PioneerDDJSB3.highResMSB[group].deckFader << 7) + value;

    if (PioneerDDJSB3.shiftPressed &&
        engine.getValue(group, 'volume') === 0 &&
        fullValue !== 0 &&
        engine.getValue(group, 'play') === 0
    ) {
        PioneerDDJSB3.chFaderStart[channel] = engine.getValue(group, 'playposition');
        engine.setValue(group, 'play', 1);
    } else if (
        PioneerDDJSB3.shiftPressed &&
        engine.getValue(group, 'volume') !== 0 &&
        fullValue === 0 &&
        engine.getValue(group, 'play') === 1 &&
        PioneerDDJSB3.chFaderStart[channel] !== null
    ) {
        engine.setValue(group, 'play', 0);
        engine.setValue(group, 'playposition', PioneerDDJSB3.chFaderStart[channel]);
        PioneerDDJSB3.chFaderStart[channel] = null;
    }
    engine.setValue(group, 'volume', fullValue / 0x3FFF);
};

// MOA Working
///////////////////////////////////////////////////////////////
//           SINGLE MESSAGE MIDI INPUT HANDLERS              //
///////////////////////////////////////////////////////////////

PioneerDDJSB3.shiftButton = function (channel, control, value, status, group) {
    var index = 0;
    PioneerDDJSB3.shiftPressed = (value == 0x7F);
    for (index in PioneerDDJSB3.chFaderStart) {
        PioneerDDJSB3.chFaderStart[index] = null;
    }
};

//PioneerDDJSB3.playButton = function (channel, control, value, status, group) {
//    printObject("playButton")
//    if (value) {
//        script.toggleControl(PioneerDDJSB3.deckSwitchTable[group], 'play');
//    }
//};

PioneerDDJSB3.headphoneCueButton = function (channel, control, value, status, group) {
    if (value) {
        script.toggleControl(group, 'pfl');
    }
};

PioneerDDJSB3.headphoneShiftCueButton = function (channel, control, value, status, group) {
    if (value) {
        script.toggleControl(PioneerDDJSB3.deckShiftSwitchTable[group], 'pfl');
    }
};

PioneerDDJSB3.masterCueButton = function (channel, control, value, status, group) {
    if (value) {
//        script.toggleControl(group, 'pfl');
    }
};

//PioneerDDJSB3.cueButton = function (channel, control, value, status, group) {
//    engine.setValue(PioneerDDJSB3.deckSwitchTable[group], 'cue_default', value);
//};

//PioneerDDJSB3.beatloopRollButtons = function (channel, control, value, status, group) {
//    var index = (control <= 0x53 ? control - 0x50 : control - 0x54);
//    engine.setValue(
//        PioneerDDJSB3.deckSwitchTable[group],
//        'beatlooproll_' + PioneerDDJSB3.looprollIntervals[index] + '_activate',
//        value
//    );
//};

PioneerDDJSB3.vinylButton = function (channel, control, value, status, group) {
    if (PioneerDDJSB3.invertVinylSlipButton) {
        engine.setValue(group, 'slip_enabled', value / 127);
    } else {
        PioneerDDJSB3.toggleScratch(channel, control, value, status, group);
    }
};

PioneerDDJSB3.slipButton = function (channel, control, value, status, group) {
    if (PioneerDDJSB3.invertVinylSlipButton) {
        PioneerDDJSB3.toggleScratch(channel, control, value, status, group);
    } else {
        engine.setValue(group, 'slip_enabled', value / 127);
    }
};

PioneerDDJSB3.keyLockButton = function (channel, control, value, status, group) {
    if (value) {
        script.toggleControl(group, 'keylock');
    }
};

PioneerDDJSB3.shiftKeyLockButton = function (channel, control, value, status, group) {
    var deck = status - 0x90;
    if (value) {
        engine.stopTimer(PioneerDDJSB3.speedRateToNormalTimer[deck]);
        PioneerDDJSB3.speedRateToNormalTimer[deck] = engine.beginTimer(PioneerDDJSB3.speedRateToNormalTime, "PioneerDDJSB3.speedRateToNormal('" + group + "', " + deck + ")");
    }
};

PioneerDDJSB3.deckSwitch = function (channel, control, value, status, group) {
    printObject("deckSwitch: " + "channel=" + channel + ", control=" + control + ", value=" + value + ", status=" + status + ", control=" + group);
    if (value) {
    }
};

//PioneerDDJSB3.loopInButton = function (channel, control, value, status, group) {
//    engine.setValue(PioneerDDJSB3.deckSwitchTable[group], 'loop_in', value ? 1 : 0);
//};
//
//PioneerDDJSB3.loopOutButton = function (channel, control, value, status, group) {
//    engine.setValue(PioneerDDJSB3.deckSwitchTable[group], 'loop_out', value ? 1 : 0);
//};
//
//PioneerDDJSB3.loopExitButton = function (channel, control, value, status, group) {
//    if (value) {
//        engine.setValue(PioneerDDJSB3.deckSwitchTable[group], 'reloop_exit', 1);
//    }
//};
//
//PioneerDDJSB3.loopHalveButton = function (channel, control, value, status, group) {
//    if (value) {
//        engine.setValue(PioneerDDJSB3.deckSwitchTable[group], 'loop_scale', 0.5);
//    }
//};
//
//PioneerDDJSB3.loopDoubleButton = function (channel, control, value, status, group) {
//    if (value) {
//        engine.setValue(PioneerDDJSB3.deckSwitchTable[group], 'loop_scale', 2.0);
//    }
//};
//
//PioneerDDJSB3.loopMoveBackButton = function (channel, control, value, status, group) {
//    if (value) {
//        engine.setValue(PioneerDDJSB3.deckSwitchTable[group], 'loop_move', -1);
//    }
//};
//
//PioneerDDJSB3.loopMoveForwardButton = function (channel, control, value, status, group) {
//    if (value) {
//        engine.setValue(PioneerDDJSB3.deckSwitchTable[group], 'loop_move', 1);
//    }
//};

PioneerDDJSB3.loadButton = function (channel, control, value, status, group) {
    if (value) {
        engine.setValue(group, 'LoadSelectedTrack', 1);
    }
};

//PioneerDDJSB3.reverseRollButton = function (channel, control, value, status, group) {
//    engine.setValue(PioneerDDJSB3.deckSwitchTable[group], 'reverseroll', value);
//};
//
//PioneerDDJSB3.lowKillButton = function (channel, control, value, status, group) {
//    engine.setValue(PioneerDDJSB3.deckSwitchTable[group], 'filterLowKill', value ? 1 : 0);
//};
//
//PioneerDDJSB3.midKillButton = function (channel, control, value, status, group) {
//    engine.setValue(PioneerDDJSB3.deckSwitchTable[group], 'filterMidKill', value ? 1 : 0);
//};
//
//PioneerDDJSB3.highKillButton = function (channel, control, value, status, group) {
//    engine.setValue(PioneerDDJSB3.deckSwitchTable[group], 'filterHighKill', value ? 1 : 0);
//};
//
//PioneerDDJSB3.muteButton = function (channel, control, value, status, group) {
//    engine.setValue(PioneerDDJSB3.deckSwitchTable[group], 'mute', value);
//};

///////////////////////////////////////////////////////////////
//                          LED HELPERS                      //
///////////////////////////////////////////////////////////////

PioneerDDJSB3.deckConverter = function (group) {
    var index;

    if (typeof group === "string") {
        for (index in PioneerDDJSB3.deckSwitchTable) {
            if (group === PioneerDDJSB3.deckSwitchTable[index]) {
                return PioneerDDJSB3.channelGroups[group];
            }
        }
        return null;
    }
    return group;
};

PioneerDDJSB3.padLedControl = function (deck, groupNumber, ledNumber, shift, active) {
    var padLedsBaseChannel = 0x97,
        padLedControl = (shift ? 0x08 : 0x00) + groupNumber + ledNumber,
        midiChannelOffset = PioneerDDJSB3.deckConverter(deck);

    if (midiChannelOffset !== null) {
      printObject('msg: ' + (padLedsBaseChannel + midiChannelOffset) + ', ' + padLedControl + ', ' + (active ? 0x7F : 0x00) )
        midi.sendShortMsg(
            padLedsBaseChannel + midiChannelOffset,
            padLedControl,
            active ? 0x7F : 0x00
        );
    }
};

PioneerDDJSB3.nonPadLedControl = function (deck, ledNumber, active) {
    var nonPadLedsBaseChannel = 0x90,
        midiChannelOffset = PioneerDDJSB3.deckConverter(deck);

    if (midiChannelOffset !== null) {
        midi.sendShortMsg(
            nonPadLedsBaseChannel + midiChannelOffset,
            ledNumber,
            active ? 0x7F : 0x00
        );
    }
};

///////////////////////////////////////////////////////////////
//                             LEDS                          //
///////////////////////////////////////////////////////////////

PioneerDDJSB3.headphoneCueLed = function (value, group, control) {
    printObject("headphoneCueLed: " + "control=" + control + ", value=" + value + ", group=" + group);
    PioneerDDJSB3.nonPadLedControl(group, PioneerDDJSB3.nonPadLeds.headphoneCue, value);
    // MOA TBD why does this not work ???
    PioneerDDJSB3.nonPadLedControl(PioneerDDJSB3.deckShiftSwitchTable[group], PioneerDDJSB3.nonPadLeds.shiftHeadphoneCue, value);
};

PioneerDDJSB3.keyLockLed = function (value, group, control) {
    PioneerDDJSB3.nonPadLedControl(group, PioneerDDJSB3.nonPadLeds.keyLock, value);
    // MOA TBD why does this not work ???
    PioneerDDJSB3.nonPadLedControl(group, PioneerDDJSB3.nonPadLeds.shiftKeyLock, value);
};

PioneerDDJSB3.slipLed = function (value, group, control) {
    PioneerDDJSB3.nonPadLedControl(group, PioneerDDJSB3.nonPadLeds.vinyl, value);
    // MOA TBD why does this not work ???
    PioneerDDJSB3.nonPadLedControl(group, PioneerDDJSB3.nonPadLeds.shiftVinyl, value);
};

PioneerDDJSB3.loopLed = function (value, group, control) {
    PioneerDDJSB3.nonPadLedControl(group, PioneerDDJSB3.nonPadLeds.loop, value);
};

PioneerDDJSB3.bpmLed = function (value, group, control) {
    PioneerDDJSB3.padLedControl(group, PioneerDDJSB3.ledGroups.slicer, 0, false, value);
};

PioneerDDJSB3.samplerLeds = function (value, group, control) {
    printObject('MOA samplerLeds - group: ' + group)
    var samplerOffset = PioneerDDJSB3.samplerGroups[group],
        channel;

    for (channel = 0; channel < 4; channel++) {
      PioneerDDJSB3.padLedControl(channel, PioneerDDJSB3.ledGroups.sampler, samplerOffset, false, value);
    }
};

PioneerDDJSB3.hotCueLeds = function (value, group, control) {
    var shiftedGroup = false,
        padNum = null,
        hotCueNum;

    for (hotCueNum = 1; hotCueNum <= 8; hotCueNum++) {
        if (control === 'hotcue_' + hotCueNum + '_enabled') {
            padNum = (hotCueNum - 1);
            PioneerDDJSB3.padLedControl(group, PioneerDDJSB3.ledGroups.hotCue, padNum, false, value);
        }
    }
};

PioneerDDJSB3.VuMeterLeds = function (value, group, control) {
    // The red LED lights up with MIDI values 119 (0x77) and above. That should only light up when
    // the track is clipping.
    if (engine.getValue(group, 'PeakIndicator') === 1) {
        value = 119;
    } else {
        // 117 was determined experimentally so the yellow LED only lights
        // up when the level meter in Mixxx is in the yellow region.
        value = Math.floor(value * 117);
    }

    if (!(PioneerDDJSB3.twinkleVumeterAutodjOn && engine.getValue("[AutoDJ]", "enabled"))) {
        var midiChannel;
        if (PioneerDDJSB3.showVumeterMaster) {
            if (control === 'VuMeterL') {
                midiChannel = 0;
            } else if (control === 'VuMeterR') {
                midiChannel = 1;
            }
            // Send for deck 1 or 2
            midi.sendShortMsg(0xB0 + midiChannel, 2, value);
            // Send for deck 3 or 4
            midi.sendShortMsg(0xB0 + midiChannel + 2, 2, value);
        } else {
            midiChannel = parseInt(group.substring(8, 9) - 1);
            midi.sendShortMsg(0xB0 + midiChannel, 2, value);
        }
    } else {
        if (group == "[Master]") {
            if (control == "VuMeterL") {
                PioneerDDJSB3.valueVuMeter['[Channel1]_current'] = value;
                PioneerDDJSB3.valueVuMeter['[Channel3]_current'] = value;
            } else {
                PioneerDDJSB3.valueVuMeter['[Channel2]_current'] = value;
                PioneerDDJSB3.valueVuMeter['[Channel4]_current'] = value;
            }
        } else {
            PioneerDDJSB3.valueVuMeter[group + '_current'] = value;
        }

        for (var channel = 0; channel < 4; channel++) {
            var midiOut = PioneerDDJSB3.valueVuMeter['[Channel' + (channel + 1) + ']_current'];
            if (PioneerDDJSB3.valueVuMeter['[Channel' + (channel + 1) + ']_enabled']) {
                midiOut = 0;
            }
            if (midiOut < 5 && PioneerDDJSB3.valueVuMeter['[Channel' + (channel + 1) + ']_enabled'] === 0) {
                midiOut = 5;
            }

            midi.sendShortMsg(
                0xB0 + channel,
                2,
                midiOut
            );
        }
    }
};

///////////////////////////////////////////////////////////////
//                          JOGWHEELS                        //
///////////////////////////////////////////////////////////////

PioneerDDJSB3.getJogWheelDelta = function (value) { // O
    // The Wheel control centers on 0x40; find out how much it's moved by.
    return value - 0x40;
};

PioneerDDJSB3.jogRingTick = function (channel, control, value, status, group) {
    PioneerDDJSB3.pitchBendFromJog(group, PioneerDDJSB3.getJogWheelDelta(value));
};

PioneerDDJSB3.jogRingTickShift = function (channel, control, value, status, group) {
    if (PioneerDDJSB3.getJogWheelDelta(value) > 0) {
        engine.setValue(group, "beats_translate_earlier", 1);  
    } else {
        engine.setValue(group, "beats_translate_later", 1);  
    }
};

PioneerDDJSB3.jogPlatterTick = function (channel, control, value, status, group) {
    var deck = PioneerDDJSB3.channelGroups[PioneerDDJSB3.deckSwitchTable[group]];
    if (PioneerDDJSB3.scratchMode[deck]) {
        engine.scratchTick(deck + 1, PioneerDDJSB3.getJogWheelDelta(value));
    } else {
        PioneerDDJSB3.pitchBendFromJog(PioneerDDJSB3.deckSwitchTable[group], PioneerDDJSB3.getJogWheelDelta(value));
    }
};

PioneerDDJSB3.jogPlatterTickShift = function (channel, control, value, status, group) {
    var deck = PioneerDDJSB3.channelGroups[PioneerDDJSB3.deckSwitchTable[group]];
    if (PioneerDDJSB3.scratchMode[deck]) {
        engine.scratchTick(deck + 1, PioneerDDJSB3.getJogWheelDelta(value));
    } else {
        PioneerDDJSB3.pitchBendFromJog(
            PioneerDDJSB3.deckSwitchTable[group],
            PioneerDDJSB3.getJogWheelDelta(value) * PioneerDDJSB3.jogwheelShiftMultiplier
        );
    }
};

PioneerDDJSB3.jogTouch = function (channel, control, value, status, group) {
    var deck = PioneerDDJSB3.channelGroups[PioneerDDJSB3.deckSwitchTable[group]];

    if (PioneerDDJSB3.scratchMode[deck]) {
        if (value) {
            engine.scratchEnable(
                deck + 1,
                PioneerDDJSB3.scratchSettings.jogResolution,
                PioneerDDJSB3.scratchSettings.vinylSpeed,
                PioneerDDJSB3.scratchSettings.alpha,
                PioneerDDJSB3.scratchSettings.beta,
                true
            );
        } else {
            engine.scratchDisable(deck + 1, true);
        }
    }
};

PioneerDDJSB3.toggleScratch = function (channel, control, value, status, group) {
    var deck = PioneerDDJSB3.channelGroups[group];
    if (value) {
        PioneerDDJSB3.scratchMode[deck] = !PioneerDDJSB3.scratchMode[deck];
        if (!PioneerDDJSB3.invertVinylSlipButton) {
            PioneerDDJSB3.nonPadLedControl(deck, PioneerDDJSB3.nonPadLeds.shiftVinyl, PioneerDDJSB3.scratchMode[deck]);
            PioneerDDJSB3.nonPadLedControl(deck, PioneerDDJSB3.nonPadLeds.vinyl, PioneerDDJSB3.scratchMode[deck]);
        }
        if (!PioneerDDJSB3.scratchMode[deck]) {
            engine.scratchDisable(deck + 1, true);
        }
    }
};

PioneerDDJSB3.pitchBendFromJog = function (channel, movement) {
    var group = (typeof channel === "string" ? channel : '[Channel' + channel + 1 + ']');

    engine.setValue(group, 'jog', movement / 5 * PioneerDDJSB3.jogwheelSensivity);
};

///////////////////////////////////////////////////////////////
//                        ROTARY SELECTOR                    //
///////////////////////////////////////////////////////////////

PioneerDDJSB3.trackPreviewActive = false;

PioneerDDJSB3.getRotaryDelta = function (value) {
    var delta = 0x40 - Math.abs(0x40 - value),
        isCounterClockwise = value > 0x40;

    if (isCounterClockwise) {
        delta *= -1;
    }
    return delta;
};

PioneerDDJSB3.rotarySelector = function (channel, control, value, status) {
    var delta = PioneerDDJSB3.getRotaryDelta(value);
    if (PioneerDDJSB3.trackPreviewActive) {
        engine.setValue('[PreviewDeck1]', 'playposition', delta * PioneerDDJSB3.deltaPreviewPosition + engine.getValue('[PreviewDeck1]', 'playposition'));
    } else {
        engine.setValue('[Playlist]', 'SelectTrackKnob', delta);
    }
};

PioneerDDJSB3.shiftedRotarySelector = function (channel, control, value, status) {
    var delta = PioneerDDJSB3.getRotaryDelta(value),
        f = (delta > 0 ? 'SelectNextPlaylist' : 'SelectPrevPlaylist');

    engine.setValue('[Playlist]', f, Math.abs(delta));
};

PioneerDDJSB3.rotarySelectorClick = function (channel, control, value, status) {
    if (value) {
        engine.setValue('[PreviewDeck1]', 'LoadSelectedTrackAndPlay', true);
        PioneerDDJSB3.trackPreviewActive = true;
    } else {
        engine.setValue('[PreviewDeck1]', 'stop', 1);
        PioneerDDJSB3.trackPreviewActive = false;
    }
};

PioneerDDJSB3.rotarySelectorShiftedClick = function (channel, control, value, status) {
    if (value) {
        engine.setValue('[Playlist]', 'ToggleSelectedSidebarItem', 1);
    }
};

///////////////////////////////////////////////////////////////
//                        PAD MODE BUTTONS                   //
///////////////////////////////////////////////////////////////

PioneerDDJSB3.hotCueMode = function (channel, control, value, status) {
    if (value) {
      // Make sure the PAD states are up to date
      for (hotCueNum = 1; hotCueNum <= 8; hotCueNum++) {
          var cueEnabled = engine.getValue('[Channel' + (channel + 1) + ']', 'hotcue_' + hotCueNum + '_enabled');
          padNum = (hotCueNum - 1);
          PioneerDDJSB3.padLedControl('[Channel' + (channel + 1) + ']', PioneerDDJSB3.ledGroups.hotCue, padNum, false, cueEnabled);
      }
    }
};

PioneerDDJSB3.shiftHotCueMode = function (channel, control, value, status) {
    // Make sure the PAD states are up to date
    var group = '[Channel' + (channel + 1) + ']'
    if (value) {
      // Activate led of PAD 1 and 4, to indicate fast backward and forward
      PioneerDDJSB3.padLedControl(group, PioneerDDJSB3.ledGroups.beatJump, 0, false, 1);
      PioneerDDJSB3.padLedControl(group, PioneerDDJSB3.ledGroups.beatJump, 3, false, 1);
      
      // Command to change PAD into beatjump mode
      midi.sendShortMsg(0x90 + channel, 0x69,0x7f);
    }
};

PioneerDDJSB3.fadeMixMode = function (channel, control, value, status) {
    // Nothing to do here for now, if button states need to be updated on mode change its done here
};

PioneerDDJSB3.shiftFadeMixMode = function (channel, control, value, status) {
    if (value) {
      // Command to change PAD into roll mode
      midi.sendShortMsg(0x90 + channel, 0x6B,0x7f);
    }
};

PioneerDDJSB3.padScratchMode = function (channel, control, value, status) {
    // Nothing to do here for now, if button states need to be updated on mode change its done here
};

PioneerDDJSB3.shiftPadScratchMode = function (channel, control, value, status) {
    if (value) {
      // Command to change PAD into slicer mode
      midi.sendShortMsg(0x90 + channel, 0x6D,0x7f);
    }
};

PioneerDDJSB3.samplerMode = function (channel, control, value, status) {
    if (value) {
    // Make sure the PAD states are up to date
      for (samplerNum = 1; samplerNum <= 8; samplerNum++) {
          var samplerEnabled = engine.getValue('[Sampler' + samplerNum + ']', 'play');
          var padNum = (samplerNum - 1);
          PioneerDDJSB3.padLedControl('[Channel' + (channel + 1) + ']', PioneerDDJSB3.ledGroups.sampler, padNum, false, samplerEnabled);
      }
    }
};

PioneerDDJSB3.shiftSamplerMode = function (channel, control, value, status) {
    // Nothing to do here the SB3 changes into trans mode automatically
};


///////////////////////////////////////////////////////////////
//                        PAD BUTTONS                        //
///////////////////////////////////////////////////////////////

PioneerDDJSB3.samplerButtons = function (channel, control, value, status, group) {
//    if (engine.getValue('[Sampler1]','play')) {
//    printObject('MOA aasamplerButtons - group: ' + group)
//      PioneerDDJSB3.padLedControl(channel, PioneerDDJSB3.ledGroups.sampler, 6, false, 1);
//    }
    printObject('MOA samplerButtons - group: ' + group)
    if (value) {
        if ( engine.getValue(group, 'play') ) {
            engine.setValue(group, 'stop', 1);
        } else {
            engine.setValue(group, 'playposition', 0)
            engine.setValue(group, 'play', 1);
        }
    }
};

PioneerDDJSB3.shiftSamplerButtons = function (channel, control, value, status, group) {
    printObject('MOA shiftSamplerButtons - group: ' + group)
    if (value) {
//        if ( engine.getValue(group, 'play') ) {
//            engine.setValue(group, 'stop', 1);
//        } else {
//            engine.setValue(group, 'play', 1);
//        }
    }
};

PioneerDDJSB3.transButtons = function (channel, control, value, status, group) {
    printObject('MOA transButtons: channel: '+ channel + ', group: ' + group + ', control: ' + control)
    if (value) {
        engine.setValue(group, 'LoadSelectedTrack', 1);
    }
};

PioneerDDJSB3.shiftTransButtons = function (channel, control, value, status, group) {
    printObject('MOA transButtons: channel: '+ channel + ', group: ' + group + ', control: ' + control)
    if (value) {
        engine.setValue(group, 'eject', 1);
    }
};

PioneerDDJSB3.hotCueButtons = function (channel, control, value, status, group) {
    printObject('MOA hotCueButtons: channel: '+ channel + ', group: ' + group + ', control: ' + control)
    var hotCueIndex = control + 1;
    engine.setValue(PioneerDDJSB3.deckSwitchTable[group], 'hotcue_' + hotCueIndex + '_activate', value);
};

PioneerDDJSB3.clearHotCueButtons = function (channel, control, value, status, group) {
    printObject('MOA shiftHotCueButtons: channel: '+ channel + ', group: ' + group + ', control: ' + control)
    var hotCueIndex = control - 7;
    if (value) {
        engine.setValue(PioneerDDJSB3.deckSwitchTable[group], 'hotcue_' + hotCueIndex + '_clear', 1);
    }
};

PioneerDDJSB3.beatJumpButtonCensor = function (channel, control, value, status, group) {
    printObject('MOA beatJumpButtonCensor: channel: '+ channel + ', group: ' + group + ', control: ' + control)
    if (value) {
        //engine.setValue(group, 'beatjump_1_forward', 1);
    }
};
PioneerDDJSB3.beatJumpButtonForward1 = function (channel, control, value, status, group) {
    if (value) {
        engine.setValue(group, 'beatjump_1_forward', 1);
    }
};
PioneerDDJSB3.beatJumpButtonForward4 = function (channel, control, value, status, group) {
    if (value) {
        engine.setValue(group, 'beatjump_4_forward', 1);
    }
};
PioneerDDJSB3.beatJumpButtonStart = function (channel, control, value, status, group) {
    if (value) {
        engine.setValue(group, 'playposition', 0);
    }
};
PioneerDDJSB3.beatJumpButtonBackwardPressed = function (channel, control, value, status, group) {
    if (value) {
        PioneerDDJSB3.backTimer = engine.beginTimer(100, "engine.setValue('"+group+"', 'beatjump_1_backward', 1)")
        //set led
    } else {
        engine.stopTimer(PioneerDDJSB3.backTimer)
    }
};
PioneerDDJSB3.beatJumpButtonForwardPressed = function (channel, control, value, status, group) {
    if (value) {
        PioneerDDJSB3.backTimer = engine.beginTimer(100, "engine.setValue('"+group+"', 'beatjump_1_forward', 1)")
        //set led
    } else {
        engine.stopTimer(PioneerDDJSB3.backTimer)
    }
};
PioneerDDJSB3.beatJumpButtonBackward4 = function (channel, control, value, status, group) {
    if (value) {
        engine.setValue(group, 'beatjump_4_backward', 1);
    }
};
PioneerDDJSB3.beatJumpButtonBackward1 = function (channel, control, value, status, group) {
    if (value) {
        engine.setValue(group, 'beatjump_1_backward', 1);
    }
};

PioneerDDJSB3.shiftBeatJumpButtons = function (channel, control, value, status, group) {
    printObject('MOA - TBD shiftBeatJumpButtons: channel: '+ channel + ', group: ' + group + ', control: ' + control)
};

PioneerDDJSB3.fxFadeButtons = function (channel, control, value, status, group) {
    printObject('MOA - TBD fxFadeButtons: channel: '+ channel + ', group: ' + group + ', control: ' + control)
    // Loop out, sends halve loop commands but does not enable the loop
    if (control == 22) {
        if (value) {
            engine.setValue(group, 'beatloop_4_activate', 1)
            // Need to disable it, because the pad button will also send the toggle loop signal
            //engine.setValue(group, 'reloop_exit', 1)
        } else {
            //engine.setValue(group, 'reloop_exit', 1)
        }
    }
};

PioneerDDJSB3.shiftFxFadeButtons = function (channel, control, value, status, group) {
    printObject('MOA - TBD shiftFxFadeButtons: channel: '+ channel + ', group: ' + group + ', control: ' + control);
};

PioneerDDJSB3.padScratchButtons = function (channel, control, value, status, group) {
    var deckNr = channel - 7
    if (value) {
        engine.setValue(group, 'hotcue_1_clear', 1);
        engine.setValue(group, 'hotcue_1_clear', 0);
        
        if ( PioneerDDJSB3.scratchMode[deckNr] != true ) {
            PioneerDDJSB3.deck[deckNr].scratchModeSave = true;
            PioneerDDJSB3.toggleScratch(deckNr, control, value, status, group);
        }
    } else {
        if ( PioneerDDJSB3.deck[deckNr].scratchModeSave ) { 
            PioneerDDJSB3.toggleScratch(deckNr, control, 1, status, group);
        }
        PioneerDDJSB3.deck[deckNr].scratchModeSave = false;
    }
};

PioneerDDJSB3.shiftPadScratchButtons = function (channel, control, value, status, group) {
    printObject('MOA - TBD shiftPadScratchButtons: channel: '+ channel + ', group: ' + group + ', control: ' + control)
};

PioneerDDJSB3.rollButtons = function (channel, control, value, status, group) {
    printObject('MOA - TBD roll Buttons: channel: '+ channel + ', group: ' + group + ', control: ' + control)
    engine.setValue(
        group,
        'beatlooproll_' + 2 + '_activate',
        value
    );
};

PioneerDDJSB3.shiftRollButtons = function (channel, control, value, status, group) {
    printObject('MOA - TBD shiftRollButtons: channel: '+ channel + ', group: ' + group + ', control: ' + control)
};

PioneerDDJSB3.slicerButtons = function (channel, control, value, status, group) {
    printObject('MOA - TBD slicerButtons: channel: '+ channel + ', group: ' + group + ', control: ' + control)
};

PioneerDDJSB3.shiftSlicerButtons = function (channel, control, value, status, group) {
    printObject('MOA - TBD shiftSlicerButtons: channel: '+ channel + ', group: ' + group + ', control: ' + control)
};

///////////////////////////////////////////////////////////////
//                             FX                            //
///////////////////////////////////////////////////////////////

PioneerDDJSB3.EffectUnit = function (unitNumber) {
    var eu = this;
    this.group = '[EffectRack1_EffectUnit' + unitNumber + ']';
    engine.setValue(this.group, 'show_focus', 1);

    this.EffectButton = function (buttonNumber) {
        this.buttonNumber = buttonNumber;

        this.group = eu.group;
        this.midi = [0x93 + unitNumber, 0x46 + buttonNumber];

        components.Button.call(this);
    };
    this.EffectButton.prototype = new components.Button({
        input: function (channel, control, value, status) {
            if (this.isPress(channel, control, value, status)) {
                this.isLongPressed = false;
                this.longPressTimer = engine.beginTimer(this.longPressTimeout, function () {
                    var effectGroup = '[EffectRack1_EffectUnit' + unitNumber + '_Effect' + this.buttonNumber + ']';
                    script.toggleControl(effectGroup, 'enabled');
                    this.isLongPressed = true;
                }, true);
            } else {
                if (!this.isLongPressed) {
                    var focusedEffect = engine.getValue(eu.group, 'focused_effect');
                    if (focusedEffect === this.buttonNumber) {
                        engine.setValue(eu.group, 'focused_effect', 0);
                    } else {
                        engine.setValue(eu.group, 'focused_effect', this.buttonNumber);
                    }
                }
                this.isLongPressed = false;
                engine.stopTimer(this.longPressTimer);
            }
        },
        outKey: 'focused_effect',
        output: function (value, group, control) {
            this.send((value === this.buttonNumber) ? this.on : this.off);
        },
        sendShifted: true,
        shiftControl: true,
        shiftOffset: 28,
    });

    this.button = [];
    for (var i = 1; i <= 3; i++) {
        this.button[i] = new this.EffectButton(i);

        var effectGroup = '[EffectRack1_EffectUnit' + unitNumber + '_Effect' + i + ']';
        engine.softTakeover(effectGroup, 'meta', true);
        engine.softTakeover(eu.group, 'mix', true);
    }

    this.knob = new components.Pot({
        unshift: function () {
            this.input = function (channel, control, value, status) {
                value = (this.MSB << 7) + value;

                var focusedEffect = engine.getValue(eu.group, 'focused_effect');
                if (focusedEffect === 0) {
                    engine.setParameter(eu.group, 'mix', value / this.max);
                } else {
                    var effectGroup = '[EffectRack1_EffectUnit' + unitNumber + '_Effect' + focusedEffect + ']';
                    engine.setParameter(effectGroup, 'meta', value / this.max);
                }
            };
        },
    });

    this.knobSoftTakeoverHandler = engine.makeConnection(eu.group, 'focused_effect', function (value, group, control) {
        if (value === 0) {
            engine.softTakeoverIgnoreNextValue(eu.group, 'mix');
        } else {
            var effectGroup = '[EffectRack1_EffectUnit' + unitNumber + '_Effect' + value + ']';
            engine.softTakeoverIgnoreNextValue(effectGroup, 'meta');
        }
    });
};

try {
    module.exports = PioneerDDJSB3;

} catch (e) {

}
