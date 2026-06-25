
import Profile from '../src/components/profile/Profile';
import bgImage from '../src/assets/bgImage.svg';

type Props = {}

const Page = (props: Props) => {
    return (
        <div
            className=" bg-[#111827] text-white bg-cover bg-center flex items-center justify-center sm:justify-evenly max-sm:flex-col"
            style={{ backgroundImage: `url(${bgImage.src})` }}>
            <Profile />
        </div>
    )
}

export default Page;