import Image from 'next/image';

export default function PublisherCard() {
  return (
    <div className="max-w-full w-[395px] p-4 bg-white rounded-2xl shadow-md border border-gray-200 mx-auto">
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-xl font-semibold text-black">Publisher</h2>
        <a href="#" className="text-sm text-[#3858F8]">
          View profile
        </a>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 relative">
          <Image
            src="/assets/images/avatar.png"
            alt="Avatar"
            fill
            className="rounded-full border border-gray-300 object-cover"
          />
        </div>
        <div>
          <p className="font-semibold text-gray-800 leading-tight">Đào Tuấn Kiệt</p>
          <p className="text-xs text-gray-500">Instructional Expert</p>
        </div>
      </div>
      <p className="text-sm text-gray-700 mb-4">
        Hey! My name is Kiet, I’m 26 and I’m a freelance 2D Artist with around four years of
        experience
      </p>
      <div className="space-y-2 ">
        <div className="flex items-center text-sm text-black gap-3">
          <Image src="/assets/icons/blue-star.svg" alt="Star Icon" width={20} height={20} />
          4.8 Instructor rating
        </div>
        <div className="flex items-center text-sm text-black gap-3">
          <Image src="/assets/icons/blue-completion.svg" alt="Star Icon" width={20} height={20} />{' '}
          889 Reviews
        </div>
        <div className="flex items-center text-sm text-black gap-3">
          <Image src="/assets/icons/people.svg" alt="Star Icon" width={20} height={20} /> 4,886
          Students
        </div>
        <div className="flex items-center text-sm text-black gap-3">
          <Image src="/assets/icons/blue-play.svg" alt="Star Icon" width={20} height={20} /> 8
          Courses
        </div>
      </div>
    </div>
  );
}
