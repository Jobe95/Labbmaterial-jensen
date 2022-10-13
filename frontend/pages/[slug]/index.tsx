import { useRouter } from 'next/router';

const ArticlesSlug = () => {
  const router = useRouter();

  console.log(router.query.slug);
  return <div>We dont know Page nested 1</div>;
};

export default ArticlesSlug;
