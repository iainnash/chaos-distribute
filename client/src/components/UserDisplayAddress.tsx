"use client";

import { useEffect, useRef } from "react";

// import { QrCode } from "react-qrcode-pretty";

export const UserDisplayAddress = ({ address }: { address: string }) => {
  const canv = useRef();
  useEffect(() => {
    console.log(canv.current);
    
  }, [canv.current]);
  return <canvas width={400} height={200} ref={canv} />;
  // return (
  //     <QrCode
  //       size={120}
  //       value={address}
  //       variant={{
  //         eyes: "gravity",
  //         body: "fluid",
  //       }}
  //       color={{
  //         eyes: "#223344",
  //         body: "#335577",
  //       }}
  //       padding={0}
  //       margin={0}
  //       bgColor="#ddeeff"
  //       bgRounded
  //     />
  // );
};
