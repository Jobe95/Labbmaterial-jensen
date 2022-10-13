import { useRouter } from 'next/router';

const ArticlesSlug = () => {
  const router = useRouter();

  console.log(router.query.slug);
  return <div>We dont know Page</div>;
};

export default ArticlesSlug;
