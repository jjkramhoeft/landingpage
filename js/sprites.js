/*
  Tiny pixel-art sprites for the Star Catcher easter egg on the Games page, drawn from text maps.
  Each character is one pixel; "." is transparent and other characters are looked up in the sprite's palette.

  Sprites.draw(ctx, name, x, y, size)   draws the sprite on a canvas, centred on x, y
*/
window.Sprites = (function () {
  'use strict';

  const SPRITES = {
    coin: {
      palette: { o: '#8a6a26', Y: '#c9a04a', w: '#ecd9a0' },
      rows: [
        '..oooo..',
        '.oYYYYo.',
        'oYYwYYYo',
        'oYYwYYYo',
        'oYYwYYYo',
        'oYYYYYYo',
        '.oYYYYo.',
        '..oooo..',
      ],
    },
    heart: {
      palette: { M: '#e9584c', w: '#f3a99f', d: '#9c2f26' },
      rows: [
        '.MM.MM.',
        'MwMMMMM',
        'MMMMMMM',
        'dMMMMMd',
        '.dMMMd.',
        '..dMd..',
        '...d...',
      ],
    },
    invader: {
      palette: { M: '#e9584c', d: '#9c2f26', w: '#efe6d4' },
      rows: [
        '..M.....M..',
        '...M...M...',
        '..MMMMMMM..',
        '.MMwMMMwMM.',
        'MMMMMMMMMMM',
        'M.MMMMMMM.M',
        'M.M.....M.M',
        '...dd.dd...',
      ],
    },
    ship: {
      palette: { C: '#efe6d4', W: '#c9a04a', M: '#e9584c', Y: '#c9a04a' },
      rows: [
        '....C....',
        '...CCC...',
        '..CCWCC..',
        '.CCCCCCC.',
        'CCMCCCMCC',
        'C..Y.Y..C',
      ],
    },
  };

  function draw(ctx, name, cx, cy, size) {
    const sprite = SPRITES[name];
    if (!sprite) return;
    const w = sprite.rows[0].length * size;
    const h = sprite.rows.length * size;
    const left = Math.round(cx - w / 2);
    const top = Math.round(cy - h / 2);
    sprite.rows.forEach((row, y) => {
      [...row].forEach((ch, x) => {
        const color = sprite.palette[ch];
        if (!color) return;
        ctx.fillStyle = color;
        ctx.fillRect(left + x * size, top + y * size, size, size);
      });
    });
  }

  return { draw };
})();
