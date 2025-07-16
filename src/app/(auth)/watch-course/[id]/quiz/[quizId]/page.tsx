'use client';

import { useParams } from 'next/navigation';
import KnowledgeCheckAssignment from '../KnowledgeCheckAssignment';

const QuizPage = () => {
    const params = useParams();
    const quizId = params?.quizId as string;

    return (
        <div className="w-full py-20">
            <div className="flex flex-col lg:flex-row gap-20 px-4 sm:px-6 lg:px-20">

                {quizId ? <KnowledgeCheckAssignment /> : <p>Loading quiz...</p>}
            </div>
        </div>

    );
};

export default QuizPage;
