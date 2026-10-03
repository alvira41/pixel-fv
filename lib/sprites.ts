// Pixel sprites (24x40). Each char maps to a palette colour; '.' is transparent.
// Glasses: girl = round thin black frame, boy = thin rectangular frame (from the reference photos).
export type Sprite={rows:string[];palette:Record<string,string>;eyes:[number,number,number,number][];mouth:[number,number,number,number][];mouthHappy:[number,number,number,number][];eyeColor:string};
export const GIRL:Sprite={
 "rows": [
  "......oooooooooooo......",
  ".....ohhhhhhhhhhhho.....",
  "....ohhhhhhhhhhhhhho....",
  "...ohhhHHHhhhhhhhhhho...",
  "...ohhHhhhhhhhhhhhhho...",
  "...ohhhhhhhhhhhhhhhho...",
  "...ohhhhhhhhhhhhhhhho...",
  "...ohhhhHHhhhhhhhhhho...",
  "...ohhhhhhHsshhhhhhho...",
  "...ohhhhhsssshhhhhhho...",
  "...ohhggggssssgggghho...",
  "...ohgllllgssgllllgho...",
  "...ohgwlllgssgwlllgho...",
  "...ohgllllggggllllgho...",
  "...ohgllllgssgllllgho...",
  "...oHgllllgssgllllgHo...",
  "...ohsggggssssggggsho...",
  "...ohssssssssssssssho...",
  "...ohssssssssssssssho...",
  "...ohooooooooooooooho...",
  "...ohhhhhhSSSShhhhhho...",
  "...ohhhhhhSSSShhhhhho...",
  "...ohhhhhhPSSPhhhhhho...",
  "...oppPPPPPPPPPPRRppo...",
  "...oppppppppppppRpppo...",
  "...opppppppppppRppppo...",
  "...oppppNnppppRpppppo...",
  "...ossppnnpppRppppsso...",
  "...ossppppppRpppppsso...",
  "...osspppppRppppppsso...",
  "..oBBBBBBpRpppppppsso...",
  "..oBBBBBBRPPPPPPPPsso...",
  "..orryyrrPPPPPPPPPsso...",
  "..orrrrrrWWWWWWWWWWso...",
  "..orrrrrrwwwwwwwwwwso...",
  "..orrrrrrwwoowwwWwwo....",
  "...oowwwwwwoowwwwwwo....",
  "...owwwwwwwoowwwwwwwo...",
  "..occCCcccwoowcccCCcco..",
  "..occCCccco..occcCCcco.."
 ],
 "palette": {
  "o": "#3f2f4a",
  "h": "#2f2630",
  "H": "#4d3b55",
  "s": "#f6cba8",
  "S": "#e6b08c",
  "b": "#f2929c",
  "g": "#1c1722",
  "l": "#eef5fb",
  "w": "#f7f4ee",
  "p": "#ee8fa5",
  "P": "#d4738c",
  "n": "#fde8ec",
  "N": "#f6c3cf",
  "W": "#dcd7cc",
  "r": "#b3304a",
  "B": "#8c2238",
  "R": "#8c2238",
  "y": "#f2c14e",
  "c": "#fffaf0",
  "C": "#e3d9c6"
 },
 "eyes": [
  [
   7,
   13,
   1,
   2
  ],
  [
   16,
   13,
   1,
   2
  ]
 ],
 "mouth": [
  [
   10,
   17,
   1,
   1
  ],
  [
   11,
   18,
   2,
   1
  ],
  [
   13,
   17,
   1,
   1
  ]
 ],
 "mouthHappy": [
  [
   10,
   17,
   4,
   1
  ],
  [
   11,
   18,
   2,
   1
  ]
 ],
 "eyeColor": "#2a2030"
};
export const BOY:Sprite={
 "rows": [
  ".....ohooohooohooho.....",
  "....ohhhhhhhhhhhhhho....",
  "...ohhhhhhhhhHHhhhhho...",
  "..ohhhHHHHhhhhhhhhhhho..",
  "..ohhhhhhhhhhhhhhhhhho..",
  "..ohhHhhhhhhhhhhhhhhho..",
  "..ohhhhhhhhhhhhhhhhhho..",
  "..ohhhhhhhhhhhhhhhhhho..",
  "..ohhhhhhhhhhhhhhhhhho..",
  "..ohhhhhhhhhhhhhhhhhho..",
  "..ohhhhhhhsshhhhshhhho..",
  "..ohhhsssssssssssshhho..",
  "..ohhggggggssgggggghho..",
  "..ogggwlllggggwlllgggo..",
  "..ohhgllllgssgllllghho..",
  "..ohhggggggssgggggghho..",
  "...oossssssssssssssoo...",
  "....osbbssssssssbbso....",
  "....osssssssssssssso....",
  ".....osssssssssssso.....",
  "......ooooSSSSoooo......",
  ".........oSSSSo.........",
  "...ooooooTTTTTToooooo...",
  "..otttvvTttttttTvvttto..",
  "..ottvvvvvttttvvvvvtto..",
  "..ottvvvvvvttvvvvvvtto..",
  "..ottvvvvvvvvvvvvvvtto..",
  "..ottvvuvvvvvvvvuvvtto..",
  "..ottvvvvvvvvvvvvvvtto..",
  "..ottvvvvvvvvvvvvvvtto..",
  "..ottvvvvvvvvvvvvvvtto..",
  "..oTTVVVVVVVVVVVVVVTTo..",
  "..oTTVVVVVVVVVVVVVVTTo..",
  "..osqQQQQQQQQQQQQQQqso..",
  "..osqqqqqqqqqqqqqqqqso..",
  "...oqqqQqqqooqqqQqqqo...",
  "...oqqqqqqqooqqqqqqqo...",
  "..oqqqqqqqqooqqqqqqqqo..",
  "..okkKKkkkqooqkkkKKkko..",
  "..okkkkkkko..okkkkkkko.."
 ],
 "palette": {
  "o": "#3f2f4a",
  "h": "#25232c",
  "H": "#45404f",
  "s": "#f1c29c",
  "S": "#dfa882",
  "b": "#ee8f95",
  "g": "#1c1722",
  "l": "#e8f1f8",
  "w": "#ffffff",
  "t": "#c3c7d2",
  "T": "#e4e7ee",
  "v": "#232b45",
  "V": "#171e33",
  "u": "#34406a",
  "q": "#bdbdbb",
  "Q": "#9b9b9b",
  "k": "#2a3050",
  "K": "#4a5280"
 },
 "eyes": [
  [
   7,
   13,
   1,
   2
  ],
  [
   16,
   13,
   1,
   2
  ]
 ],
 "mouth": [
  [
   10,
   17,
   1,
   1
  ],
  [
   11,
   18,
   2,
   1
  ],
  [
   13,
   17,
   1,
   1
  ]
 ],
 "mouthHappy": [
  [
   10,
   17,
   4,
   1
  ],
  [
   11,
   18,
   2,
   1
  ]
 ],
 "eyeColor": "#2a2030"
};
export const CAT={rows:["..o.....o.....", ".ooo...ooo....", "ooooooooooo.o.", "oowoooowooooo.", "ooooooooooooo.", "oopoooooooooo.", ".oooooooooooo.", ".ooooooooooo..", ".oo.oo.oo.oo..", ".............."],palette:{o:'#f4b680',w:'#2a2030',p:'#f08a9a'}};
