import { PoolsTable } from "@/components/pools/PoolsTable";
import { ConnectButton } from "@/components/ConnectButton";

export default function Home() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">DeFi Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Explore lending pools, liquid staking, and yield aggregators
          </p>
        </div>
        <ConnectButton />
      </div>

      <PoolsTable/>
    </div>
  );
}
