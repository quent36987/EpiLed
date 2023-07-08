/* eslint-disable */
export interface IPosObject {
    position: [number, number];
}

export function getSegmentedPart<T extends IPosObject>(objects: T[], nbDecoupe: number, part: number, rotation: number = 0): T[] {
    let rotationRadians = rotation * Math.PI / 180;

    let rotatedValues = objects.map(obj => obj.position[0] * Math.cos(rotationRadians) + obj.position[1] * Math.sin(rotationRadians));
    let minRotatedValue = Math.min(...rotatedValues);
    let maxRotatedValue = Math.max(...rotatedValues);

    let partWidth = (maxRotatedValue - minRotatedValue) / nbDecoupe;
    let partMin = minRotatedValue + partWidth * part;
    let partMax = partMin + partWidth;

    let partObjects = objects.filter(obj => {
        let rotatedValue = obj.position[0] * Math.cos(rotationRadians) + obj.position[1] * Math.sin(rotationRadians);
        return rotatedValue >= partMin && rotatedValue <= partMax;
    });

    return partObjects;
}
