import dynamic from "next/dynamic";

const N4DLogo = dynamic(() => import("./N4DLogo"), {
  ssr: false,
});

export default N4DLogo;
