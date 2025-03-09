import React from "react";

const AdSense = ({ slot }: { slot: string }) => {
  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="YOUR_AD_CLIENT_ID"
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
};

export default AdSense;