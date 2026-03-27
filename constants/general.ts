export const TAB_BAR_HEIGHT = 80;
export const POST_CONTENT_MAX_LENGTH = 300;
export const POST_MEDIA_MAX_COUNT = 4;

export const COMMENT_CONTENT_MAX_LENGTH = 300;
export const COMMENT_MEDIA_MAX_COUNT = 4;

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 50;

export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 25;
export const BIO_MAX_LENGTH = 160;
export const DESCRIPTION_MAX_LENGTH = 160;
export const REPORT_DETAILS_MAX_LENGTH = 160;

export const WELCOME_SCREENS = [
    {
        id: "welcome",
        tagline: "YOUR CAMPUS, CONNECTED",
        headline: "Welcome to the LIU Student Network",
        description:
            "Connect with students, share moments, and stay updated with campus life.",
    },
    {
        id: "discover",
        tagline: "DISCOVER & SHARE",
        headline: "See What's Happening on Campus",
        description:
            "Explore posts from other LIU students and share your own photos, thoughts, and updates.",
    },
    {
        id: "community",
        tagline: "JOIN THE CONVERSATION",
        headline: "Your LIU Community in One Place",
        description:
            "Follow classmates, interact with posts, and be part of the campus conversation.",
    },
];

export const REPORT_REASONS = [
    {
        id: "SPAM",
        label: "Spam",
        description: "Contains spam or unwanted promotional content.",
    },
    {
        id: "HARASSMENT",
        label: "Harassment",
        description: "Targets someone with harassment or bullying.",
    },
    {
        id: "SEXUAL_CONTENT",
        label: "Sexual Content",
        description: "Contains explicit or sexual content.",
    },
    {
        id: "HATE_SPEECH",
        label: "Hate Speech",
        description: "Contains hate speech or calls for violence.",
    },
    {
        id: "DISCRIMINATION",
        label: "Discrimination",
        description: "Contains discriminatory language or behavior.",
    },
    {
        id: "OTHER",
        label: "Other",
        description: "Violates community guidelines in another way.",
    },
];