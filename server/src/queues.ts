import Bull from "bull";
import redis from './redis';
import { GRID_BASIS } from "./constants";

const redis_url = process.env.REDIS_URL;
const updates = new Bull("updates", redis_url);

updates.process(async () => {
  console.log("has updates");

  const keys: string[] = [];
  for (let i = 0; i < GRID_BASIS * GRID_BASIS; ++i) {
    keys.push(`grid:${i % GRID_BASIS}:${Math.floor(i / GRID_BASIS)}`);
  }
  const result = await redis.mget(keys);
  const items = result.map((i) => (i ? JSON.parse(i) : null)).filter((r) => r !== null);
  if (items.length === 0) {
    return;
  }
  const random = items[Math.floor(items.length * Math.random())];



  return;
});

async function setupBull() {
  updates.add(
    {
      run: "update",
    },
    // runs every hour – can run every 30 mins if needed
    { repeat: { cron: "0 * * * *" } }
  );
  updates.add({ run: "now" });
  console.log("bull setup");
}

setupBull();
