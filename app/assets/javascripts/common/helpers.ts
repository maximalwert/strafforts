/// <reference path="./../common/rgbColor.ts" />

namespace Helpers {
    export function convertDurationToTime(duration: string) {
        const totalSeconds = parseInt(duration, 10); // Don't forget the second param.

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
        const seconds = totalSeconds - (hours * 3600) - (minutes * 60);

        const hoursText = hours < 10 ? `0${hours}` : hours.toString();
        const minutesText = minutes < 10 ? `0${minutes}` : minutes.toString();
        const secondsText = seconds < 10 ? `0${seconds}` : seconds.toString();

        const time = `${hoursText}:${minutesText}:${secondsText}`;
        return time;
    }

    export function getRgbColors(limit?: number) {
        const colors: RgbColor[] = [
            new RgbColor(189, 214, 186),
            new RgbColor(245, 105, 84),
            new RgbColor(0, 166, 90),
            new RgbColor(243, 156, 18),
            new RgbColor(64, 127, 127),
            new RgbColor(212, 154, 106),
            new RgbColor(78, 156, 104),
            new RgbColor(212, 166, 106),
            new RgbColor(245, 105, 84),
            new RgbColor(0, 166, 90),
            new RgbColor(243, 156, 18),
            new RgbColor(64, 127, 127),
            new RgbColor(212, 154, 106),
            new RgbColor(78, 156, 104),
        ];
        return limit ? colors.slice(0, limit) : colors;
    }

    export function convertToRgbaColors(rgbColors: RgbColor[], alpha: number) {
        const colors: string[] = [];
        rgbColors.forEach((item, index) => {
            const color = `rgba(${rgbColors[index].r}, ${rgbColors[index].g}, ${rgbColors[index].b}, ${alpha})`;
            colors.push(color);
        });
        return colors;
    }
}
