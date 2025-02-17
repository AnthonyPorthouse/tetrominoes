import { Howl } from 'howler'

export const sounds = {
    thud: new Howl({
        src: ['thud.ogg']
    }),
    bgm: new Howl( {
        src: ['bgm.ogg'],
        loop: true,
        html5: true
    })
} as const
