const PioneerDDJSB3 = require('./Pioneer-DDJ-SB3-scripts');
test('init', () => {
    PioneerDDJSB3.init();
});

test('switch deck', () => {
    PioneerDDJSB3.deckSwitch();
});

test('scratch button 1', () => {
    PioneerDDJSB3.padScratchButtons(8, 1, 1, 2, "[Channel1]"); 
    PioneerDDJSB3.padScratchButtons(8, 1, 0, 2, "[Channel1]"); 
    PioneerDDJSB3.padScratchButtons(8, 1, 1, 2, "[Channel2]"); 
    PioneerDDJSB3.padScratchButtons(8, 1, 0, 2, "[Channel2]"); 
    PioneerDDJSB3.padScratchButtons(8, 1, 1, 2, "[Channel3]"); 
    PioneerDDJSB3.padScratchButtons(8, 1, 0, 2, "[Channel3]"); 
    PioneerDDJSB3.padScratchButtons(8, 1, 1, 2, "[Channel4]"); 
    PioneerDDJSB3.padScratchButtons(8, 1, 0, 2, "[Channel4]"); 
});

