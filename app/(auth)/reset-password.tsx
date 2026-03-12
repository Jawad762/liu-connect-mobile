import { useEffect, useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams, type Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { authService } from "@/services/auth.service";
import useAuthStore from "@/stores/auth.store";
import { GradientBackground } from "@/components/reusable/gradient-background";
import { Input } from "@/components/reusable/input";
import { Button, GradientButton } from "@/components/reusable/button";
import { PressableText } from "@/components/reusable/pressable-text";
import { BackButton } from "@/components/reusable/back-button";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { email } = useLocalSearchParams<{ email: string }>();
  const resendPasswordResetCodeAfterDate = useAuthStore((s) => s.resendPasswordResetCodeAfterDate);
  const setResendPasswordResetCodeAfterDate = useAuthStore((s) => s.setResendPasswordResetCodeAfterDate);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendAfterSeconds, setResendAfterSeconds] = useState(0);

  useEffect(() => {
    const afterDate = resendPasswordResetCodeAfterDate;
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
  }, [resendPasswordResetCodeAfterDate]);

  const handleSubmit = async () => {
    try {
      setError("");
      if (!email || !code || !password) {
        setError("All fields are required");
        return;
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      setLoading(true);
      const response = await authService.resetPassword(
        email,
        code,
        password
      );
      if (!response.success) {
        throw new Error(response.message || "Failed to reset password");
      }
      setResendPasswordResetCodeAfterDate(null);
      router.replace("/(auth)/login" as Href);
    } catch (err: unknown) {
      console.error("Reset password error", err);
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
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
      const response = await authService.forgotPassword(email);
      if (!response.success) {
        throw new Error(response.message || "Failed to resend code");
      }
      setResendPasswordResetCodeAfterDate(new Date(Date.now() + 60 * 1000));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred while resending the code");
    } finally {
      setResending(false);
    }
  };

  if (!email) {
    Alert.alert("Error", "Something went wrong. Please try again.", [
      { text: "OK", onPress: () => router.replace("/(auth)/forgot-password" as Href) },
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
              <Image source={require("@/assets/images/icon.png")} className="w-10 h-10 rounded-full" />
              <Text className="text-white text-2xl font-sans-bold text-center">
                LIU Connect
              </Text>
            </View>

            <Text className="text-white text-[28px] font-sans-bold text-center mb-2">
              Reset Password
            </Text>
            <Text className="text-white/75 text-base text-center mb-8 font-sans">
              We've sent a verification code to {email}. Enter it below and choose a new password.
            </Text>

            <Input
              placeholder="Verification code"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
            />

            <Input
              placeholder="New password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textContentType="newPassword"
              autoComplete="new-password"
            />

            <Input
              placeholder="Confirm new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              textContentType="newPassword"
              autoComplete="new-password"
              error={error}
            />

            <GradientButton size="lg" onPress={handleSubmit} disabled={loading} loading={loading} fullWidth>
              Reset Password
            </GradientButton>
            <Button
              size="lg"
              variant="outline"
              onPress={handleResend}
              disabled={resending || resendAfterSeconds > 0}
              loading={resending}
            >
              {resendAfterSeconds > 0 ? `Resend code in ${Math.ceil(resendAfterSeconds)}s` : "Resend Code"}
            </Button>

            <View className="mt-8 items-center">
              <PressableText
                text="Remember your password? Log In"
                highlight="Log In"
                onPress={() => router.replace("/(auth)/login" as Href)}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </GradientBackground>
    </View>
  );
}
