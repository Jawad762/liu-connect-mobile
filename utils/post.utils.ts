export const validatePostContent = (content: string) => {
    if (content.trim().length === 0) {
        return { success: false, message: 'Content is required' };
    }
    if (content.trim().length > 300) {
        return { success: false, message: 'Content must be less than 300 characters' };
    }
    return { success: true, message: 'Content is valid' };
}

export const abbreviateMajor = (major: string) => {
    return major.split(' ').map(word => word[0]).join('');
}