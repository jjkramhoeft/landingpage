/*
  Tiny pixel-art sprites for the Games page, drawn from text maps.
  Each character is one pixel; "." is transparent and other characters are looked up in the sprite's palette.

  Sprites.svg(name, pixelSize)          returns an inline <svg> string
  Sprites.draw(ctx, name, x, y, size)   draws the sprite on a canvas, centred on x, y
*/
window.Sprites = (function () {
  'use strict';

  const SPRITES = {
    coin: {
      palette: { o: '#c98f00', Y: '#ffd447', w: '#fff6c2' },
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
      palette: { M: '#ee5fb7', w: '#ffc2e6', d: '#a32c78' },
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
    star: {
      palette: { Y: '#ffd447', w: '#fff6c2' },
      rows: [
        '...Y...',
        '..YwY..',
        'YYYwYYY',
        '.YYYYY.',
        '..YYY..',
        '.YY.YY.',
        'Y.....Y',
      ],
    },
    ship: {
      palette: { C: '#f6ecff', W: '#7ef0c8', M: '#ee5fb7', Y: '#ffd447' },
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

  function svg(name, size) {
    const sprite = SPRITES[name];
    if (!sprite) return '';
    const px = size || 4;
    const w = sprite.rows[0].length;
    const h = sprite.rows.length;
    let rects = '';
    sprite.rows.forEach((row, y) => {
      [...row].forEach((ch, x) => {
        const color = sprite.palette[ch];
        if (color) rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${color}"/>`;
      });
    });
    return `<svg class="sprite" viewBox="0 0 ${w} ${h}" width="${w * px}" height="${h * px}" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
  }

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

  function size(name, px) {
    const sprite = SPRITES[name];
    return sprite ? { width: sprite.rows[0].length * px, height: sprite.rows.length * px } : { width: 0, height: 0 };
  }

  return { svg, draw, size };
})();
