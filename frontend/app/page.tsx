import Image from "next/image";
import { ConnectWallet } from "@/components/ConnectWallet";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 font-sans dark:from-zinc-900 dark:to-black">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-between py-16 px-8 sm:px-16">
        <div className="w-full flex justify-between items-center">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={120}
            height={24}
            priority
          />
        </div>

        <div className="flex flex-col items-center gap-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight text-black dark:text-zinc-50">
            Welcome to Web3 DApp
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Connect your wallet to interact with the Scroll Sepolia testnet
          </p>
          
          <div className="mt-8">
            <ConnectWallet />
          </div>
        </div>

        <div className="flex flex-col gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          <p>Built with Next.js, Wagmi, and Scroll Sepolia</p>
        </div>
      </main>
    </div>
  );
}
