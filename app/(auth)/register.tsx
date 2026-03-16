import { useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter, type Href } from "expo-router";
import { screens } from "@/utils/screens";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { authService } from "@/services/auth.service";
import { GradientBackground } from "@/components/reusable/gradient-background";
import { Input } from "@/components/reusable/input";
import { Button, GradientButton } from "@/components/reusable/button";
import { PressableText } from "@/components/reusable/pressable-text";
import { BackButton } from "@/components/reusable/back-button";

const LIU_EMAIL_REGEX = /@students\.liu\.edu\.lb$/i;

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setError("");
      if (!email || !password) {
        setError("Email and password are required");
        return;
      }
      if (!LIU_EMAIL_REGEX.test(email)) {
        setError("Please use your LIU student email (@students.liu.edu.lb)");
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
      const response = await authService.register(email, password);
      if (response.success) {
        router.replace({
          pathname: screens.auth.verifyEmail,
          params: { email },
        } as Href);
      } else {
        setError(response.message || "Registration failed");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred while creating your account");
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
              Create an Account
            </Text>
            <Text className="text-white/75 text-base text-center mb-8 font-sans">
              Use your LIU student email.
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

            <Input
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Input
              placeholder="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <GradientButton size="lg" onPress={handleRegister} disabled={loading} loading={loading} fullWidth>
              Continue
            </GradientButton>

            <View className="mt-8 items-center">
              <PressableText
                text="Already have an account? Log In"
                highlight="Log In"
                onPress={() => router.back()}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </GradientBackground>
    </View>
  );
}
