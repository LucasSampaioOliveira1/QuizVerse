import { getUserProgress } from "@/db/queries";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { Header } from "./header";
import { redirect } from "next/navigation";


const HomePage = async () => {

    const userProgressData = getUserProgress();

    const [
        userProgress
    ] = await Promise.all([
        userProgressData
    ]);


    if (!userProgress || !userProgress.activeQuiz) {
        redirect("/quizes");
    }

    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">

            <StickyWrapper>
                <UserProgress 
                activeQuiz={{ title: "Países", imageSrc: "/brasil.svg"}}
                hearts={5}
                points={100}
                hasActiveSubscription={false}
                />
            </StickyWrapper>

            <FeedWrapper>
                <Header title="Países"/>
            </FeedWrapper>
        </div>
    );
};

export default HomePage;