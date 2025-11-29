import { cn } from "@/lib/utils";
import { PropsWithClassName } from "@/types/props";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { FC, useEffect, useRef } from "react";
import { Animated, PressableProps } from "react-native";
import { Button } from "./ui/button";

type Props = {
  onPress?: PressableProps["onPress"];
  visible?: boolean;
};

export const GoTop: FC<PropsWithClassName<Props>> = ({
  onPress,
  className,
  visible = true,
}) => {
  const opacityAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacityAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnimation, {
          toValue: 1,
          tension: 150,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacityAnimation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, opacityAnimation, scaleAnimation]);

  return (
    <Animated.View
      style={{
        opacity: opacityAnimation,
        transform: [{ scale: scaleAnimation }],
        position: "absolute",
        right: 24,
        bottom: 24,
      }}
      className={className}
    >
      <Button
        variant={"fab"}
        size={"icon"}
        onPress={onPress}
        className={cn("size-14")}
      >
        <MaterialCommunityIcons name="chevron-up" size={32} color="black" />
      </Button>
    </Animated.View>
  );
};
