"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Pool, PoolCategory, POOL_CATEGORIES } from "@/types/pool";
import { fetchSpecificPools, formatCurrency, formatPercentage } from "@/services/api";
import { useAppKitAccount } from "@reown/appkit/react";
import { Lock, TrendingUp, Activity } from "lucide-react";

interface PoolsTableProps {
    className?: string;
}

export function PoolsTable({ className }: PoolsTableProps) {
    const [pools, setPools] = useState<Pool[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<PoolCategory>(POOL_CATEGORIES[0]);
    const [showLockDialog, setShowLockDialog] = useState(false);

    const router = useRouter();
    const { isConnected } = useAppKitAccount();

    useEffect(() => {
        loadPools();
    }, []);

    // If user is not connected, set the selected category to the first category
    useEffect(() => {
        if (!isConnected) {
            setSelectedCategory(POOL_CATEGORIES[0]);
        }
    }, [isConnected]);

    const loadPools = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchSpecificPools();
            setPools(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load pools");
        } finally {
            setLoading(false);
        }
    };

    const filteredPools = pools.filter((pool) => pool.category === selectedCategory);

    const handlePoolClick = (poolId: string, category?: PoolCategory) => {
        // Check if this is a Yield Aggregator pool and user is not connected
        if (category === "Yield Aggregator" && !isConnected) {
            setShowLockDialog(true);
            return;
        }

        router.push(`/pool/${poolId}`);
    };

    const handleCategoryChange = (category: PoolCategory) => {
        if (category === "Yield Aggregator" && !isConnected) {
            setShowLockDialog(true);
            return;
        }
        setSelectedCategory(category);
    };

    const renderPoolRow = (pool: Pool) => {
        const isLocked = pool.category === "Yield Aggregator" && !isConnected;

        return (
            <TableRow key={pool.pool} className={`cursor-pointer hover:bg-muted/50 transition-colors ${isLocked ? "opacity-60" : ""}`} onClick={() => handlePoolClick(pool.pool, pool.category)}>
                <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                        {isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                        {pool.project}
                    </div>
                </TableCell>
                <TableCell>
                    <Badge variant={"default"}>{pool.category}</Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">{pool.symbol}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(pool.tvlUsd)}</TableCell>
                <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        {pool.apy ? formatPercentage(pool.apy) : "N/A"}
                    </div>
                </TableCell>
                <TableCell className="text-right">{pool.apyMean30d ? formatPercentage(pool.apyMean30d) : "N/A"}</TableCell>
                <TableCell className="text-right">{pool.prediction ? formatPercentage(pool.prediction) : "N/A"}</TableCell>
                <TableCell className="text-right">{pool.sigma ? pool.sigma.toFixed(3) : "N/A"}</TableCell>
            </TableRow>
        );
    };

    const renderLoadingSkeleton = () => (
        <>
            {Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                    <TableCell>
                        <Skeleton className="h-6 flex-1" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-6 flex-1" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-6 flex-1" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-6 flex-1" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-6 flex-1" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-6 flex-1" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-6 flex-1" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-6 flex-1" />
                    </TableCell>
                </TableRow>
            ))}
        </>
    );

    if (error) {
        return (
            <Card className={className}>
                <CardContent className="p-6">
                    <div className="text-center">
                        <p className="text-destructive mb-4">Error loading pools: {error}</p>
                        <Button onClick={loadPools} variant="outline">
                            Retry
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card className={className}>
                <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                        <CardTitle className="flex items-center gap-2">Pools</CardTitle>
                        <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{filteredPools.length} pools</span>
                        </div>
                    </div>

                    <Tabs value={selectedCategory} onValueChange={(value) => handleCategoryChange(value as PoolCategory)} className="w-full tab-container">
                        <TabsList className="grid w-full grid-cols-3 bg-muted/50 h-10 rounded-md">
                            {POOL_CATEGORIES.map((category) => (
                                <TabsTrigger
                                    key={category}
                                    value={category}
                                    title={category === "Yield Aggregator" && !isConnected ? "Connect Wallet to Access!!" : category}
                                    className={`text-sm shadow-none font-medium transition-all duration-200 rounded-sm ${category === "Yield Aggregator" && !isConnected ? "disabled:pointer-events-auto disabled:cursor-not-allowed" : ""}`}
                                    // disabled={category === 'Yield Aggregator' && !isConnected}
                                >
                                    {category === "Yield Aggregator" && !isConnected && <Lock className="h-3 w-3 mr-1" />}
                                    {category.replace(" ", " ")}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
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
                            <TableBody>{loading ? renderLoadingSkeleton() : filteredPools.map(renderPoolRow)}</TableBody>
                        </Table>
                    </div>

                    {!loading && filteredPools.length === 0 && <div className="text-center py-8 text-muted-foreground">No pools found for the selected category.</div>}
                </CardContent>
            </Card>

            <AlertDialog open={showLockDialog} onOpenChange={setShowLockDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5" />
                            Connect Wallet Required
                        </AlertDialogTitle>
                        <AlertDialogDescription>Yield Aggregator pools are locked until you connect a crypto wallet. Please connect your wallet to access these investment opportunities.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Close</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
