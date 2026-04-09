
"use client"

import Link from "next/link"

import { FiArrowLeft, FiHome, FiAlertTriangle } from "react-icons/fi"


export default function NotFound() {
  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground transition-colors duration-300">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto relative overflow-hidden bg-card border border-border rounded-2xl shadow-lg dark:shadow-2xl transition-all duration-300">
          {/* Decorative Gradients – theme-aware */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-linear-to-br from-primary/20 to-orange-400/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-linear-to-br from-orange-500/15 to-amber-500/10 rounded-full blur-3xl -z-10"></div>

          {/* Circuit-like Lines – subtle in both modes */}
          <div className="absolute inset-0 overflow-hidden opacity-10 dark:opacity-5">
            <div className="absolute top-1/4 left-0 w-full h-px bg-linear-to-br from-transparent via-primary/70 dark:via-primary/50 to-transparent animate-pulse"></div>
            <div
              className="absolute top-2/4 left-0 w-full h-px bg-linear-to-br from-transparent via-primary/70 dark:via-primary/50 to-transparent animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute top-3/4 left-0 w-full h-px bg-linear-to-br from-transparent via-primary/70 dark:via-primary/50 to-transparent animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
            <div
              className="absolute left-1/4 top-0 h-full w-px bg-linear-to-br from-transparent via-primary/70 dark:via-primary/50 to-transparent animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="absolute left-2/4 top-0 h-full w-px bg-linear-to-br from-transparent via-primary/70 dark:via-primary/50 to-transparent animate-pulse"
              style={{ animationDelay: "1.5s" }}
            ></div>
            <div
              className="absolute left-3/4 top-0 h-full w-px bg-linear-to-br from-transparent via-primary/60 dark:via-primary/40 to-transparent animate-pulse"
              style={{ animationDelay: "2.5s" }}
            ></div>
          </div>

          <div className="p-8 md:p-12 flex flex-col md:flex-row-reverse items-center">
            {/* Left Side - Message */}
            <div className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-xs font-medium mb-4 bg-primary/10 text-primary border border-primary/20">
                <FiAlertTriangle className="mr-2" />
                <span>Error 404</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                Page Not Found
              </h1>

              <p className="text-lg md:text-xl font-medium mb-2 text-primary">
                Oops! We couldn't find that page.
              </p>

              <p className="text-base mb-8 max-w-md text-muted-foreground">
                The page you’re looking for doesn’t exist or has been moved. Let’s get you back on track.
              </p>

                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
                <button
                  onClick={handleGoBack}
                  className="group relative flex items-center justify-center px-6 py-3 rounded-lg text-sm font-medium bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
                >
                  <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                  Go Back
                </button>

                <Link
                  href="/"
                  className="group relative flex items-center justify-center px-6 py-3 rounded-lg text-sm font-medium bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
                >
                  <FiHome className="mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Return to Homepage
                </Link>
              </div>
            </div>

            {/* Right Side - 404 Graphic */}
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center relative overflow-hidden">
                  {/* Animated Circles */}
                  <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-4 border-dashed animate-spin opacity-30 dark:opacity-25 border-primary" style={{ animationDuration: '8s' }}></div>
                    <div
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full border-4 border-dashed animate-spin opacity-20 dark:opacity-15 border-orange-500"
                      style={{
                        animationDirection: "reverse",
                        animationDuration: "30s",
                      }}
                    ></div>
                  </div>

                  <div className="relative z-10 text-center">
                    <div className="text-9xl font-black text-transparent bg-clip-text bg-linear-to-br from-primary to-orange-400">
                      404
                    </div>
                    <div className="mt-4 flex justify-center text-primary">
                      <FiAlertTriangle size={48} className="animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
