"use client"

import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Grid from '@mui/material/Grid';
import {QueryClientProvider} from "@tanstack/react-query";
import {client} from "@/shared/lib/react-query";
import {ThemeProvider} from "@/context/ThemeContext";
import {ThemeToggle} from "@/components/theme/toogle";
import Avatar from "@/components/avatar";
import dynamic from "next/dynamic";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const Subscribes = dynamic(
        () => import('@/components/subscribes'),
        { ssr: false }
    );

    return (
        <QueryClientProvider client={client}>
            <ThemeProvider>
                <html lang="en">
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                <Grid container spacing={2}>
                    <Grid size={{sm: 0, md: 1, lg: 2, xl: 3}}/>
                    <Grid style={{margin: '20px 0'}} size={{sm: 12, md: 10, lg: 8, xl: 6}}>
                        <header>
                            <Subscribes /><ThemeToggle/> <Avatar/>
                        </header>
                        {children}
                    </Grid>
                    <Grid size={{sm: 0, md: 1, lg: 2, xl: 3}}/>
                </Grid>
                </body>
                </html>
            </ThemeProvider>
        </QueryClientProvider>
    );
}
