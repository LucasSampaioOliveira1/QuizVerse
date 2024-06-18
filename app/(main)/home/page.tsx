import { getUserProgress, getUnits } from "@/db/queries";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { Header } from "./header";
import { redirect } from "next/navigation";


const HomePage = async () => {
    
    const userProgressData = getUserProgress();
    const unitsData = getUnits();

    const [
        userProgress,
        units,
    ] = await Promise.all([
        userProgressData,
        unitsData,
    ]);


    if (!userProgress || !userProgress.activeQuiz) {
        redirect("/quizes");
    }

    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">

            <StickyWrapper>
                <UserProgress 
                activeQuiz={userProgress.activeQuiz}
                hearts={userProgress.hearts}
                points={userProgress.points}
                hasActiveSubscription={false}
                />
            </StickyWrapper>

            <FeedWrapper>
                <Header title={userProgress.activeQuiz.title}/>
                {units.map((unit) => (
                    <div key={unit.id} className="mb-10">
                        {JSON.stringify(unit)}
                    </div>
                ))}
            </FeedWrapper>
        </div>
    );
};

export default HomePage;