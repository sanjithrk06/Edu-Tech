import { Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../config/axios";

const Banner = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get("news");
        setNewsItems(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch news items:", error);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="relative isolate min-h-[7vh] sm:h-[7vh] flex items-center text-sm font-outfit overflow-hidden bg-secondary px-3 sm:px-6 py-3 sm:py-2.5">
      <style>
        {`
          .marquee-container {
            overflow: hidden;
            white-space: nowrap;
            display: flex;
            width: 100%;
          }
          .marquee-content {
            display: flex;
            gap: 8rem; /* Small gap between items */
            animation: marquee 120s linear infinite;
            animation-play-state: running;
          }
          .marquee-content.paused {
            animation-play-state: paused;
          }
          .news-item {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 1rem;
            flex-shrink: 0;
          }
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); } /* Move only half the width due to duplicated content */
          }
          @media (max-width: 640px) {
            .news-item {
              padding: 0 0.5rem;
            }
            .marquee-content {
              gap: 2rem; /* Smaller gap on mobile */
              animation: marquee 40s linear infinite;
            }
          }
        `}
      </style>
      <div className="flex flex-col sm:flex-row items-center gap-y-2 sm:gap-x-6 w-full sm:justify-between">
        {/* Contact info - hidden on mobile, shown on desktop */}
        <div className="hidden sm:block"></div>

        {/* News content - marquee style */}
        <div
          className="w-full sm:flex-1 marquee-container"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          role="region"
          aria-label="News ticker"
        >
          {newsItems.length > 0 ? (
            <div className={`marquee-content ${isPaused ? "paused" : ""}`}>
              {[...newsItems, ...newsItems, ...newsItems, ...newsItems].map(
                (item, index) => (
                  <div
                    key={index}
                    className="news-item text-cream leading-relaxed text-center"
                  >
                    <div
                      className="break-words whitespace-normal sm:whitespace-nowrap overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: item.content }}
                    />
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center px-4 text-center text-cream w-full">
              No news available
            </div>
          )}

          {/* Gradient overlays - reduced on mobile */}
          <div className="absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-secondary to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-secondary to-transparent pointer-events-none" />
        </div>

        {/* Contact info - shown at bottom on mobile, side on desktop */}
        <div className="flex flex-row sm:flex-wrap items-center gap-x-4 gap-y-2 flex-shrink-0 order-2 sm:order-none text-xs sm:text-sm">
          <a
            href="tel:9150521167"
            className="flex flex-row items-center gap-1 sm:gap-2 text-cream"
            aria-label="Call us at 9150521167"
          >
            <Phone className="text-cream w-3 h-3 sm:w-4 sm:h-4 font-bold" />
            <span className="sm:hidden">Call</span>
            <span className="hidden sm:inline">9150521167</span>
          </a>
          <div className="h-2 w-0.5 bg-cream" />
          <a
            href="mailto:info@innovstem.com"
            className="flex flex-row items-center gap-1 sm:gap-2 text-cream"
            aria-label="Email us at info@innovstem.com"
          >
            <Mail className="text-cream w-3 h-3 sm:w-4 sm:h-4 font-bold" />
            <span className="sm:hidden">Email</span>
            <span className="hidden sm:inline">info@innovstem.com</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Banner;
