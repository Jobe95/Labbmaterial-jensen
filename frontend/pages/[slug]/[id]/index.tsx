import { useRouter } from 'next/router';

const NestedSlug = () => {
  const router = useRouter();

  console.log(router.query);
  return <div>We dont know Page nested 2</div>;
};

export default NestedSlug;
