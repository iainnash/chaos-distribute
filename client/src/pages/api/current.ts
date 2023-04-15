import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../lib/redis";
import { GRID_BASIS } from "../../constants/ui";

type Item = {
  x: string;
  y: string;
  exp: number;
  chain: number;
  target: string;
  calldata: string;
  value: string;
  from: string;
};
type Data = { items: Item[], now: number };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const keys: string[] = [];
  for (let i = 0; i < GRID_BASIS * GRID_BASIS; ++i) {
    keys.push(`grid:${i % GRID_BASIS}:${Math.floor(i / GRID_BASIS)}`);
  }
  const result = await redis.mget(keys);
  const items = result.map((i) => (i ? JSON.parse(i) : null));

  const now = new Date().getTime() / 1000;

  return res.status(200).json({ items, now });
}
