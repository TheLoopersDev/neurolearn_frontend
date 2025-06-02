import Image from 'next/image';

export default function OverView() {
  return (
    <div className="max-w-full p-4 bg-white rounded-2xl shadow-md border border-gray-200 mx-auto w-[395px]">
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-xl font-semibold text-black">Overview</h2>
      </div>
      <h2 className="text-2xl font-bold text-black mb-4">
        Graphic Design Mastercla - Learn GREAT Design
      </h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          'Typography',
          'Logo & Branding',
          'AI Tools',
          'Illustration',
          'InDesign',
          'Photo Editing',
        ].map((tag, idx) => (
          <span
            key={idx}
            className="bg-[#3858F8] text-white text-xs px-3 py-1 rounded-full whitespace-nowrap"
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="text-sm text-gray-700 mb-4">
        A comprehensive design course with 6 key learning areas: Graphic Design, Photo & Video
        Editing, UI/UX & Web Design, Creative Skills, Trends & Tools, and 3D & Motion — equipping
        learners with essential skills, creative thinking, and modern tools to thrive in the digital
        design industry.
      </p>
      <div className="text-black font-bold text-xl">The course will have stages:</div>
      <div className="space-y-4 mt-4 ">
        <div className="flex items-center text-sm text-black gap-3">
          <Image src="/assets/icons/number-1.svg" alt="Star Icon" width={20} height={20} />
          Model Detailing
        </div>
        <div className="flex items-center text-sm text-black gap-3">
          <Image src="/assets/icons/number-2.svg" alt="Star Icon" width={20} height={20} />
          Basics of Working in Blender
        </div>
        <div className="flex items-center text-sm text-black gap-3">
          <Image src="/assets/icons/number-3.svg" alt="Star Icon" width={20} height={20} />
          Learning Lighting Techniques
        </div>
        <div className="flex items-center text-sm text-black gap-3">
          <Image src="/assets/icons/number-4.svg" alt="Star Icon" width={20} height={20} />
          Creating Animations
        </div>
        <div className="flex items-center text-sm text-black gap-3">
          <Image src="/assets/icons/number-5.svg" alt="Star Icon" width={20} height={20} />
          Applying Textures
        </div>
      </div>
    </div>
  );
}
