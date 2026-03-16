import { useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Pressable, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter, type Href } from "expo-router";
import { screens } from "@/utils/screens";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { authService } from "@/services/auth.service";
import useAuthStore from "@/stores/auth.store";
import { GradientBackground } from "@/components/reusable/gradient-background";
import { Input } from "@/components/reusable/input";
import { Button, GradientButton } from "@/components/reusable/button";
import { PressableText } from "@/components/reusable/pressable-text";
import { BackButton } from "@/components/reusable/back-button";

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    try {
      setError("");
      if (!email || !password) {
        setError("Email and password are required");
        return;
      }
      setLoading(true);
      const response = await authService.login(email, password);
      if (!response.success) {
        throw new Error(response.message || "Invalid credentials");
      }
      if (!response.data?.user?.is_verified) {
        router.replace({
          pathname: screens.auth.verifyEmail,
          params: { email, sendCodeOnScreenLoad: "true" },
        } as Href);
        return;
      }
      login(
        response.data.user,
        response.data.accessToken,
        response.data.refreshToken
      );
      router.replace(screens.home);
    } catch (err: unknown) {
      console.error("Login error", err);
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
              Hi There!
            </Text>
            <Text className="text-white/75 text-base text-center mb-8 font-sans">
              Login using your email and password.
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

            <View className="mb-4">
              <Pressable
                onPress={() => router.push(screens.auth.forgotPassword)}
                className="active:opacity-80"
              >
                <Text className="text-white/90 text-sm font-sans">
                  Forgot Password?
                </Text>
              </Pressable>
            </View>

            <GradientButton size="lg" onPress={handleLogin} disabled={loading} loading={loading} fullWidth>
              Log In
            </GradientButton>

            <View className="mt-8 items-center">
              <PressableText
                text="Don't have an account? Sign Up"
                highlight="Sign Up"
                onPress={() => router.push(screens.auth.register)}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </GradientBackground>
    </View>
  );
}
