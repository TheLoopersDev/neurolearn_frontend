// src/components/QuestionEditor.tsx
import React from 'react';
// import { PlusIcon, TrashIcon } from './icons';

// Placeholder for icons
const MultipleChoiceTypeIcon = () => (
  <div className="w-6 h-6 relative">
    <div className="w-[15.50px] h-[15.50px] left-[7.25px] top-[1.25px] absolute bg-[#292D32]"></div>
    <div className="w-[15.50px] h-[15.50px] left-[1.25px] top-[7.25px] absolute bg-[#292D32]"></div>
  </div>
);
const SimpleAnswerTypeIcon = () => (
  <div className="w-6 h-6 relative">
    <div className="w-[17.50px] h-[18.09px] left-[3.25px] top-[1.43px] absolute bg-[#0D0D0D]"></div>
  </div>
);
const FreeAnswerTypeIcon = () => (
  <div className="w-6 h-6 relative">
    <div className="w-[21.50px] h-[21.50px] left-[1.25px] top-[1.25px] absolute bg-[#292D32]"></div>
  </div>
);
const ThreeDotsIcon = () => (
  <div className="w-6 h-6 relative">
    <div className="w-[5.50px] h-[5.50px] left-[2.25px] top-[9.25px] absolute bg-[#292D32]"></div>
    <div className="w-[5.50px] h-[5.50px] left-[16.25px] top-[9.25px] absolute bg-[#292D32]"></div>
    <div className="w-[5.50px] h-[5.50px] left-[9.25px] top-[9.25px] absolute bg-[#292D32]"></div>
  </div>
);
const PointsIcon = () => (
  <div className="w-6 h-6 relative">
    <div className="w-[18.76px] h-[21.51px] left-[2.62px] top-[1.25px] absolute bg-[#0D0D0D]"></div>
  </div>
);
const UploadIcon = () => (
  <div className="w-6 h-6 relative">
    <div className="w-[21.50px] h-[21.50px] left-[1.25px] top-[1.25px] absolute bg-[#6B6B6B]"></div>
    <div className="w-[5.50px] h-[5.50px] left-[6.25px] top-[5.25px] absolute bg-[#6B6B6B]"></div>
    <div className="w-[20.84px] h-[8.45px] left-[1.92px] top-[11.25px] absolute bg-[#6B6B6B]"></div>
  </div>
);

interface AnswerOptionProps {
  text: string;
  isCorrect?: boolean;
}

const AnswerOptionInput: React.FC<AnswerOptionProps & { onRemove: () => void }> = ({
  text,
  isCorrect,
  onRemove,
}) => (
  <div className="self-stretch justify-start items-center gap-4 inline-flex">
    <div
      className={`w-6 h-6 outline outline-[1.5px] -outline-offset-[0.75px] outline-[#3858F8] ${isCorrect ? 'bg-[#3858F8]' : ''} rounded-sm`}
    >
      {/* Intentionally empty or add a checkmark SVG here if correct */}
    </div>
    <div className="w-[624px] h-14 py-1 pl-12 pr-4 relative justify-start items-center gap-2.5 flex">
      <div className="w-full h-full p-1 left-0 top-0 absolute bg-[#F7F8FA] rounded-lg justify-start items-center gap-2.5 inline-flex">
        <div className="w-2 h-12 bg-[#812828] rounded-xl"></div>
      </div>
      <div className="w-[560px] h-12 justify-center flex flex-col text-[#6B6B6B] text-base font-medium font-['Inter'] leading-tight">
        {text}
      </div>
    </div>
    <div
      className="w-14 h-14 p-4 bg-[#F7F8FA] rounded-xl justify-start items-center gap-2.5 flex cursor-pointer"
      onClick={onRemove}
    >
      <button>trash</button>
    </div>
  </div>
);

const QuestionSettingsDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 p-4 bg-white rounded-xl justify-start items-center gap-2.5 inline-flex"
      >
        <ThreeDotsIcon />
      </button>
      {isOpen && (
        <div className="w-[174px] absolute right-0 mt-1 shadow-[0px_0px_12px_rgba(0,0,0,0.08)] flex-col justify-start items-start flex z-10">
          <div className="self-stretch h-14 px-4 py-[18px] bg-white rounded-t-xl justify-start items-center gap-2 inline-flex hover:bg-gray-100 cursor-pointer">
            <div className="w-6 h-6 relative">
              <div className="w-[15.50px] h-[15.50px] left-[7.25px] top-[1.25px] absolute bg-[#292D32]"></div>
              <div className="w-[15.50px] h-[15.50px] left-[1.25px] top-[7.25px] absolute bg-[#292D32]"></div>
            </div>{' '}
            {/* Duplicate Icon */}
            <div className="text-[#0D0D0D] text-base font-medium font-['Inter'] leading-tight">
              Duplicate
            </div>
          </div>
          <div className="w-[144px] h-0 mx-auto outline outline-1 outline-[#D9D9D9] -outline-offset-[0.5px]"></div>
          <div className="self-stretch h-14 px-4 py-[18px] bg-white rounded-b-xl justify-start items-center gap-2 inline-flex hover:bg-gray-100 cursor-pointer">
            {/* <TrashIcon colorClass="bg-[#292D32]" /> */}
            trash
            <div className="text-[#0D0D0D] text-base font-medium font-['Inter'] leading-tight">
              Delete
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const QuestionEditor: React.FC<{
  questionType: 'multiple-choice' | 'simple-answer' | 'free-answer';
}> = ({ questionType = 'multiple-choice' }) => {
  const [answers, setAnswers] = React.useState<AnswerOptionProps[]>([
    { text: 'Contrast', isCorrect: true },
    { text: 'Alignment' },
    { text: 'Repetition' },
    { text: 'Proximity' },
  ]);
  const [isMultipleAnswer, setIsMultipleAnswer] = React.useState(false);
  const [isAnswerWithImage, setIsAnswerWithImage] = React.useState(true);
  const [isRequired, setIsRequired] = React.useState(true);

  const questionText =
    "In visual design principles, which rule helps create a sense of movement and guides the viewer's eye?";

  const renderQuestionTypeSpecificFields = () => {
    switch (questionType) {
      case 'multiple-choice':
        return (
          <>
            <div className="justify-start items-center gap-3 inline-flex">
              <div className="w-16 text-[#0D0D0D] text-base font-medium font-['Inter'] leading-tight">
                Choices
              </div>
              <div className="w-5 h-0 origin-top-left rotate-90 outline outline-1 outline-black -outline-offset-[0.5px]"></div>
              <div className="justify-start items-center gap-6 flex">
                <div className="justify-start items-center gap-3 flex">
                  <div className="text-[#0D0D0D] text-base font-medium font-['Inter'] leading-tight">
                    Multiple answer
                  </div>
                  <button
                    onClick={() => setIsMultipleAnswer(!isMultipleAnswer)}
                    className={`w-12 h-6 p-0.5 rounded-full flex items-center transition-colors ${isMultipleAnswer ? 'bg-[#00CE9C] justify-end' : 'bg-[#D9D9D9] justify-start'}`}
                  >
                    <div className="w-5 h-5 bg-white rounded-full shadow"></div>
                  </button>
                </div>
                <div className="justify-start items-center gap-3 flex">
                  <div className="text-[#0D0D0D] text-base font-medium font-['Inter'] leading-tight">
                    Answer with image
                  </div>
                  <button
                    onClick={() => setIsAnswerWithImage(!isAnswerWithImage)}
                    className={`w-12 h-6 p-0.5 rounded-full flex items-center transition-colors ${isAnswerWithImage ? 'bg-[#00CE9C] justify-end' : 'bg-[#D9D9D9] justify-start'}`}
                  >
                    <div className="w-5 h-5 bg-white rounded-full shadow"></div>
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full flex-col justify-start items-start gap-3 inline-flex">
              {answers.map((ans, index) => (
                <AnswerOptionInput key={index} {...ans} onRemove={() => {}} />
              ))}
            </div>
            <div className="justify-start items-center gap-6 inline-flex">
              <button className="px-4 py-2 bg-[#F7F8FA] rounded-[44px] justify-start items-center gap-1 flex">
                plussss
                <div className="text-[#3858F8] text-base font-medium font-['Inter'] leading-tight pr-[52px]">
                  Add answer
                </div>
              </button>
            </div>
          </>
        );
      case 'simple-answer':
        return (
          <>
            <div className="self-stretch flex-col justify-start items-start gap-2 flex">
              <div className="self-stretch text-[#0D0D0D] text-base font-semibold font-['Inter'] leading-tight">
                Answer Option
              </div>
              <div className="self-stretch flex-col justify-start items-start gap-3 flex">
                <div className="self-stretch justify-start items-center gap-4 inline-flex">
                  <div className="w-full h-14 py-1 pl-8 pr-4 relative justify-start items-center gap-2.5 flex">
                    <div className="w-full h-full p-1 left-0 top-0 absolute bg-[#F7F8FA] rounded-lg justify-start items-center gap-2.5 inline-flex">
                      <div className="w-2 h-12 bg-[#D9D9D9] rounded-xl"></div>
                    </div>
                    <div className="w-[560px] h-12 justify-center flex flex-col text-[#6B6B6B] text-base font-medium font-['Inter'] leading-tight">
                      Type here
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 'free-answer':
        // Free answer usually doesn't have predefined answer input fields in this manner.
        // The question text area is primary.
        return null;
      default:
        return null;
    }
  };

  const getQuestionTypeIconAndLabel = () => {
    switch (questionType) {
      case 'multiple-choice':
        return { icon: <MultipleChoiceTypeIcon />, label: 'Multiple choice' };
      case 'simple-answer':
        return { icon: <SimpleAnswerTypeIcon />, label: 'Simple answer' };
      case 'free-answer':
        return { icon: <FreeAnswerTypeIcon />, label: 'Free answer' };
      default:
        return { icon: <MultipleChoiceTypeIcon />, label: 'Multiple choice' };
    }
  };
  const { icon: TypeIcon, label: TypeLabel } = getQuestionTypeIconAndLabel();

  return (
    <div className="w-[784px] flex-col justify-start items-start gap-6 inline-flex">
      {/* Question Block (dynamic based on selected question or a list) */}
      <div className="self-stretch min-h-[720px] p-6 bg-white rounded-[20px] flex-col justify-start items-start gap-2.5 flex">
        <div className="w-full h-full relative">
          <div className="w-full flex-col justify-start items-center inline-flex">
            <div className="self-stretch h-20 bg-[#F7F8FA] rounded-xl p-3">
              <div className="w-full flex-col justify-start items-end gap-1 flex">
                <div className="self-stretch justify-between items-center inline-flex">
                  <div className="px-2 py-2 bg-[#F7F8FA] rounded-[44px] justify-start items-center gap-2 flex">
                    {TypeIcon}
                    <div className="text-[#0D0D0D] text-base font-medium font-['Inter'] leading-tight">
                      {TypeLabel}
                    </div>
                  </div>
                  <div className="justify-start items-center gap-6 flex">
                    <div className="justify-start items-center gap-3 flex">
                      <div className="text-[#0D0D0D] text-base font-medium font-['Inter'] leading-tight">
                        Required
                      </div>
                      <button
                        onClick={() => setIsRequired(!isRequired)}
                        className={`w-12 h-6 p-0.5 rounded-full flex items-center transition-colors ${isRequired ? 'bg-[#00CE9C] justify-end' : 'bg-[#D9D9D9] justify-start'}`}
                      >
                        <div className="w-5 h-5 bg-white rounded-full shadow"></div>
                      </button>
                    </div>
                    <QuestionSettingsDropdown />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full mt-6 justify-start items-end gap-6 inline-flex">
            <div className="w-[512px] flex-col justify-start items-start gap-2 inline-flex">
              <div className="self-stretch text-[#0D0D0D] text-base font-semibold font-['Inter'] leading-tight">
                Question{' '}
                {questionType === 'simple-answer' ? 3 : questionType === 'free-answer' ? 4 : 1}{' '}
                {/* Example numbering */}
              </div>
              <div className="self-stretch h-36 p-3 bg-[#F7F8FA] rounded-[14px] justify-start items-start gap-3 inline-flex">
                <div className="w-[488px] text-[#0D0D0D] text-base font-medium font-['Inter'] leading-tight">
                  {questionText}
                </div>
              </div>
            </div>
            {questionType !== 'simple-answer' &&
              questionType !== 'free-answer' && ( // Image upload for multiple choice etc.
                <div className="w-[200px] h-36 px-[10px] py-[9px] relative bg-[#F7F8FA] rounded-[20px] flex flex-col justify-center items-center gap-2.5">
                  <div className="w-[180px] h-[124px] rounded-xl border border-dashed border-[#3858F8] flex flex-col justify-center items-center text-center">
                    <UploadIcon />
                    <div className="text-xs font-['Inter']">
                      <span className="text-[#6B6B6B]">Drag and drop or </span>
                      <span className="text-[#3858F8] font-medium">Choose File</span>
                      <span className="text-[#6B6B6B]">
                        {' '}
                        to upload
                        <br />
                        (10MB)
                      </span>
                    </div>
                  </div>
                </div>
              )}
          </div>

          <div className="mt-6 w-full flex-col justify-start items-start gap-3 inline-flex">
            {renderQuestionTypeSpecificFields()}
          </div>

          <div className="mt-6 w-[200px] px-4 py-2 bg-[#F7F8FA] rounded-[48px] flex-col justify-start items-start gap-2.5 inline-flex">
            <div className="w-[152px] justify-start items-center gap-3 inline-flex">
              <div className="w-[66px] justify-between items-center flex">
                <div className="w-[18px] h-5 text-[#0D0D0D] text-base font-medium font-['Inter'] leading-tight">
                  01
                </div>
                <div className="w-5 h-0 origin-top-left rotate-90 outline outline-1 outline-[#0D0D0D] -outline-offset-[0.5px]"></div>
              </div>
              <div className="text-[#0D0D0D] text-base font-medium font-['Inter'] leading-tight">
                Points
              </div>
              <PointsIcon />
            </div>
          </div>
        </div>
      </div>

      {/* Add more Question Blocks here for question 2, 3, 4 similarly if needed or make above dynamic */}

      <button className="px-6 py-4 bg-[#3858F8] rounded-[44px] justify-start items-center gap-1 inline-flex">
        {/* <PlusIcon colorClass="bg-white" /> */}
        pluss
        <div className="text-white text-xl font-medium font-['Inter'] leading-6">Add question</div>
      </button>
    </div>
  );
};
