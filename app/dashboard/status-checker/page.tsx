"use client";
import Link from "next/link";
import {
    Home,
    LineChart,
    ListFilter,
    Package,
    Package2,
    PanelLeft,
    ShoppingCart,
    Users2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"; OnlineIndicator
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StartScraping from "@/components/chat/StartScraping";
import { StatusTable } from "@/components/chat/table/StatusTable";
import { columns } from "@/components/chat/table/Columns";
import { StatusObject, statuses as statusData } from "@/statusData";
import { useMemo, useState } from "react";
import ActivityMonitor from "@/components/chat/ActivityMonitor";
import OnlineIndicator from "@/components/effects/OnlineIndicator";
import { RESULTS_PER_PAGE } from "@/components/chat/config";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";

export default function Dashboard() {
    const [pageNo, setPageNo] = useState(1);
    const itemsPerPage = RESULTS_PER_PAGE;
    const startIndex = (pageNo - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const getLastStatusData = (data) => {
        const lastData = data[data.length - 1];
        return {
            ...lastData,
            firstSeen: lastData.firstSeen?.toString(),
        };
    };

    const lastStatusDataStringified = getLastStatusData(statusData);

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <div className="flex flex-col sm:gap-4 sm:py-4 ">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button size="icon" variant="outline" className="sm:hidden">
                                <PanelLeft className="h-5 w-5" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="sm:max-w-xs">
                            <nav className="grid gap-6 text-lg font-medium">
                                <Link
                                    href="#"
                                    className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                                >
                                    <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                                    <span className="sr-only">Acme Inc</span>
                                </Link>
                                <Link
                                    href="#"
                                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                >
                                    <Home className="h-5 w-5" />
                                    Dashboard
                                </Link>
                                <Link
                                    href="#"
                                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    Orders
                                </Link>
                                <Link
                                    href="#"
                                    className="flex items-center gap-4 px-2.5 text-foreground"
                                >
                                    <Package className="h-5 w-5" />
                                    Products
                                </Link>
                                <Link
                                    href="#"
                                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                >
                                    <Users2 className="h-5 w-5" />
                                    Customers
                                </Link>
                                <Link
                                    href="#"
                                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                >
                                    <LineChart className="h-5 w-5" />
                                    Settings
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </header>
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    <Tabs defaultValue="all">
                        <div className="flex items-center">
                            <TabsList>
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="active">Active</TabsTrigger>
                                <TabsTrigger value="draft">Draft</TabsTrigger>
                                <TabsTrigger value="archived" className="hidden sm:flex">
                                    Archived
                                </TabsTrigger>
                            </TabsList>
                            <div className="ml-auto flex items-center gap-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-8 gap-1">
                                            <ListFilter className="h-3.5 w-3.5" />
                                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                                Filter
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuCheckboxItem checked>
                                            Active
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem>
                                            Archived
                                        </DropdownMenuCheckboxItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <StartScraping />
                            </div>
                        </div>
                        <TabsContent value="all">
                            <Card x-chunk="dashboard-06-chunk-0">
                                <CardHeader>
                                    <CardTitle>
                                        <span className="text-3xl flex gap-2 relative">
                                            Activity monitor{" "}
                                            <Tooltip>
                                                <TooltipTrigger className="font-semi flex gap-2 items-center">
                                                    ({statusData.length})
                                                    <OnlineIndicator
                                                        size={4}
                                                        color={statusData[0].status === "Online" ? "emerald" : "red"}
                                                    />
                                                </TooltipTrigger>
                                            </Tooltip>
                                        </span>
                                    </CardTitle>
                                    <CardDescription>
                                        <ActivityMonitor StatusData={lastStatusDataStringified} />
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <StatusTable
                                        data={statusData}
                                        columns={columns}
                                        totalChecks={statusData.length}
                                        pageCount={Math.ceil(statusData.length / itemsPerPage)}
                                        pageNo={pageNo}
                                        searchKey={""}
                                        accessor={(row: StatusObject) => row.name}
                                    />
                                </CardContent>
                                <CardFooter>
                                    <div className="flex items-center gap-4">
                                        showing <strong>{startIndex + 1}</strong> to{" "}
                                        <strong>{endIndex}</strong> of{" "}
                                        <strong>{statusData.length}</strong> products
                                    </div>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </main>
            </div>
        </div>
    );
}
