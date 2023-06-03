import type { IAnimation, ILed } from '../../interfaces/interfaces';
import { getDecoupePart } from '../utils/decoupe';
import { generateColorWave } from '../utils/couleurs';
/* eslint-disable */

interface IVagueProps{
    frequency: number;
    nbColor: number;
    firstColor: string;
    endColor: string;
    nbPart: number;
    nbColorBetweenStep: number;
    rotation: number;
}

export function VagueAnnimation(leds: ILed[], props : IVagueProps): IAnimation {
    const animation: IAnimation = {
        frequence: props.frequency,
        steps: []
    };

    const colors = generateColorWave(props.nbColor,props.firstColor, props.endColor);

    for (let part = 0; part < props.nbPart; part++) {
        const ledInPart = getDecoupePart(leds, props.nbPart, part, props.rotation);

        let time = 0
        for (let c = 0; c < props.nbColor; c++) {

            animation.steps.push({
                ids: ledInPart.map(led => led.id),
                timecode: time,
                colors: colors[(c + part * props.nbColorBetweenStep) % props.nbColor]
            });

            time += 1;
        }
    }

    return animation;
}
