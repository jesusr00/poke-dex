import { FC, PropsWithChildren } from "react";
import { View } from "react-native";

export const Screen: FC<PropsWithChildren> = ({ children }) => {
  return <View className="flex-1 pb-4 px-2 bg-slate-900">{children}</View>;
};
