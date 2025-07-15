import Image from 'next/image';
import { ILearner } from '@/types/leaner';
import CircularProgress from './CircularProgress';

interface LearnerRowProps {
  learner: ILearner;
  index: number;
}

const LearnerRow: React.FC<LearnerRowProps> = ({ learner, index }) => {
  return (
    <div className="grid grid-cols-12 gap-3 items-center">
      {/* Index and Full Name */}
      <div className="col-span-3 flex items-center gap-4">
        <span className="w-6 text-center text-md font-medium text-gray-900">{index}</span>
        <div className="flex items-center gap-3">
          <Image
            src={learner.avatar?.url || '/default-avatar.png'}
            alt={learner.name}
            width={48}
            height={48}
            className="rounded-full"
          />
          <div>
            <p className="font-semibold text-md text-black">{learner.name}</p>
            <p className="text-[10px] text-gray-600">{learner.email}</p>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="col-span-2">
        <div className="px-3 py-2 bg-gray-100 rounded-full inline-flex items-center justify-center gap-2 text-sm font-medium">
          {learner.status === 'Learning' && (
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
          )}
          <span className="text-gray-900">{learner.status}</span>
        </div>
      </div>

      {/* Last Opened Content */}
      <div
        className="col-span-3 text-sm font-medium text-gray-900"
        title={learner.lastOpenedContent}
      >
        {learner.lastOpenedContent.length > 20
          ? `${learner.lastOpenedContent.slice(0, 20)}...`
          : learner.lastOpenedContent}
      </div>

      {/* Enrollment Date */}
      <div className="col-span-2 text-[14px] font-medium text-gray-900 pl-2">
        {learner.enrollmentDate}
      </div>

      {/* Progress */}
      <div className="col-span-2 flex items-center   gap-3 pl-2">
        <CircularProgress value={learner.progress} />
        <span className="w-10  text-[14px] font-medium text-gray-900">{learner.progress}%</span>
      </div>
    </div>
  );
};

export default LearnerRow;
