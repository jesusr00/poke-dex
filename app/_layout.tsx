import "./global.css";

import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const backgroundColor = colorScheme === "dark" ? "#0f172a" : "#f8fafc";

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1, backgroundColor }}>
        <Stack
          screenOptions={{
            contentStyle: { flex: 1, backgroundColor },
            animation: "default",
            animationDuration: 800,
          }}
        >
          <Stack.Screen
            name="index"
            options={{ headerTitle: "PokeDex Expo + NativeWind" }}
          />
          <Stack.Screen
            name="details/[id]"
            options={{ title: "Pokemon Details" }}
          />
        </Stack>
        <StatusBar style="auto" />
      </View>
    </ThemeProvider>
  );
}
