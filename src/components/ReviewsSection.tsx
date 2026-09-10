import React from 'react';
import { GUEST_REVIEWS } from '../data/restaurantData';
import { Star, MessageSquareQuote, CheckCircle } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-24 bg-[#F3EDE2] border-b border-[#E3DACD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8DFC8] text-[#8C4318] text-xs font-semibold uppercase tracking-wider mb-3">
            <MessageSquareQuote className="w-3.5 h-3.5 text-[#C85227]" />
            <span>Austin Neighbors & Guests</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1A17] tracking-tight">
            Loved by the Community
          </h2>
          <p className="text-[#6E645A] text-base sm:text-lg mt-3">
            Real words from our regulars and weekend visitors at 2617 E 7th Street.
          </p>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {GUEST_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-[#FAF7F2] rounded-2xl p-7 border border-[#E3DACD] shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 text-[#D9822B] mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <blockquote className="text-[#382F28] text-sm sm:text-base leading-relaxed italic mb-6">
                  "{review.comment}"
                </blockquote>
              </div>

              <div className="pt-4 border-t border-[#E8DFC8] flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#1F1A17] flex items-center gap-1.5">
                    {review.author}
                    <CheckCircle className="w-3.5 h-3.5 text-[#2E5A44]" />
                  </h4>
                  <span className="text-xs text-[#8C7E72]">{review.location}</span>
                </div>
                <span className="text-[11px] font-semibold text-[#C85227] bg-[#F3EDE2] px-2.5 py-1 rounded-full border border-[#E3DACD]">
                  {review.dish}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Rating Summary Bar */}
        <div className="mt-12 text-center text-xs text-[#7D7166] flex items-center justify-center gap-3">
          <div className="flex items-center gap-1 text-[#D9822B]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-current" />
            ))}
          </div>
          <span>•</span>
          <span>Google Business Profile & In-House Austin Diner Verified</span>
        </div>

      </div>
    </section>
  );
};
