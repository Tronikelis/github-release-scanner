const toTimeAgo = (deltaSeconds: number): string => {
    const prefixes = {
        seconds: "s",
        minutes: "min",
        hours: "h",
        days: "d",
        weeks: "w",
        months: "mth",
        years: "y",
    };

    if (deltaSeconds < 60) {
        return `${Math.round(deltaSeconds)}${prefixes.seconds}`;
    }

    const minutes = deltaSeconds / 60;
    if (minutes < 60) {
        return `${Math.round(minutes)}${prefixes.minutes}`;
    }

    const hours = minutes / 60;
    if (hours < 24) {
        return `${Math.round(hours)}${prefixes.hours}`;
    }

    const days = hours / 24;
    if (days < 7) {
        return `${Math.round(days)}${prefixes.days}`;
    }

    const weeks = days / 7;
    if (weeks < 5) {
        return `${Math.round(weeks)}${prefixes.weeks}`;
    }

    const months = days / 30;
    if (months < 12) {
        return `${Math.round(months)}${prefixes.months}`;
    }

    const years = months / 12;
    return `${Math.round(years)}${prefixes.years}`;
};

export function formatDate(_date: Date | string | number | undefined, timeAgo = false) {
    if (!_date) return null;

    const formatter = new Intl.DateTimeFormat(window.navigator.language, {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        year: "2-digit",
    });

    const date = new Date(_date);

    if (!timeAgo) return formatter.format(date);

    const now = Date.now() / 1e3;
    const past = date.getTime() / 1e3;

    return toTimeAgo(Math.abs(now - past));
}
