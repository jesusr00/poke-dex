import "./global.css";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { NAV_THEME } from "@/lib/theme";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo } from "react";
import { View } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const theme = useMemo(() => NAV_THEME[colorScheme ?? "dark"], [colorScheme]);

  return (
    <ThemeProvider value={theme}>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Stack
          screenOptions={{
            contentStyle: { flex: 1, backgroundColor: theme.colors.background },
            animation: "default",
            animationDuration: 800,
          }}
        >
          <Stack.Screen
            name="index"
            options={{ headerTitle: "PokeDex Expo + NativeWind" }}
          />
          <Stack.Screen name="details/[id]" options={{ title: "" }} />
        </Stack>
        <StatusBar style="auto" />
      </View>
      <PortalHost />
    </ThemeProvider>
  );
}
