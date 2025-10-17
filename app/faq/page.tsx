"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "What is this website about?",
    answer:
      "This is a music website where you can explore, listen to, and discover new tracks, albums, and artists.",
  },
  {
    question: "Do I need an account to listen to music?",
    answer:
      "You only need a Google account if you want to comment and display your name and profile image. Listening to music does not require an account.",
  },
  {
    question: "Can I download songs from this website?",
    answer:
      "Yes, users are free to download songs in any way they like directly from the website.",
  },
  {
    question: "Is this website free to use?",
    answer:
      "Yes, our core features are free. We may also offer premium plans for ad-free listening and exclusive content.",
  },
  {
    question: "How can I contact support?",
    answer:
      "You can reach our support team via the Contact page or email us at support@example.com.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b text-black last:border-none py-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left focus:outline-none hover:text-indigo-600 transition-colors"
      >
        <span className="text-lg font-semibold">{question}</span>
        {open ? (
          <ChevronUp className="h-5 w-5 text-indigo-600" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="mt-3 text-gray-600 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-lg border border-indigo-100">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-indigo-700">
          Frequently Asked Questions
        </h1>
        <div className="divide-y divide-gray-200">
          {faqs.map((faq, idx) => (
            <FAQItem key={idx} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </main>
  );
}
