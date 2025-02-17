const tints = [
    0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xffffff,
  ];

export function getRandomColor() {
    return tints[Math.floor(Math.random() * tints.length)];
}
