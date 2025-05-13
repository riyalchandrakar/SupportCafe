'use client'
import Link from "next/link";
import HashLoader from "react-spinners/HashLoader";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-900 to-indigo-800">
        <HashLoader color="#d8b4fe" loading={loading} size={50} />
      </div>
    );
  }

  const features = [
    {
      icon: "/icons/man.gif",
      title: "Fans want to help",
      description: "Your fans are eager to support your creative journey"
    },
    {
      icon: "/icons/coin.gif",
      title: "Easy Payments",
      description: "Simple and secure payment system"
    },
    {
      icon: "/icons/group.gif",
      title: "Community Support",
      description: "Build a supportive community around your work"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white">
      {/* Hero Section */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center gap-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
              Buy Me a Coffee
              <span className="ml-4 inline-block">
                <Image 
                  src="/icons/tea.gif" 
                  width={80} 
                  height={80} 
                  alt="Tea cup animation" 
                  className="rounded-full border-2 border-purple-300 shadow-lg"
                />
              </span>
            </h1>
            <p className="text-lg md:text-xl text-purple-100 max-w-2xl">
              A crowdfunding platform where creators get funded by their fans and followers.
              Turn your passion into reality with community support.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link href="/login" className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl">
                Start Your Journey
              </Link>
              <Link href="/read-more" className="px-8 py-3 rounded-full bg-transparent border-2 border-purple-400 text-purple-100 font-medium hover:bg-purple-800/30 transition-all">
                Learn More
              </Link>
            </div>
            <Link href="/profiles" className="mt-4 px-6 py-2 rounded-full bg-indigo-700/50 hover:bg-indigo-700 transition text-sm font-medium">
              Explore Fund Raisers →
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent" />

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
              Why Creators Love Us
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gradient-to-b from-purple-800/30 to-indigo-800/30 p-6 rounded-xl backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/40 transition-all hover:shadow-lg hover:shadow-purple-500/10"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-2 bg-purple-500/20 rounded-full">
                    <Image 
                      src={feature.icon} 
                      width={80} 
                      height={80} 
                      alt={feature.title}
                      className="rounded-full"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-purple-100">{feature.title}</h3>
                  <p className="text-purple-200">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent" />

      {/* Video Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
              See How It Works
            </span>
          </h2>
          <div className="aspect-w-16 aspect-h-9 bg-purple-900/50 rounded-xl overflow-hidden border border-purple-500/30 shadow-xl">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/qaTB_u1THVs?si=mCpcEpb4arO6xG85"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </div>
  );
}