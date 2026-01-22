import { useIsMobile } from "@/hooks/use-mobile";

function Header() {
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? (
        <MobileHeader />
      ) : (
        <DesktopHeader />
      )}
    </>
  );
}
