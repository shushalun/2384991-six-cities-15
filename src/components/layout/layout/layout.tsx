import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../hooks/index.ts';
import { AppRoute, AuthorizationStatus } from '../../../const';
import { getLayoutState } from '../../../utils/layout-state';
import { selectAuthorizationStatus, selectFavoriteOffers, selectUser } from '../../../store/selectors';
import { fetchFavoriteOffers, logoutAction } from '../../../store/api-action.ts';
import Logo from '../../ui/logo/logo';
import Footer from '../footer/footer';


function Layout(): JSX.Element {
  const { pathname } = useLocation();
  const { rootClassName, linkClassName, shouldRenderUser } = getLayoutState(pathname as AppRoute);
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (authorizationStatus === AuthorizationStatus.Auth) {
      dispatch(fetchFavoriteOffers());
    }
  }, [dispatch, authorizationStatus]);

  const favoriteOffers = useAppSelector(selectFavoriteOffers);

  const handleLogout = () => {
    dispatch(logoutAction()).then(() => {
      if (pathname.toString() === AppRoute.Favorites.toString()) {
        navigate(AppRoute.Login);
      } else {
        navigate(pathname);
      }
    });
  };

  const userEmail = user ? user.email : '';

  return(
    <div className={rootClassName}>
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Link className={linkClassName} to={ AppRoute.Root }>
                <Logo width={81} height={41}/>
              </Link>
            </div>
            { shouldRenderUser ? (
              <nav className="header__nav">
                <ul className="header__nav-list">
                  <li className="header__nav-item user">
                    <Link className="header__nav-link header__nav-link--profile" to={ AppRoute.Favorites }>
                      { authorizationStatus === AuthorizationStatus.Auth ? (
                        <>
                          <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                          <span className="header__user-name user__name">
                            {userEmail}
                          </span>
                          <span className="header__favorite-count">{favoriteOffers.length}</span>
                        </>
                      ) : <span className="header__login">Sign in</span> }
                    </Link>
                  </li>
                  { authorizationStatus === AuthorizationStatus.Auth ? (
                    <li className="header__nav-item">
                      <button className="header__nav-link button" type="button" onClick={handleLogout}>
                        <span className="header__signout">Sign out</span>
                      </button>
                    </li>
                  ) : '' }
                </ul>
              </nav>
            ) : ''}
          </div>
        </div>
      </header>
      <Outlet />
      {pathname as AppRoute === AppRoute.Favorites && <Footer />}
    </div>
  );
}

export default Layout;

