import { FC } from "react";

import Stories from "../../components/stories";
import Posts from "../../components/posts";
import Share from "../../components/share";

const Home: FC = () => {
  return (
    <div className="home">
      <Stories />
      <Share />
      <Posts userId={undefined} />
    </div>
  );
};

export default Home;
