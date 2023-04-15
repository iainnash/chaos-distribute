import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  return res
    .status(200)
    .json({
      name: "A TEST NFT",
      description: "this test nft is the testiest and rareest of them all ",
    });
}
