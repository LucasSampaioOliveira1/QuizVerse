import { getQuizes } from "@/db/queries";
import { List } from "./list";


const QuizesPage = async () => {

    const quizes = await getQuizes();

    return ( 
        <div className="h-full max-w-[912px] px-3 mx-auto">
            <h1 className="text-2xl font-bold text-neutral-700">
                Divirta-se e Aprenda com nossos Quizes
            </h1>
            <List 
                quizes={quizes}
                activeQuizId={1}
            />
        </div>
     );
};
 
export default QuizesPage;