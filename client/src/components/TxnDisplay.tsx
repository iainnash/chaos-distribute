import { utils } from "ethers";
import { CHAIN_FE } from "../constants/chains";

export const TxnDisplay = ({ txn }: { txn: any }) => (
  <li>
    <strong>{utils.formatEther(txn.txn.value.hex)}</strong> {CHAIN_FE[txn.random.chain]?.currency} was sent to {txn.txn.to}
    {' // '} <a href={`https://${CHAIN_FE[txn.random.chain].scan}/tx/${txn.txn.hash}`}>
      view txn
    </a>
    {/* Sent {BigNumber.from(txn.txn.value.hex)} to {txn.to} <a href="">view</a> */}
    {/* <pre>{JSON.stringify(txn, null, 2)}</pre> */}
  </li>
);
