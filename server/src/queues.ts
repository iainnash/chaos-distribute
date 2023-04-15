import Bull from "bull";
import redis from "./redis";
import { GRID_BASIS } from "./constants";
import { ethers } from "ethers";
import { CHAIN_INFO } from "./constants";
import SafeApiKit from "@safe-global/api-kit";
import { SafeTransactionDataPartial } from "@safe-global/safe-core-sdk-types";
import { EthersAdapter } from "@safe-global/protocol-kit";
import Safe, { SafeFactory } from "@safe-global/protocol-kit";

const redis_url = process.env.REDIS_URL;
const updates = new Bull("chaos-updates", redis_url);

function get_random (list) {
  return list[Math.floor((Math.random()*list.length))];
}

updates.process(async () => {
  console.log("has updates");

  const keys: string[] = [];
  for (let i = 0; i < GRID_BASIS * GRID_BASIS; ++i) {
    keys.push(`grid:${i % GRID_BASIS}:${Math.floor(i / GRID_BASIS)}`);
  }
  const result = await redis.mget(keys);
  console.log(result);
  const items = result
    .map((i) => (i ? JSON.parse(i) : null))
    .filter((r) => r !== null);
  if (items.length === 0) {
    console.log("nothing to do");
    return;
  }
  const random = get_random(items);

  console.log(random);

  if (random.executing) {
    console.log({ random });
    console.log("has already run, skipping");
    return;
  }

  try {
    const chain = CHAIN_INFO[random.chain];
    if (!chain) {
      console.error("no chain");
      return;
    }

    console.log("sending", { random });
    const provider = new ethers.providers.StaticJsonRpcProvider(
      chain.rpc,
      chain.id
    );
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const valueRaw = ethers.utils.parseEther("0.001");

    let data = "0x";
    let to = random.address;
    let value = valueRaw.toString();

    if (random.action === "mint" && chain.nft) {
      const iface = new ethers.utils.Interface([
        "function mint(address to) external",
      ]);
      data = iface.encodeFunctionData("mint", [random.address]);
      to = chain.nft;
      value = "0";
    }

    let dataResp;

    if (chain.safe) {
      const txServiceUrl = chain.safeTXN;
      console.log({ txServiceUrl });

      const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: signer,
      });

      const safeService = new SafeApiKit({ txServiceUrl, ethAdapter });

      const safeSdk = await Safe.create({
        ethAdapter,
        safeAddress: chain.safe,
      });

      console.log("has sdk");

      const safeTransactionData: SafeTransactionDataPartial = {
        to,
        data,
        value,
      };

      const safeTransaction = await safeSdk.createTransaction({
        safeTransactionData,
      });

      console.log("has transaction");

      // Deterministic hash based on transaction parameters
      const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);

      // Sign transaction to verify that the transaction is coming from owner 1
      const senderSignature = await safeSdk.signTransactionHash(safeTxHash);

      await safeService.proposeTransaction({
        safeAddress: chain.safe,
        safeTransactionData: safeTransaction.data,
        safeTxHash,
        senderAddress: await signer.getAddress(),
        senderSignature: senderSignature.data,
      });

      console.log("proposed ");

      const executeTxResponse = await safeSdk.executeTransaction(
        safeTransaction
      );
      console.log("waiting");
      dataResp = await executeTxResponse.transactionResponse?.wait();
    } else {
      const tx = {
        to,
        value,
        data,
      };

      console.log(tx);

      const txn = await signer.sendTransaction(tx);
      dataResp = await txn.wait();
    }
    console.log(`executed ${dataResp}`);

    await redis.lpush("transactions", JSON.stringify({ dataResp, random }));

    // set executed
    await redis.set(
      `grid:${random.x}:${random.y}`,
      JSON.stringify({ ...random, executing: true }),
      "EX",
      random.now + 20
    );
  } catch (e: any) {
    console.error(e);
  }

  return;
});

async function setupBull() {
  updates.add({ repeat: { cron: "0 */3 * * * *" } });
  updates.add({ run: "now" });
  console.log("bull setup");
}

setupBull();
