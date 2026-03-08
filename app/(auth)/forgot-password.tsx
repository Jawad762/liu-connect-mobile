import { useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter, type Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { authService } from "@/services/auth.service";
import useAuthStore from "@/stores/auth.store";
import { GradientBackground } from "@/components/reusable/gradient-background";
import { Input } from "@/components/reusable/input";
import { Button } from "@/components/reusable/button";
import { BackButton } from "@/components/reusable/back-button";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const setResendPasswordResetCodeAfterDate = useAuthStore((s) => s.setResendPasswordResetCodeAfterDate);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setError("");
      if (!email) {
        setError("Please enter your email address");
        return;
      }
      setLoading(true);
      const response = await authService.forgotPassword(email);
      if (!response.success) {
        throw new Error(response.message || "Failed to send reset link");
      }
      setResendPasswordResetCodeAfterDate(new Date(Date.now() + 60 * 1000));
      router.replace({
        pathname: "/reset-password",
        params: { email },
      } as Href);
    } catch (err: unknown) {
      console.error("Forgot password error", err);
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
              Forgot Password?
            </Text>
            <Text className="text-white/75 text-base text-center mb-8 font-sans">
              Enter your email and we'll send you instructions to reset your password.
            </Text>

            <Input
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={error}
            />

            <Button onPress={handleSubmit} disabled={loading} loading={loading}>
              Send Reset Link
            </Button>
          </ScrollView>
        </KeyboardAvoidingView>
      </GradientBackground>
    </View>
  );
}
