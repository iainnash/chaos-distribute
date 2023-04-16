import { utils } from "ethers";
import { CHAIN_FE } from "../constants/chains";

export const TxnDisplay = ({ txn }: { txn: any }) =>
  txn && txn.dataResp ? (
    <li>
      {/* <strong>{utils.formatEther(txn.dataResp.value.hex)}</strong>{" "} */}
      {CHAIN_FE[txn.random.chain]?.currency} was sent to {txn.dataResp.to}
      {" // "}{" "}
      <a
        className="underline"
        href={`https://${CHAIN_FE[txn.random.chain].scan}/tx/${txn.dataResp.transactionHash}`}
      >
        view txn
      </a>
      {/* Sent {BigNumber.from(txn.txn.value.hex)} to {txn.to} <a href="">view</a> */}
      {/* <pre>{JSON.stringify(txn, null, 2)}</pre> */}
    </li>
  ) : (
    <pre>{JSON.stringify(txn)}</pre>
  );
