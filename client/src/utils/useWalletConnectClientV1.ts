import { useState, useCallback, useEffect, useRef } from "react";
import WalletConnect from "@walletconnect/client";
import { IClientMeta, IWalletConnectSession } from "@walletconnect/types";
import { Provider } from "@ethersproject/abstract-provider";
import toast from "react-hot-toast";
import { useTransactionsStore } from "../stores/interactions";

const rejectWithMessage = (
  connector: WalletConnect,
  id: number | undefined,
  message: string
) => {
  connector.rejectRequest({ id, error: { message } });
};

export const useWalletConnectClientV1 = ({
  provider,
  chainId,
  onWCRequest,
  daoTreasuryAddress,
}: {
  provider: Provider;
  chainId: number;
  onWCRequest: (a: any, b: any) => void;
  daoTreasuryAddress: string;
}) => {
  const [wcClientData, setWcClientData] = useState<IClientMeta | null>(null);
  const [connector, setConnector] = useState<WalletConnect | undefined>();

  const localStorageSessionKey = useRef(`session_${daoTreasuryAddress}`);

  const onWCReqCurry = useRef(onWCRequest);

  const { addTransactions } = useTransactionsStore();

  useEffect(() => {
    onWCReqCurry.current = onWCRequest;
  }, [onWCRequest, onWCReqCurry]);

  const trackEvent = useCallback((action: any, meta: any) => {
    if (!meta) return;

    // todo track
    console.log({ action, meta });
  }, []);

  const wcDisconnect = useCallback(async () => {
    try {
      await connector?.killSession();
      setConnector(undefined);
      localStorage.removeItem(localStorageSessionKey.current);
      setWcClientData(null);
    } catch (error) {
      console.log("Error trying to close WC session: ", error);
    }
  }, [connector]);

  const wcConnect = useCallback(
    async ({
      uri,
      session,
    }: {
      uri?: string;
      session?: IWalletConnectSession;
    }) => {
      const wcConnector = new WalletConnect({
        uri,
        session,
        storageId: localStorageSessionKey.current,
      });
      setConnector(wcConnector);
      setWcClientData(wcConnector.peerMeta);

      wcConnector.on("session_request", (error: any, payload: any) => {
        if (error) {
          throw error;
        }

        wcConnector.approveSession({
          accounts: [daoTreasuryAddress],
          chainId,
        });

        trackEvent("New session", wcConnector.peerMeta);

        setWcClientData(payload.params[0].peerMeta);
        toast("WC Connected");
      });

      wcConnector.on("call_request", async (error: any, payload: any) => {
        console.log({ type: "call_request", error, payload });
        if (error) {
          throw error;
        }

        if (['personal_sign', 'eth_sign', 'eth_signTypedData'].includes(payload.method)) {
          new Notification("Cannot sign messages from a WalletConnect client", {
            body: 'A message was requested to be signed, but a connected wallet cannot sign a message'
          });
          toast("Cannot sign messages from a DAO", { duration: 20000 });
          return rejectWithMessage(
            wcConnector,
            payload.id,
            "Cannot sign messages from a WC client"
          );
        }

        try {

          const paramArgs = payload.params.map((param: any) => ({
            data: {
              id: payload.id,
              gas: param.gas,
              to: param.to,
              calldata: param.data,
              value: param.value || "0",
            },
          }));
          console.log('add txns')
          addTransactions([paramArgs]);

          trackEvent("Transaction Confirmed", wcConnector.peerMeta);
          onWCReqCurry.current(error, payload);

          wcConnector.approveRequest({
            id: payload.id,
            result:
              "0x0000000000000000000000000000000000000000000000000000000000000000",
          });
        } catch (err) {
          console.log(err);
          rejectWithMessage(wcConnector, payload.id, (err as Error).message);
        }
      });

      wcConnector.on("disconnect", (error: any) => {
        if (error) {
          throw error;
        }
        wcDisconnect();
      });
    },
    [provider, wcDisconnect, onWCReqCurry, addTransactions]
  );

  useEffect(() => {
    if (!connector) {
      const session = localStorage.getItem(localStorageSessionKey.current);
      if (session) {
        wcConnect({ session: JSON.parse(session) });
      }
    }
  }, [connector, wcConnect]);

  return { wcClientData, wcConnect, wcDisconnect };
};
