"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { genre, mood, animeVerse, countrySongs, kids } from "../components/arrays";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface ChartItem {
    title: string;
    artist: string;
    image: string;
}
interface Artist {
    name: string;
    img: string;
}

export default function HomePage() {
    const [songs, setSongs] = useState<ChartItem[]>([]);
    const [artists, setArtists] = useState<Artist[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTopSongs() {
            try {
                const res = await fetch(`/api/Music/route?type=topSongs`);
                if (!res.ok) throw new Error("Failed to fetch songs");
                setSongs(await res.json());
            } catch (err: any) {
                setError(err.message);
            }
        }
        async function fetchTopArtists() {
            try {
                const res = await fetch(`/api/Music/route?type=trendingArtists`);
                if (!res.ok) throw new Error("Failed to fetch artists");
                const data = await res.json();
                setArtists(data.map((a: any) => ({ name: a.name, img: a.img })));
            } catch (err: any) {
                setError(err.message);
            }
        }
        fetchTopSongs();
        fetchTopArtists();
    }, []);

    const SectionWrapper = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <motion.section
            className="mb-10 px-3 sm:px-6 md:px-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-2xl md:text-3xl font-bold relative">
                    {title}
                    <span className="absolute left-0 -bottom-1 w-12 sm:w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></span>
                </h2>
                <Link
                    href={`/explore/${title.toLowerCase()}`}
                    className="text-xs sm:text-sm text-purple-400 hover:underline"
                >
                    See All →
                </Link>
            </div>
            {children}
        </motion.section>
    );

    const Card = ({ img, title, subtitle, rounded = "lg" }: any) => (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className={`bg-gradient-to-br from-gray-800 to-gray-900 shadow-md rounded-${rounded} p-2 sm:p-3 cursor-pointer`}
        >
            <img
                src={img}
                alt={title}
                className={`w-full h-32 sm:h-40 object-cover rounded-${rounded}`}
            />
            <h3 className="font-semibold mt-2 text-sm sm:text-base truncate text-white">{title}</h3>
            {subtitle && <p className="text-xs sm:text-sm text-gray-400 truncate">{subtitle}</p>}
        </motion.div>
    );

    if (error) return <h1 className="text-red-400 text-center">{error}</h1>;

    return (
        <div className="min-h-screen bg-[#111] text-white">
            <Header />
            <main className="max-w-screen-xl mx-auto py-6 sm:py-10">
                <h1 className="text-2xl sm:text-4xl font-extrabold mb-8 text-center px-3">🎶 Discover Music</h1>

                <SectionWrapper title="Top Songs">
                    <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4">
                        {/* Chunk songs into groups of 8 */}
                        {Array.from({ length: Math.ceil(songs.length / 9) }, (_, pageIndex) => {
                            const pageSongs = songs.slice(pageIndex * 9, pageIndex * 9 + 9);

                            return (
                                <div
                                    key={pageIndex}
                                    className="snap-start shrink-0 grid grid-cols-3 grid-rows-3 gap-4 w-[90vw] sm:w-[500px] md:w-[600px]"
                                >
                                    {pageSongs.map((song, i) => (
                                        <Link
                                            key={i}
                                            href={`/music/${encodeURIComponent(song.artist)}/song/${encodeURIComponent(song.title)}`}
                                        >
                                            <Card img={song.image} title={song.title} subtitle={song.artist} rounded="xl" />
                                        </Link>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
  

                <SectionWrapper title="Top Artists">
                    <div className="flex space-x-4 sm:space-x-6 overflow-x-auto pb-2 snap-x snap-mandatory">
                        {artists.map((a, i) => (
                            <Link key={i} href={`/music/${encodeURIComponent(a.name)}`}>
                                <motion.div
                                    whileHover={{ scale: 1.08 }}
                                    className="flex flex-col items-center bg-gray-800/40 p-3 sm:p-4 rounded-2xl shadow snap-start min-w-[120px] sm:min-w-[150px]"
                                >
                                    <img src={a.img} alt={a.name} className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover mb-2" />
                                    <p className="text-xs sm:text-sm text-white font-medium truncate">{a.name}</p>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </SectionWrapper>

                {/* Repeat same structure for Genres, Mood, AnimeVerse, Country Songs, Kids */}
                <SectionWrapper title="Genres">
                    <div className="grid grid-cols-6 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
                        {genre.map((g) => (
                            <Link key={g.id} href={g.link}>
                                <Card img={g.image} title={g.title} subtitle={g.text} rounded="2xl" />
                            </Link>
                        ))}
                    </div>
                </SectionWrapper>

                <SectionWrapper title="Mood">
                    <div className="grid grid-cols-6 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
                        {mood.map((m) => (
                            <Link key={m.id} href={m.link}>
                                <Card img={m.image} title={m.title} subtitle={m.text} rounded="2xl" />
                            </Link>
                        ))}
                    </div>
                </SectionWrapper>

                <SectionWrapper title="AnimeVerse">
                    <div className="grid grid-cols-6 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
                        {animeVerse.map((a) => (
                            <Link key={a.id} href={a.link}>
                                <Card img={a.image} title={a.title} subtitle={a.text} rounded="2xl" />
                            </Link>
                        ))}
                    </div>
                </SectionWrapper>

                <SectionWrapper title="Country Songs">
                    <div className="grid grid-cols-6 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
                        {countrySongs.map((c) => (
                            <Link key={c.id} href={c.link}>
                                <Card img={c.image} title={c.title} subtitle={c.text} rounded="2xl" />
                            </Link>
                        ))}
                    </div>
                </SectionWrapper>

                <SectionWrapper title="Kids">
                    <div className="grid grid-cols-6 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
                        {kids.map((k) => (
                            <Link key={k.id} href={k.link}>
                                <Card img={k.image} title={k.title} subtitle={k.text} rounded="2xl" />
                            </Link>
                        ))}
                    </div>
                </SectionWrapper>
            </main>
            <Footer />
        </div>
    );
}