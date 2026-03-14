export const formatRelativeDate = (date: Date): string => {
    const dateObj = new Date(date);
    const now = new Date().getTime();
    const diffInSeconds = (now - dateObj.getTime()) / 1000;
    if (diffInSeconds < 60) {
        return `${Math.floor(diffInSeconds)}s`;
    }
    const diffInMinutes = diffInSeconds / 60;
    if (diffInMinutes < 60) {
        return `${Math.floor(diffInMinutes)}m`;
    }
    const diffInHours = diffInMinutes / 60;
    if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}h`;
    }
    const diffInDays = diffInHours / 24;
    if (diffInDays < 30) {
        return `${Math.floor(diffInDays)}d`;
    }
    const diffInMonths = diffInDays / 30;
    if (diffInMonths < 12) {
        return `${Math.floor(diffInMonths)}mo`;
    }
    const diffInYears = diffInMonths / 12;
    return `${Math.floor(diffInYears)}y`;
}