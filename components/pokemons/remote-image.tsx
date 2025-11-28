import { FC, useEffect, useState } from "react";
import { ActivityIndicator, Image, View } from "react-native";
import { SvgXml } from "react-native-svg";

type Props = {
  uri?: string;
  style?: any;
  resizeMode?: any;
};

export const RemoteImage: FC<Props> = ({ uri, style, resizeMode }) => {
  const [svgXml, setSvgXml] = useState<string | null>(null);
  const [loadingSvg, setLoadingSvg] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!uri) return;
    const isSvg = String(uri).split("?")[0].toLowerCase().endsWith(".svg");
    if (!isSvg) {
      setSvgXml(null);
      return;
    }

    setLoadingSvg(true);
    (async () => {
      try {
        const res = await fetch(uri);
        if (!res.ok) return;
        const text = await res.text();
        if (mounted) setSvgXml(text);
      } catch (err) {
        console.warn("Failed to load svg", uri, err);
      } finally {
        if (mounted) setLoadingSvg(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [uri]);

  const width = style?.width ?? 100;
  const height = style?.height ?? 100;

  if (svgXml) {
    return (
      <View
        style={{
          width,
          height,
          marginRight: 12,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SvgXml xml={svgXml} width={width} height={height} />
      </View>
    );
  }

  if (loadingSvg) {
    return (
      <View
        style={{
          width,
          height,
          marginRight: 12,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Image
      source={{ uri: String(uri) }}
      style={style}
      resizeMode={resizeMode}
    />
  );
};
