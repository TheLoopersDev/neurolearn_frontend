'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, Star as StarFilled, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

type EvaluatePanelProps = Readonly < {
  courseId: string;
  reviews: {
    _id: string;
    rating: number;
    comment: string;
    user: {
      name: string;
      avatar?: {
        url?: string;
      };
    };
    createdAt?: string | Date;
  }[];
  onReviewAdded?: () => void; // callback để reload nếu cần
}>;

export default function EvaluatePanel({ courseId, reviews = [], onReviewAdded }: EvaluatePanelProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const MAX_LENGTH = 150;

  const handleSubmit = async () => {
    if (!selectedRating || comment.trim() === '') {
      toast({
        title: 'Validation Error',
        variant: 'destructive',
        description: 'Please provide a rating and a comment.',
      });
      return;
    }

    setLoading(true);

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/courses/add-review/${courseId}`,
        {
          rating: selectedRating,
          review: comment,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast({
          title: 'Success',
          variant: 'success',
          description: 'Review submitted successfully.',
        });
        setSelectedRating(null);
        setComment('');
        onReviewAdded?.();
      } else {
        toast({
          title: 'Failed',
          variant: 'destructive',
          description: 'Failed to submit review.',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: error?.response?.data?.message || 'Something went wrong.',
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="p-6 bg-white rounded-2xl shadow space-y-6">
      {/* Rating Input */}
      <div className="flex items-start gap-4">
        <Image
          src="/assets/images/avatar.png"
          alt="Avatar"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2 text-black text-sm font-medium">
            <span>Rate course:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={20}
                className={`cursor-pointer ${selectedRating && selectedRating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-black'
                  }`}
                onClick={() => setSelectedRating(star)}
              />
            ))}
          </div>

          <textarea
            rows={3}
            maxLength={MAX_LENGTH}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full bg-[#F7F8FA] rounded-2xl px-4 py-3 text-sm text-black outline-none placeholder-[#D9D9D9]"
          />
          <div className="text-right text-xs text-gray-400">
            {comment.length}/{MAX_LENGTH} characters
          </div>
          <div className="text-right">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-black text-white text-sm px-5 py-2 rounded-full hover:bg-gray-800 transition"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      </div>

      {/* Feedback header */}
      <div className="flex items-center justify-start gap-4">
        <h3 className="text-base text-black font-semibold">Customer Feedback</h3>
        <button className="flex items-center gap-2 bg-[#F7F8FA] text-base text-black px-3 py-1 rounded-full">
          Rating
          <ChevronDown size={20} className="text-[#0D0D0D]" />
        </button>
      </div>

      {/* Feedback list */}
      {Array.isArray(reviews) && reviews.length > 0 ? (
        reviews.map((fb) => (
          <div key={fb._id} className="flex items-start gap-3 p-4 bg-[#F9FAFB] rounded-xl">
            <Image
              src={fb.user.avatar?.url || '/public/assets/images/avatar.png'}
              alt="Avatar"
              width={36}
              height={36}
              className="rounded-full"
            />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <div className="text-sm text-black font-semibold">{fb.user.name}</div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarFilled
                      key={star}
                      size={16}
                      className={star <= fb.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : 'N/A'}
              </div>
              <p className="text-sm mt-1 text-black">{fb.comment}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No feedback yet.</p>
      )}
    </div>
  );
}
