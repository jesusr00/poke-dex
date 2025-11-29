import { cn } from "@/lib/utils";
import { PropsWithClassName } from "@/types/props";
import { FC, PropsWithChildren } from "react";
import { View } from "react-native";

export const Screen: FC<PropsWithClassName<PropsWithChildren>> = ({
  children,
  className,
}) => {
  return (
    <View className={cn("flex-1 pb-4 px-2 bg-background", className)}>
      {children}
    </View>
  );
};
