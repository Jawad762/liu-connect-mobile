export default {
  "expo": {
    "name": "LIU Connect",
    "slug": "liu-connect",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icons/icon-ios.png",
    "scheme": "liuconnect",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "googleServicesFile": process.env.GOOGLE_SERVICE_INFO_PLIST,
      "bundleIdentifier": "com.fyp.liuconnect",
      "infoPlist": {
        "UIBackgroundModes": [
          "remote-notification"
        ],
        "ITSAppUsesNonExemptEncryption": false
      }
    },
    "android": {
      "googleServicesFile": process.env.GOOGLE_SERVICES_JSON,
      "package": "com.fyp.liuconnect",
      "adaptiveIcon": {
        "backgroundColor": "#000000",
        "foregroundImage": "./assets/icons/icon-android.png"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false,
      "permissions": [
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.READ_MEDIA_VISUAL_USER_SELECTED",
        "android.permission.READ_MEDIA_IMAGES",
        "android.permission.READ_MEDIA_VIDEO",
        "android.permission.READ_MEDIA_AUDIO"
      ]
    },
    "plugins": [
      "expo-router",
      "expo-notifications",
      [
        "expo-splash-screen",
        {
          "image": "./assets/icons/splash.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff",
          "dark": {
            "backgroundColor": "#000000",
            "image": "./assets/icons/splash-dark.png"
          }
        }
      ],
      "expo-video",
      [
        "expo-media-library",
        {
          "photosPermission": "Allow LIU Connect to access your photos to save images.",
          "savePhotosPermission": "Allow LIU Connect to save photos to your library."
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    },
    "extra": {
      "router": {},
      "eas": {
        "projectId": "54f8b19d-0442-4df7-b956-6254b302cfb9"
      }
    }
  }
}
