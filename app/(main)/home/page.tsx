import { getUserProgress, getUnits, getQuizProgress, getLessonPercentage } from "@/db/queries";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { Header } from "./header";
import { redirect } from "next/navigation";
import { Unit } from "./unit";
import { lessons, units as unitsSchema } from "@/db/schema";


const HomePage = async () => {
    
    const userProgressData = getUserProgress();
    const quizProgressData = getQuizProgress();
    const lessonPercentageData = getLessonPercentage();
    const unitsData = getUnits();

    const [
        userProgress,
        units,
        quizProgress,
        lessonPercentage,
    ] = await Promise.all([
        userProgressData,
        unitsData,
        quizProgressData,
        lessonPercentageData,
    ]);


    if (!userProgress || !userProgress.activeQuiz) {
        redirect("/quizes");
    }


    if (!quizProgress) {
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
                        <Unit 
                            id={unit.id}
                            order={unit.order}
                            description={unit.description}
                            title={unit.title}
                            lessons={unit.lessons}
                            activeLesson={quizProgress?.activeLesson as typeof lessons.$inferSelect & {
                                unit: typeof unitsSchema.$inferSelect;
                            } | undefined}
                            activeLessonPercentage={lessonPercentage}
                        />
                    </div>
                ))}
            </FeedWrapper>
        </div>
    );
};

export default HomePage;