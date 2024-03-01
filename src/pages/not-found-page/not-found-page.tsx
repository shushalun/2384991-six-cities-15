import { Link } from 'react-router-dom';

function NotFoundPage(): JSX.Element {
  const linkStyle = {
    color: '#4481c3',
    textDecoration: 'underline',
  };

  return(
    <main className="page__main page__main--index page__main--index-empty">
      <h1 className="visually-hidden">Page not found</h1>
      <div className="cities">
        <div className="cities__places-container cities__places-container--empty container">
          <section className="cities__no-places">
            <div className="cities__status-wrapper tabs__content">
              <b className="cities__status">404. Page not found</b>
              <p className="cities__status-description">
                Uh oh! Something went wrong. Go back to our <Link style={linkStyle} to="/">main page</Link>
              </p>
            </div>
          </section>
          <div className="cities__right-section" />
        </div>
      </div>
    </main>
  );
}

export default NotFoundPage;
