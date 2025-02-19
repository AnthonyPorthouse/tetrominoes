import { Howl } from "howler";

export const sounds = {
  thud: new Howl({
    src: ["thud.ogg"],
  }),
  bgm: new Howl({
    src: ["bgm.ogg"],
    loop: true,
  }),
} as const;
