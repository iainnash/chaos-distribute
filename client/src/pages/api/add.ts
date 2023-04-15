import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../lib/redis";
import { siweServer } from "../../utils/siweServer";
import { DECAY_TIME, GRID_BASIS } from "../../constants/ui";

type Data = {
  ok: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { address } = await siweServer.getSession(req, res);

  const request = JSON.parse(req.body);

  const { coords: {x, y}, chain, action, target, calldata, value } = request;
  if (x < 0 || x >= GRID_BASIS || y < 0 || y >= GRID_BASIS) {
    return res.status(500).json({ ok: false });
  }

  const now = Math.floor((new Date().getTime() / 1000));
  const exp = DECAY_TIME;

  await redis.set(
    `grid:${x}:${y}`,
    JSON.stringify({
      x,
      y,
      chain,
      target,
      action,
      calldata,
      address,
      value,
      exp,
      now
    }),
    'EX',
    exp,
    'NX'
  );

  return res.status(200).json({ ok: true });
}
