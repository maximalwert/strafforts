/// <reference path="./../common/rgbColor.ts" />

namespace Helpers {
    export function convertDurationToTime(duration: string) {
        let totalSeconds = parseInt(duration, 10); // Don't forget the second param.
        
        let hours = Math.floor(totalSeconds / 3600);
        let minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
        let seconds = totalSeconds - (hours * 3600) - (minutes * 60);

        let hoursText = hours < 10 ? `0${hours}` : hours.toString();
        let minutesText = minutes < 10 ? `0${minutes}` : minutes.toString();
        let secondsText = seconds < 10 ? `0${seconds}` : seconds.toString();

        let time = `${hoursText}:${minutesText}:${secondsText}`;
        return time;
    }

    export function getRgbColors() {
        let colors: RgbColor[] = [
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
            new RgbColor(78, 156, 104)
        ];
        return colors;
    }

    export function convertToRgbaColors(rgbColors: RgbColor[], alpha: number) {
        let colors = [];
        for (let index = 0; index < rgbColors.length; ++index) {
            let color = `rgba(${rgbColors[index].r}, ${rgbColors[index].g}, ${rgbColors[index].b}, ${alpha})`;
            colors.push(color);
        }
        return colors;
    }
}
