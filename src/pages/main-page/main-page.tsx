import { Helmet } from 'react-helmet-async';
import { Offer, SortingOption } from '../../types/types.ts';
import { CITY_LOCATIONS } from '../../const.ts';
import { useAppDispatch, useAppSelector } from '../../hooks/index.ts';
import { setCity, setActiveOffer, setSortingOption } from '../../store/action.ts';
import { selectActiveOffer, selectCity, selectOffers, selectSortingOption, selectAuthorizationStatus, selectOffersDataLoading } from '../../store/selectors.ts';
import HotelList from '../../components/blocks/hotel-list/hotel-list.tsx';
import LocationList from '../../components/blocks/location-list/location-list.tsx';
import Map from '../../components/ui/map/map.tsx';
import SortingForm from '../../components/blocks/sorting-form/sorting-form.tsx';
import { AuthorizationStatus } from '../../const.ts';
import Spinner from '../../components/ui/spinner/spinner.tsx';

function MainPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const selectedCity = useAppSelector(selectCity);
  const offers = useAppSelector(selectOffers);
  const activeOffer = useAppSelector(selectActiveOffer);
  const selectedSortingOption = useAppSelector(selectSortingOption);

  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const isOffersDataLoading = useAppSelector(selectOffersDataLoading);

  if (authorizationStatus === AuthorizationStatus.Unknown || isOffersDataLoading) {
    return (
      <Spinner />
    );
  }

  const getSortedOffersBy = (offersToSort: Offer[], sortingOption: string): Offer[] => {
    switch (sortingOption) {
      case 'Price: low to high':
        return [...offersToSort].sort((offerA, offerB) => offerA.price - offerB.price);
      case 'Price: high to low':
        return [...offersToSort].sort((offerA, offerB) => offerB.price - offerA.price);
      case 'Top rated first':
        return [...offersToSort].sort((offerA, offerB) => offerB.rating - offerA.rating);
      default:
        return offersToSort;
    }
  };

  const city = CITY_LOCATIONS.find((cityItem) => cityItem.name === selectedCity);

  if (!city) {
    return <div>City not found</div>;
  }


  const filteredOffers = offers.filter((offer) => offer.city.name === city.name);
  const sortedOffers = getSortedOffersBy(filteredOffers, selectedSortingOption);
  const placesTitle = filteredOffers.length === 1 ? 'place' : 'places';
  const isEmptyPage = filteredOffers.length === 0;

  const handleCityClick = (cityName: string) => {
    dispatch(setCity(cityName));
  };

  const handleHover = (offer?: Offer | null) => {
    dispatch(setActiveOffer(offer ?? null));
  };

  const handleOptionClick = (option: SortingOption) => dispatch(setSortingOption(option));

  return(
    <>
      <Helmet>
        <title>6 cities.</title>
      </Helmet>
      <main className={`page__main page__main--index ${isEmptyPage ? 'page__main--index-empty' : ''}`}>
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <section className="locations container">
            <LocationList selectedCity={selectedCity} onCityClick={handleCityClick}/>
          </section>
        </div>
        <div className="cities">
          <div className={`cities__places-container container ${isEmptyPage ? 'cities__places-container--empty' : ''}`}>
            {
              isEmptyPage ? (
                <>
                  <section className="cities__no-places">
                    <div className="cities__status-wrapper tabs__content">
                      <b className="cities__status">No places to stay available</b>
                      <p className="cities__status-description">
            We could not find any property available at the moment in {selectedCity}
                      </p>
                    </div>
                  </section>
                  <div className="cities__right-section"></div>
                </>
              ) : (
                <>
                  <section className="cities__places places">
                    <h2 className="visually-hidden">Places</h2>
                    <b className="places__found">{filteredOffers.length} {placesTitle} to stay in {selectedCity}</b>
                    <SortingForm width={7} height={4} currentOption={selectedSortingOption} onOptionClick={handleOptionClick}/>
                    <HotelList offers={sortedOffers} onHover={handleHover}/>
                  </section>
                  <div className="cities__right-section">
                    <Map city={city.location} offers={sortedOffers} activeOffer={activeOffer} />
                  </div>
                </>
              )
            }
          </div>
        </div>
      </main>
    </>
  );
}

export default MainPage;
