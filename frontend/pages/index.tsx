import { useRouter } from 'next/router';
import { useState } from 'react';

interface User {
  username?: String;
  age: number;
}

const Home = () => {
  const [user, setUser] = useState<User>({ age: 1 });

  console.log(user.username);

  const router = useRouter();
  return (
    <div>
      Home Page
      <div
        onClick={() => {
          router.replace('/articles');
        }}
      >
        MY BUTTON
      </div>
    </div>
  );
};

export default Home;
