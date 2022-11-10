import React, { useEffect, useState } from 'react';
import { createRecipe, getRecipes } from '../lib/api/api';
import { RecipeModel } from '../lib/models';
import styles from '../styles/pages/Home.module.scss';

const Recipes = () => {
  const [recipes, setRecipes] = useState<RecipeModel[]>([]);
  const [counter, setCounter] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const { data } = await getRecipes();
        console.log(data);
        setErrorMessage('');
        setRecipes(data);
      } catch (err: any) {
        setErrorMessage(err?.response?.statusText);
      }
    };
    fetchRecipes();
  }, []);

  const nextRecipe = () => {
    if (counter + 1 >= recipes.length) {
      setCounter(0);
    } else {
      setCounter(counter + 1);
    }
  };

  const openModal = () => {
    const modalElement = document.getElementById('modal') as HTMLElement;
    if (modalElement.classList.contains(styles.active)) {
      modalElement.classList.remove(styles.active);
    } else {
      modalElement.classList.add(styles.active);
    }
  };

  const closeModal = () => {
    const modalElement = document.getElementById('modal') as HTMLElement;
    if (modalElement.classList.contains(styles.active)) {
      modalElement.classList.remove(styles.active);
    }
  };

  const submitRecipe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { recipeName, recipeLink } = document.forms[0];

    if (!recipeName.value || !recipeLink.value) {
      return;
    }

    try {
      const { data } = await createRecipe(recipeName.value, recipeLink.value);
      setRecipes([...recipes, data]);
      closeModal();
    } catch (err) {
      alert('Något gick fel försök igen');
    }
  };

  const FabButton = () => (
    <div onClick={openModal} className={styles.fab}>
      &#xFF0B;
    </div>
  );

  const Modal = () => (
    <div id="modal" className={styles.modalContainer}>
      <form onSubmit={submitRecipe} className={styles.modal}>
        <label>Vad heter din måltid?</label>
        <input
          name="recipeName"
          type="text"
          placeholder="Min Lasagne"
          required
        />
        <label>Länk till recept</label>
        <input
          name="recipeLink"
          type="url"
          placeholder="https://example.com"
          pattern="https://.*"
          required
        />
        <input type="submit" className={styles.btn} value="Lägg upp recept" />
      </form>
    </div>
  );

  const OutlineButton = () => (
    <div onClick={nextRecipe} className={styles.btn}>
      Kom med något nytt föfan!
    </div>
  );

  return (
    <div
      style={{
        backgroundImage: `url(https://img.rawpixel.com/private/static/images/website/2022-05/upwk61661577-wikimedia-image-kowapeej.jpg?w=800&dpr=1&fit=default&crop=default&q=65&vib=3&con=3&usm=15&bg=F4F4F3&ixlib=js-2.2.1&s=14769aec7c86811c0c7e4eb29fa4a76e)`,
      }}
      className={styles.main}
    >
      <div id="gradient" onClick={closeModal} className={styles.gradient}>
        <div className={styles.card}>
          <h2>
            {recipes.length > 0
              ? 'Du kan väl för fan laga lite'
              : 'Finns tyvärr inga recept, skapa föfan!'}
          </h2>
          {recipes.length > 0 && (
            <a
              className={styles.link}
              href={recipes[counter].link}
              target="_blank"
              rel="noreferrer"
            >
              {recipes[counter]?.title}
            </a>
          )}
        </div>
        {recipes.length > 0 && <OutlineButton />}
      </div>
      <FabButton />
      <Modal />
    </div>
  );
};

export default Recipes;
