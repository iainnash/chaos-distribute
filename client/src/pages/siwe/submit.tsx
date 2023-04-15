import type { GetServerSideProps, NextPage } from "next";
import { siweServer } from "../../utils/siweServer";
import { useSIWE } from "connectkit";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { fetchJson } from "ethers/lib/utils.js";
import React from "react";
import Modal from "../../components/Modal";
import { UserDisplayAddress } from "../../components/UserDisplayAddress";
import { DECAY_TIME, GRID_BASIS } from "../../constants/ui";
import { CHAIN_FE } from "../../constants/chains";
import { LayoutGroup, motion } from "framer-motion";

type Props =
  | { isCollector: false }
  | {
      isCollector: true;
      address: string;
    };

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  res,
}) => {
  const { address } = await siweServer.getSession(req, res);

  if (!address) {
    return {
      props: { isCollector: false },
    };
  }
  return {
    props: { address, isCollector: true },
  };
};

const inputClass =
  "bg-red-200 selected:bg-blue-200 p-4 selected:color-white selected:bg-orange color-black bg-white border-1 rounded-md";
const fieldClass = "";
const buttonItem = "relative  p-4 rounded-lg shadow-lg ";

const TokenGatedPage: NextPage<Props> = (props) => {
  if (!props.isCollector) {
    return <>You need to be signed in and have our token to see this page.</>;
  }

  const { isSignedIn } = useSIWE();
  const router = useRouter();

  const [newID, setNewID] = useState<undefined | { x: number; y: number }>(
    undefined
  );

  const { data, mutate } = useSWR(`/api/current`, fetchJson, {
    refreshInterval: 2000,
  });

  const [chain, setChain] = useState("goerli");
  const [action, setAction] = useState("mint");
  const onActionChange = useCallback(
    (evt: any) => {
      setAction(evt.target.value);
    },
    [setAction]
  );
  const onChainChange = useCallback(
    (evt: any) => {
      setChain(evt.target.value);
    },
    [setChain]
  );

  useEffect(() => {
    if (!isSignedIn) {
      alert("not signed in");
      router.push("/");
    }
  }, [isSignedIn, router]);
  const addForm = useRef();

  const [result, setResult] = useState<any>();

  const submit = useCallback(
    async (evt: any) => {
      evt.preventDefault();

      const addReq = await fetch("/api/add", {
        method: "POST",
        body: JSON.stringify({
          chain,
          action,
          coords: newID,
        }),
        headers: {
          "content-type": "json",
        },
      });
      const res = await addReq.json();
      if (res.ok) {
        setNewID(undefined);
      } else {
        setResult(res);
      }
      mutate();
    },
    [addForm.current, chain, action, newID, setResult, mutate]
  );

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        <LayoutGroup>
          {data?.items.map((item, indx) =>
            item ? (
              <motion.div className={`${buttonItem} `}>
                <motion.div
                  animate={{ width: `${(1 - ((data.now - item.now) / DECAY_TIME)) * 100}%` }}
                  className={`absolute -z-10 rounded-md inset-0 ${
                    CHAIN_FE[item.chain]?.color || ""
                  }`}
                >
                  {" "}
                </motion.div>
                <div className="">
                  {item.chain} {item.action}

                  <UserDisplayAddress address={item.address} />
                </div>
              </motion.div>
            ) : (
              <motion.div className={buttonItem}>
                <button
                  onClick={() => {
                    setNewID({
                      x: indx % GRID_BASIS,
                      y: Math.floor(indx / GRID_BASIS),
                    });
                    setResult(undefined);
                  }}
                >
                  [empty - add]
                </button>
                  <UserDisplayAddress address={''} />
              </motion.div>
            )
          )}
        </LayoutGroup>
      </div>
      <Modal
        title={`Add your unique action @ ${Object.values(newID || {}).join(
          "/"
        )}`}
        open={!!newID}
        setOpen={() => setNewID(undefined)}
      >
        <form id="addForm">
          <fieldset>
            <legend>chain</legend>
            <label>
              <input
                className={inputClass}
                type="radio"
                name="chain"
                value="goerli"
                onChange={onChainChange}
                defaultChecked
              />
              goerli
            </label>
            <label>
              <input
                className={inputClass}
                type="radio"
                name="chain"
                onChange={onChainChange}
                value="gnosis"
              />
              gnosis
            </label>
            <label>
              <input
                className={inputClass}
                type="radio"
                name="chain"
                onChange={onChainChange}
                value="mantle testnet"
              />
              mantle test
            </label>
            <label>
              <input
                className={inputClass}
                type="radio"
                name="chain"
                onChange={onChainChange}
                value="polygon mumbai"
              />
              polygon mumbai
            </label>
          </fieldset>
          <fieldset>
            <legend>action</legend>
            <label>
              <input
                className={inputClass}
                type="radio"
                name="action"
                onChange={onActionChange}
                value="mint"
              />
              mint NFT
            </label>
            <label>
              <input
                className={inputClass}
                type="radio"
                name="action"
                onChange={onActionChange}
                value="token"
              />
              get VALUE
            </label>
          </fieldset>
          <br />
          <label>Grid X: {newID?.x}</label>
          <br />
          <label>Grid Y: {newID?.y}</label>
          <br />
          <label>
            <button onClick={submit}>go go, good luck!</button>
            {result && (
              <>
                <br />
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </>
            )}
          </label>
        </form>
      </Modal>
      <div></div>
    </>
  );
};

export default TokenGatedPage;
