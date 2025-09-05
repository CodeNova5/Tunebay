"use client";

import React, { useState } from "react";

/**

Simple FAQ Page built with React + Tailwind CSS

You can drop this file into a Next.js 13 project as /app/faq/page.tsx */



const faqs = [ { question: "What is this website about?", answer: "This is a music website where you can explore, listen to, and discover new tracks, albums, and artists.", }, { question: "Do I need an account to listen to music?", answer: "You only need a Google account if you want to comment and display your name and profile image. Listening to music does not require an account.", }, { question: "Can I download songs from this website?", answer: "Yes, users are free to download songs in any way they like directly from the website.", }, { question: "Is this website free to use?", answer: "Yes, our core features are free. We may also offer premium plans for ad-free listening and exclusive content.", }, { question: "How can I contact support?", answer: "You can reach our support team via the Contact page or email us at support@example.com.", }, ];

function FAQItem({ question, answer }: { question: string; answer: string }) { const [open, setOpen] = useState(false);

return ( <div className="border-b py-4"> <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between text-left focus:outline-none" > <span className="text-lg font-medium">{question}</span> <span className="ml-2 text-gray-500">{open ? "-" : "+"}</span> </button> {open && <p className="mt-2 text-gray-600">{answer}</p>} </div> ); }

export default function FAQPage() { return ( <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"> <div className="mx-auto max-w-3xl bg-white p-8 rounded-2xl shadow"> <h1 className="text-3xl font-extrabold mb-6">Frequently Asked Questions</h1> <div> {faqs.map((faq, idx) => ( <FAQItem key={idx} question={faq.question} answer={faq.answer} /> ))} </div> </div> </main> ); }
