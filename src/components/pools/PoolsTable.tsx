"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppKitAccount } from "@reown/appkit/react";
import { SquareLibrary } from "lucide-react";

// Internal components
import { PoolRow } from "./PoolRow";
import { PoolFilters } from "./PoolFilters";
import { PoolsLoadingSkeleton } from "./PoolsLoadingSkeleton";
import { WalletConnectDialog } from "@/components/ui/wallet-connect-dialog";

// Types and utilities
import type { Pool, PoolCategory } from "@/types/pool";
import { POOL_CATEGORIES } from "@/types/pool";
import { fetchSpecificPools } from "@/services/api";

// Constants
const INITIAL_CATEGORY = POOL_CATEGORIES[0];
const LOADING_SKELETON_ROWS = 3;

interface PoolsTableProps {
    className?: string;
}

export const PoolsTable: React.FC<PoolsTableProps> = ({ className }) => {
    const [pools, setPools] = useState<Pool[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<PoolCategory>(INITIAL_CATEGORY);
    const [showWalletDialog, setShowWalletDialog] = useState(false);

    const { isConnected } = useAppKitAccount();

    // Reset category when wallet disconnects
    useEffect(() => {
        if (!isConnected) {
            setSelectedCategory(INITIAL_CATEGORY);
        }
    }, [isConnected]);

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                setError(null);

                const poolsData = await fetchSpecificPools();
                setPools(poolsData);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Failed to load pools data";
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const filteredPools = pools.filter((pool) => pool.category === selectedCategory);

    const handleCategoryChange = useCallback(
        (category: PoolCategory) => {
            // Check if trying to access Yield Aggregator without wallet
            if (category === "Yield Aggregator" && !isConnected) {
                setShowWalletDialog(true);
                return;
            }

            setSelectedCategory(category);
        },
        [isConnected]
    );

    if (error) {
        return (
            <Card className={className}>
                <CardContent className="p-6">
                    <div className="text-center space-y-4">
                        <p className="text-destructive">Error loading pools: {error}</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Main render
    return (
        <>
            <Card className={className}>
                <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                        <CardTitle className="flex items-center gap-2">Pools</CardTitle>
                        <div className="flex items-center gap-2">
                            <SquareLibrary   className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                                {filteredPools.length} {filteredPools.length === 1 ? "pool" : "pools"}
                            </span>
                        </div>
                    </div>

                    <PoolFilters selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} isWalletConnected={isConnected} />
                </CardHeader>

                <CardContent>
                    <div className="rounded-md border border-zinc-400">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Project</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Symbol</TableHead>
                                    <TableHead className="text-right">TVL</TableHead>
                                    <TableHead className="text-right">APY</TableHead>
                                    <TableHead className="text-right">30d Avg APY</TableHead>
                                    <TableHead className="text-right">Prediction</TableHead>
                                    <TableHead className="text-right">Risk (σ)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? <PoolsLoadingSkeleton rows={LOADING_SKELETON_ROWS} /> : filteredPools.map((pool) => <PoolRow key={pool.pool} pool={pool} isWalletConnected={isConnected} onLockedPoolClick={() => setShowWalletDialog(true)} />)}
                            </TableBody>
                        </Table>
                    </div>

                    {isLoading || filteredPools.length > 0 ? null : <div className="text-center py-8 text-muted-foreground">No pools found for the selected category.</div>}
                </CardContent>
            </Card>

            <WalletConnectDialog
                isOpen={showWalletDialog}
                onClose={() => setShowWalletDialog(false)}
                title="Connect Wallet Required"
                description="Yield Aggregator pools are locked until you connect a crypto wallet. Please connect your wallet to access these investment opportunities."
            />
        </>
    );
};
