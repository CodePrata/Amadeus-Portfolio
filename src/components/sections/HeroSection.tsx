import { BootSequence } from '@/components/ui/BootSequence';

export function HeroSection(): JSX.Element {
  return (
    <section
      id="home"
      className="flex min-h-screen items-center border-b border-matrix-green/20 px-4 py-20 lg:px-8"
    >
      <div className="mx-auto w-full max-w-4xl space-y-4">
        <h1 className="text-2xl font-bold text-matrix-green lg:text-3xl">BOOT_SEQUENCE::ONLINE</h1>
        <BootSequence />
      </div>
    </section>
  );
}
