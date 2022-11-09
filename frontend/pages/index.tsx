import React, { useEffect, useState } from 'react';
import { getRecipes } from '../lib/api/api';
import styles from '../styles/pages/Home.module.scss';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    try {
      const fetchRecipes = async () => {
        const { data } = await getRecipes();
        console.log(data);
        setErrorMessage('');
        setRecipes(data);
      };

      fetchRecipes();
    } catch (err: any) {
      console.log(err.response);
      setErrorMessage(err.response.statusText);
    }
  }, []);

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (
    <div>
      <div className={styles.main}>
        {`Number of recipes added: ${recipes?.length}`}
      </div>
    </div>
  );
};

export default Recipes;
