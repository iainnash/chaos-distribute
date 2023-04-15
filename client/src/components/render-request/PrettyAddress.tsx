import { useEnsName } from "wagmi";
import { CHAINS } from "../../constants/chains";

export const PrettyAddress = ({
  address,
  prettyName,
  chainId,
}: {
  address: `0x${string}`;
  chainId: number,
  prettyName?: string;
}) => {
  const { data: ensName } = useEnsName({ address, enabled: !prettyName });

  return (
    <span title={address}>
      {prettyName ? prettyName : ensName ? ensName : address}{" "}
      <a
        title="View on etherscan"
        target="_blank"
        className="text-gray-600 hover:color-black transition-color"
        href={`https://${CHAINS[chainId].scan}/address/${address}`}
      >
        ↗
      </a>
    </span>
  );
};
