import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams, type Href } from "expo-router";
import { screens } from "@/utils/screens.utils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { authService } from "@/services/auth.service";
import { GradientBackground } from "@/components/reusable/gradient-background";
import { Input } from "@/components/reusable/input";
import { Button, GradientButton } from "@/components/reusable/button";
import { PressableText } from "@/components/reusable/pressable-text";
import { BackButton } from "@/components/reusable/back-button";
import useAuthStore from "@/stores/auth.store";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  // Send code on screen load is necessary for cases where the user tries to login and is not verified, 
  // so we need to send the code to their email again
  const { email, sendCodeOnScreenLoad = "false" } = useLocalSearchParams<{ email: string, sendCodeOnScreenLoad: string }>();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendAfterSeconds, setResendAfterSeconds] = useState<number>(0);
  const resendEmailVerificationCodeAfterDate = useAuthStore((state) => state.resendEmailVerificationCodeAfterDate);
  const setResendEmailVerificationCodeAfterDate = useAuthStore((state) => state.setResendEmailVerificationCodeAfterDate);
  
  useEffect(() => {
    const afterDate = resendEmailVerificationCodeAfterDate;
    if (!afterDate || new Date() >= new Date(afterDate)) return;

    const updateRemaining = () => {
      const remaining = Math.max(0, (new Date(afterDate).getTime() - Date.now()) / 1000);
      setResendAfterSeconds(remaining);
      return remaining;
    };

    const initial = updateRemaining();
    if (initial <= 0) return;

    const interval = setInterval(() => {
      if (updateRemaining() <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendEmailVerificationCodeAfterDate]);

  useEffect(() => {
    if (sendCodeOnScreenLoad !== "true" || !email) return;

    let cancelled = false;
    authService
      .resendVerificationCode(email)
      .then((res) => {
        if (!cancelled && res.success) {
          setResendEmailVerificationCodeAfterDate(new Date(Date.now() + 60 * 1000));
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message || "Failed to send verification code");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [sendCodeOnScreenLoad, email]);

  const handleVerify = async () => {
    try {
      setError("");
      if (!email || !code) {
        setError("Email and verification code are required");
        return;
      }
      if (code.length < 6) {
        setError("Please enter the 6-digit verification code");
        return;
      }
      setLoading(true);
      const response = await authService.verifyEmail(email, code);
      if (!response.success) {
        throw new Error(response.message || "Verification failed");
      }
      setResendEmailVerificationCodeAfterDate(null);
      router.replace(screens.auth.login);
    } catch (err: unknown) {
      console.error("Verify email error", err);
      setError(err instanceof Error ? err.message : "An error occurred while verifying your email");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setError("");
      if (!email) {
        setError("Email is required");
        return;
      }
      setResending(true);
      const response = await authService.resendVerificationCode(email);
      if (!response.success) {
        throw new Error(response.message || "Failed to resend code");
      }
      setResendEmailVerificationCodeAfterDate(new Date(new Date().getTime() + 60 * 1000));
    } catch (err: unknown) {
      console.error("Resend code error", err);
      setError(err instanceof Error ? err.message : "An error occurred while resending the verification code");
    } finally {
      setResending(false);
    }
  };

  if (!email) {
    Alert.alert("Error", "Something went wrong. Please try again.", [
      { text: "OK", onPress: () => router.replace(screens.auth.register) },
    ]);
    return null;
  }

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <GradientBackground>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingTop: insets.top + 24,
              paddingBottom: insets.bottom + 24,
              paddingHorizontal: 24,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="relative flex-row justify-center items-center gap-2 mb-12">
              {router.canGoBack() && (
                <View className="absolute left-0 top-1/2 -translate-y-1/2"
                >
                  <BackButton />
                </View>
              )}
              <Image source={require("@/assets/images/logo-dark.png")} className="w-10 h-10 rounded-full" />
              <Text className="text-white text-2xl font-sans-bold text-center">
                LIU Connect
              </Text>
            </View>

            <Text className="text-white text-[28px] font-sans-bold text-center mb-2">
              Verify Your Email
            </Text>
            <Text className="text-white/75 text-base text-center mb-8 font-sans">
              We've sent a verification code to {email}
            </Text>

            <Input
              placeholder="Verification code"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
              error={error}
            />

            <GradientButton size="lg" onPress={handleVerify} disabled={loading} loading={loading} fullWidth>
              Verify Email
            </GradientButton>
            <Button variant="outline" size="lg" onPress={handleResend} disabled={resending || resendAfterSeconds > 0} loading={resending}>
              {resendAfterSeconds > 0 ? `Resend code in ${Math.ceil(resendAfterSeconds)}s` : "Resend Code"}
            </Button>

            <View className="mt-8 items-center">
              <PressableText
                text="Already verified? Log In"
                highlight="Log In"
                onPress={() => router.replace(screens.auth.login)}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </GradientBackground>
    </View>
  );
}
