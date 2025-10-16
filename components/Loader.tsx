"use client";
export default function Loader() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex space-x-1">
                <span className="w-2 h-6 bg-blue-500 animate-equalizer"></span>
                <span className="w-2 h-10 bg-blue-500 animate-equalizer delay-100"></span>
                <span className="w-2 h-8 bg-blue-500 animate-equalizer delay-200"></span>
                <span className="w-2 h-12 bg-blue-500 animate-equalizer delay-300"></span>
            </div>
        </div>
    );
}