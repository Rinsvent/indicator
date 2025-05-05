"use client"

import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Grid from '@mui/material/Grid';
import {QueryClientProvider} from "@tanstack/react-query";
import {client} from "@/shared/lib/react-query";

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
    return (
        <QueryClientProvider client={client}>
            <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
            <Grid container spacing={2}>
                <Grid size={{sm: 0, md: 1, lg: 2, xl: 3}}/>
                <Grid size={{sm: 12, md: 10, lg: 8, xl: 6}}>
                    {children}
                </Grid>
                <Grid size={{sm: 0, md: 1, lg: 2, xl: 3}}/>
            </Grid>
            </body>
            </html>
        </QueryClientProvider>
    );
}
