import { RgbColor } from './rgbColor';

export namespace Helpers {
    export function formatPace(duration: string, unit: string) {
        const totalSeconds = parseFloat(duration);

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
        const seconds = Math.ceil(totalSeconds - (hours * 3600) - (minutes * 60));

        const hoursText = hours === 0 ? '' : hours.toString();
        let minutesText = `${minutes.toString()}:`;
        let secondsText = seconds < 10 ? `0${seconds}` : seconds.toString();

        if (seconds === 60) {
            minutesText = `${(minutes + 1).toString()}:`;
            secondsText = '00';
        }
        const time = `${hoursText}${minutesText}${secondsText}${unit}`;
        return time;
    }

    export function convertToTitleCase(sourceText: string) {
        return sourceText.replace(/\w\S*/g,
            (text) => {
                return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
            });
    }

    export function getBaseUrl() {
        return `${window.location.protocol}//${window.location.host}`;
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

    export function getRgbColorBasedOnHrZone(heartRateZone: string) {
        // Defined in app/assets/stylesheets/athletes.scss.
        const colorHrZone1 = new RgbColor(189, 214, 186);
        const colorHrZone2 = new RgbColor(0, 166, 90);
        const colorHrZone3 = new RgbColor(243, 156, 18);
        const colorHrZone4 = new RgbColor(200, 35, 0);
        const colorHrZone5 = new RgbColor(17, 17, 17);
        const colorHrZoneNa = new RgbColor(210, 214, 222);

        switch (heartRateZone) {
            case '1':
                return colorHrZone1;
            case '2':
                return colorHrZone2;
            case '3':
                return colorHrZone3;
            case '4':
                return colorHrZone4;
            case '5':
                return colorHrZone5;
            default:
                return colorHrZoneNa;
        }
    }

    export function convertToRgbaColors(rgbColors: RgbColor[], alpha: number) {
        const colors: string[] = [];
        rgbColors.forEach((item, index) => {
            colors.push(item.toString(alpha));
        });
        return colors;
    }

    export function getUrlParameter(name: string) {
        // https://davidwalsh.name/query-string-javascript
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    export function formatPaceStringForOrdering(pace: string) {
        const result = pace.indexOf(':') > 0 && pace.split(':')[0].length == 1 ? `0${pace}` : pace;
        return result;
    }

    export function isTouchDevice() {
        // https://stackoverflow.com/a/4819886/1177636.
        return 'ontouchstart' in window        // works on most browsers.
            || navigator.maxTouchPoints;       // works on IE10/11 and Surface.
    }

    export function sendGoogleAnalyticsEvent(category: string, action: string, element: Element, value?: number) {
        const title = element.getAttribute('title');
        const textConent = element.textContent ? element.textContent.trim() : undefined;
        const label = (title && title.length !== 0) ? title : textConent;
        ga('send', {
            hitType: 'event',
            eventCategory: category,
            eventAction: action.trim(),
            eventLabel: label,
            eventValue: value,
        });
    }

    export function toTitleCase(str: string) {
        return str.replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
}
