import N4DLogoFlat from "@/components/svg/N4DLogoFlat";
import { useRouter } from "next/navigation";


export function N4DLogo() {
  const router = useRouter();

    const logoWidth = getComputedStyle(document.documentElement).getPropertyValue(
      "--layout-static-page-n4d-logo-width",
    );

    const logoHeight = getComputedStyle(
      document.documentElement,
    ).getPropertyValue("--layout-static-page-n4d-logo-height");



  return (
    <N4DLogoFlat
      color="var(--color-orchid-dark)"
      width={logoWidth} 
      height={logoHeight} 
      onClick={() => {router.push("/")}}
    />
  );
}

export default N4DLogo;