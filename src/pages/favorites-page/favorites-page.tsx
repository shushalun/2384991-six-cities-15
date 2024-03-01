import Footer from '../../components/layout/footer/footer.tsx';
import FavoritePlacesList from '../../components/blocks/favorite-places-list/favorite-places-list.tsx';

function FavoritesPage(): JSX.Element {
  return(
    <>
      <main className="page__main page__main--favorites">
        <div className="page__favorites-container container">
          <section className="favorites">
            <h1 className="favorites__title">Saved listing</h1>
            <FavoritePlacesList />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default FavoritesPage;
