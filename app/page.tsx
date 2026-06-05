import PageLayout from "./components/PageLayout";
import BlurOverlay from "./components/BlurOverlay";
import MosaicBackground from "./components/MosaicBackground";
import ContactButton from "./components/ContactButton";

export default function Home() {
  return (
    <PageLayout
      outerClassName="relative h-dvh overflow-hidden"
      contentClassName="relative z-20 h-full"
      backgroundLayers={
        <>
          <MosaicBackground />
          <BlurOverlay />
        </>
      }
      footerContent={<ContactButton />}
    >
      <div className="md:mt-8">
        <p className="font-geist font-light text-[clamp(28px,7.5vw,32px)] md:text-[40px] leading-tight text-text-default">
          Curious
          <br />
          Designer
        </p>
      </div>
    </PageLayout>
  );
}
