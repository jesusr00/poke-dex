import { Sprite } from "@/hooks/use-poke-api";
import { FC } from "react";
import { RemoteImage } from "./remote-image";

type Props = {
  sprites: Sprite;
};

export const PokemonSprites: FC<Props> = ({ sprites }) => {
  const mappedSprites: string[] = [];
  const s: any = sprites || {};
  const topKeys = [
    "front_default",
    "front_shiny",
    "back_default",
    "back_shiny",
    "front_female",
    "back_female",
    "front_shiny_female",
    "back_shiny_female",
  ];
  for (const k of topKeys) {
    if (s[k]) mappedSprites.push(s[k]);
  }

  if (s.other) {
    const other = s.other;
    if (other.home?.front_default) mappedSprites.push(other.home.front_default);
    if (other["official-artwork"]?.front_default)
      mappedSprites.push(other["official-artwork"].front_default);
    if (other.dream_world?.front_default)
      mappedSprites.push(other.dream_world.front_default);
  }

  return mappedSprites
    .filter(Boolean)
    .map((src, idx) => (
      <RemoteImage
        key={`${idx}-${String(src)}`}
        uri={String(src)}
        style={{ width: 100, height: 100, marginRight: 12 }}
        resizeMode="contain"
      />
    ));
};
