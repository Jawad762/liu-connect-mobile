import { API_URL } from "@/constants/api";
import { generateReactNativeHelpers } from "@uploadthing/expo";

export const { useImageUploader, uploadFiles } = generateReactNativeHelpers<any>({
  url: `${API_URL}/api/uploadthing`,
});
