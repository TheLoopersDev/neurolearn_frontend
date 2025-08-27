'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SocialLinks } from '@/types/user';
import Arrow from '@/public/assets/home/Arrow.svg';
import Facebook from '@/public/assets/home/Facebook.svg';
import Linkedin from '@/public/assets/home/Linkedin.svg';
import Mail from '@/public/assets/home/Mail.svg';

interface ExpertCardProps {
  name: string;
  profession: string;
  description?: string;
  imageUrl: string;
  socialLinks?: SocialLinks;
  profileUrl?: string;
  isActive?: boolean;
  priorityImage?: boolean; // giữ để backward-compat
}

const ExpertCard = ({
  name,
  profession,
  description,
  imageUrl,
  socialLinks,
  profileUrl = '#',
  isActive = false,
}: ExpertCardProps) => {
  const AVATAR = 112;

  return (
    <div
      className={[
        // Kích thước/khung giữ nguyên
        'group relative w-full max-w-[419px] h-[320px] sm:h-[330px] md:h-[350px] rounded-xl sm:rounded-2xl p-4 sm:p-5 bg-white shadow-sm',
        'border transition-all duration-300 hover:shadow-lg hover:-translate-y-[2px]',
        isActive ? 'border-[#A18EFF]' : 'border-gray-100',
        'overflow-hidden', // cần cho hiệu ứng header
      ].join(' ')}
    >
      {/* Gradient header của Uiverse (mô phỏng ::before) */}
      <div
        className={[
          // trạng thái mặc định: dải ngang cao ~100px ở đỉnh
          'absolute left-1/2 -translate-x-1/2 top-0 w-[120%] h-[96px]',
          'rounded-t-xl sm:rounded-t-2xl border-b-[3px] border-white/80',
          'transition-all duration-300 ease-out',
          // gradient tương tự mẫu Uiverse nhưng blend màu theo brand card hiện tại
          'bg-[linear-gradient(40deg,rgba(161,142,255,1)_0%,rgba(255,104,68,1)_50%,rgba(251,191,36,1)_100%)]',
          // khi hover: nở thành vòng tròn lớn mờ phía sau avatar
          'group-hover:h-[340px] group-hover:w-[340px] group-hover:rounded-full group-hover:top-[-72px]',
          // nhẹ tay để không phá layout tổng
          'opacity-90',
        ].join(' ')}
        aria-hidden="true"
      />

      {/* Vòng ring bo viền (nhẹ) giữ nguyên style cũ */}
      <div className="pointer-events-none absolute inset-0 rounded-xl sm:rounded-2xl ring-1 ring-inset ring-transparent [background:linear-gradient(180deg,rgba(56,88,248,0.08),rgba(161,142,255,0.08))_border-box]" />

      {/* Header với avatar tròn */}
      <div className="w-full flex flex-col items-center relative z-[1]">
        <div className="relative">
          {/* glow nhẹ quanh avatar */}
          <div className="absolute inset-0 rounded-full blur-[8px] sm:blur-[10px] opacity-70 bg-[conic-gradient(from_180deg,rgba(56,88,248,0.25),rgba(161,142,255,0.25),rgba(56,88,248,0.25))]" />
          <div className="relative z-[1] h-[100px] w-[100px] sm:h-[110px] sm:w-[110px] md:h-[124px] md:w-[124px] rounded-full bg-white p-[4px] sm:p-[5px] md:p-[6px] transition-transform duration-300 group-hover:scale-[1.03]">
            <div className="h-full w-full rounded-full bg-gradient-to-tr from-[#A18EFF] to-[#3858F8] p-[1px] sm:p-[2px]">
              <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={name}
                  width={AVATAR}
                  height={AVATAR}
                  className="rounded-full object-cover w-full h-full"
                  sizes={`${AVATAR}px`}
                  quality={90}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tên & nghề nghiệp */}
        <div className="mt-3 sm:mt-4 text-center px-1 sm:px-2 transition-transform duration-300 group-hover:-translate-y-1">
          <h3
            className="text-[18px] sm:text-[19px] md:text-[20px] leading-[22px] sm:leading-[24px] md:leading-6 font-bold text-[#111827] truncate"
            title={name}
          >
            {name}
          </h3>
          <p
            className="mt-1 text-[13px] sm:text-[14px] leading-[18px] sm:leading-5 text-[#3858F8] font-medium truncate"
            title={profession}
          >
            {profession}
          </p>
        </div>
      </div>

      {/* Description (giữ chỗ cố định để không xê dịch layout) */}
      <div className="mt-2 sm:mt-3 px-1 relative z-[1]">
        <div className="text-[12px] sm:text-[13px] leading-[18px] sm:leading-5 text-[#6B6B6B] min-h-[50px] sm:min-h-[60px] transition-transform duration-300 group-hover:-translate-y-1">
          {description && description.trim() ? (
            <p className="line-clamp-3" title={description}>
              {description}
            </p>
          ) : (
            <div className="h-[50px] sm:h-[60px]" aria-hidden="true" />
          )}
        </div>
      </div>

      {/* Divider mềm */}
      <div className="mt-2 sm:mt-3 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent relative z-[1]" />

      {/* Social + CTA */}
      <div className="mt-2 sm:mt-3 flex items-center justify-between relative z-[1]">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href={socialLinks?.linkedin || '#'}
            target={socialLinks?.linkedin ? '_blank' : undefined}
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="group/link w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center ring-1 ring-inset ring-gray-200 hover:bg-[#EEF2FF] transition"
          >
            <Image src={Linkedin} alt="LinkedIn" width={14} height={14} className="sm:w-4 sm:h-4 opacity-90 group-hover/link:opacity-100" />
          </Link>
          <Link
            href={socialLinks?.facebook || '#'}
            target={socialLinks?.facebook ? '_blank' : undefined}
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="group/fb w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center ring-1 ring-inset ring-gray-200 hover:bg-[#EEF2FF] transition"
          >
            <Image src={Facebook} alt="Facebook" width={14} height={14} className="sm:w-4 sm:h-4 opacity-90 group-hover/fb:opacity-100" />
          </Link>
          <Link
            href={socialLinks?.email ? `mailto:${socialLinks.email}` : '#'}
            aria-label="Email"
            className="group/mail w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center ring-1 ring-inset ring-gray-200 hover:bg-[#EEF2FF] transition"
          >
            <Image src={Mail} alt="Email" width={14} height={14} className="sm:w-4 sm:h-4 opacity-90 group-hover/mail:opacity-100" />
          </Link>
        </div>

        <Link
          href={profileUrl}
          aria-label="View profile"
          className="group/cta w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full ring-1 ring-inset ring-gray-200 hover:ring-[#A18EFF] hover:bg-[#F5F3FF] transition"
        >
          <Image
            src={Arrow}
            alt="Arrow"
            width={32}
            height={32}
            className="w-6 h-6 sm:w-10 sm:h-10 transition-transform group-hover/cta:translate-x-0.5"
          />
        </Link>
      </div>
    </div>
  );
};

export default ExpertCard;
