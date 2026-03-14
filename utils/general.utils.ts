export const abbreviateMajor = (major: string) => {
    return major.split(' ').map(word => word[0]).join('');
}