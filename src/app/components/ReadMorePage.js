'use client'
import Link from "next/link";
import HashLoader from "react-spinners/HashLoader";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function ReadMorePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-900 to-indigo-800">
        <HashLoader color="#d8b4fe" loading={loading} size={50} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto text-center mb-16">
        <div className="flex flex-col items-center justify-center gap-6">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
            About SupportCafe
            <span className="ml-4 inline-block">
              <Image 
                src="/icons/info.svg" 
                width={80} 
                height={80} 
                alt="Information animation" 
                className="rounded-full border-2 border-purple-300 shadow-lg"
              />
            </span>
          </h1>
          <p className="text-lg md:text-xl text-purple-100 max-w-3xl">
            Where creators meet supporters - powered by Stripe for seamless payments
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent max-w-7xl mx-auto mb-16" />

      {/* Content Sections */}
      <div className="max-w-4xl mx-auto space-y-16">
        <section className="bg-gradient-to-b from-purple-800/20 to-indigo-800/20 p-8 rounded-xl backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/40 transition-all">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200">
            Welcome to SupportCafe
          </h2>
          <p className="text-purple-100 leading-relaxed">
            SupportCafe is where creators connect directly with their supporters. Whether you're an artist, developer, or content creator, our platform makes it easy to receive financial support through secure Stripe payments. Sign in with Google or GitHub, set up your Stripe account, and start receiving support in minutes.
          </p>
        </section>

        <section className="bg-gradient-to-b from-purple-800/20 to-indigo-800/20 p-8 rounded-xl backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/40 transition-all">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200">
            Why Creators Love Us
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { 
                icon: "/icons/google-github.svg", 
                title: "Easy Login", 
                text: "Sign in instantly with Google or GitHub—no passwords to remember" 
              },
              { 
                icon: "/icons/stripe-pay.svg", 
                title: "Stripe Payments", 
                text: "Industry-standard payment processing with automatic payouts" 
              },
              { 
                icon: "/icons/user-default.svg", 
                title: "Beautiful Profiles", 
                text: "Showcase your work and payment options in one place" 
              },
              { 
                icon: "/icons/support.svg", 
                title: "Direct Support", 
                text: "Fans can support you with one-click payments" 
              }
            ].map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="bg-purple-500/20 p-2 rounded-full flex-shrink-0">
                  <Image 
                    src={feature.icon} 
                    width={48} 
                    height={48} 
                    alt={feature.title}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-50">{feature.title}</h3>
                  <p className="text-purple-100">{feature.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-b from-purple-800/20 to-indigo-800/20 p-8 rounded-xl backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/40 transition-all">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200">
            How It Works
          </h2>
          <div className="space-y-8">
            {[
              {
                icon: "/icons/login.gif",
                title: "1. Sign Up",
                description: "Login with your Google or GitHub account in seconds"
              },
              {
                icon: "/icons/stripe-setup.svg",
                title: "2. Connect Stripe",
                description: "Add your Stripe credentials to receive payments directly to your bank account"
              },
            
              {
                icon: "/icons/receive.svg",
                title: "3. Receive Support",
                description: "Share your profile link and let supporters contribute with one-click payments"
              }
            ].map((step, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-6 items-start">
                <div className="bg-purple-500/20 p-3 rounded-full">
                  <Image 
                    src={step.icon} 
                    width={64} 
                    height={64} 
                    alt={step.title}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-purple-50 mb-2">{step.title}</h3>
                  <p className="text-purple-100">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-b from-purple-800/20 to-indigo-800/20 p-8 rounded-xl backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/40 transition-all">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200">
            Stripe Integration
          </h2>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/3">
              <Image 
                src="/icons/stripe-secure.svg" 
                width={200} 
                height={200} 
                alt="Stripe security" 
                className="rounded-lg"
              />
            </div>
            <div className="md:w-2/3">
              <p className="text-purple-100 mb-4">
                We use Stripe to ensure secure, reliable payments with:
              </p>
              <ul className="list-disc list-inside space-y-2 text-purple-100 mb-6">
                <li>Direct deposits to your bank account</li>
                <li>PCI-compliant security</li>
                <li>Automatic payout scheduling</li>
                <li>Support for 135+ currencies</li>
              </ul>
              <div className="flex flex-wrap gap-4">
               
              </div>
            </div>
          </div>
        </section>

        <section className="text-center bg-gradient-to-b from-purple-800/20 to-indigo-800/20 p-8 rounded-xl backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/40 transition-all">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200">
            Ready to Start?
          </h2>
          <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already receiving support through SupportCafe. It takes just minutes to set up!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
           
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-16 pt-8 border-t border-purple-500/20 text-center">
        <p className="text-purple-300">
          <strong>SupportCafe</strong> - Fueling creativity, one payment at a time
        </p>
      </footer>
    </div>
  );
}