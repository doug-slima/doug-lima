import PageLayout from "./components/PageLayout";
import AsciiShader, { DEFAULT_CONFIG } from "./components/AsciiShader";
import ContactButton from "./components/ContactButton";

export default function Home() {
  return (
    <PageLayout
      outerClassName="relative h-dvh overflow-hidden"
      contentClassName="relative z-20 h-full"
      backgroundLayers={
        <AsciiShader
          config={DEFAULT_CONFIG}
          theme="light"
        />
      }
      footerContent={<ContactButton />}
    >
      <div className="md:mt-8 w-fit bg-[#F9F9F2]">
        <p className="font-geist font-light text-[clamp(28px,7.5vw,32px)] md:text-[40px] leading-tight text-text-default">
          Curious
          <br />
          Designer
        </p>
      </div>
    </PageLayout>
  );
}
