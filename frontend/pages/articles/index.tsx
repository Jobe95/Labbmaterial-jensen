import { GetServerSideProps, GetStaticProps } from 'next';
import { useRouter } from 'next/router';

type User = {
  username: String;
  lastname: String;
};

type Props = {
  header: String;
  user: User;
};

export default function Articles({ header, user }: Props) {
  console.log(header);
  console.log(user);
  const router = useRouter();
  return <div>Articles Page</div>;
}

export const getServerSideProps: GetServerSideProps = async () => {
  // Here we can do API Requests

  // Long time call
  let data: User = {
    username: 'Jonatan',
    lastname: 'Bengtsson',
  };
  return {
    props: {
      header: 'Hejsan',
      user: data,
    },
  };
};
