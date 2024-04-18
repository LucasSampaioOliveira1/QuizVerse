import { StickyWrapper } from "@/components/sticky-wrapper";
import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { Header } from "./header";
import { title } from "process";

const HomePage = () => {
    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">

            <StickyWrapper>
                <UserProgress 
                activeCourse={{ title: "Países", imageSrc: "/brasil.svg"}}
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