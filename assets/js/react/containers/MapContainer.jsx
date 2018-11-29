import {connect} from 'react-redux';
import {fetchMapItemsResult, changeZoom, changeLocation} from './../actions/Map';
import BackgroundMap from '../components/appli/BackgroundMap';

//
//
// C O N T A I N E R  // C O N N E C T O R
//
//

const mapDispatchToProps = (dispatch) => {
  return {
    searchBounds: (criteria) => dispatch(fetchMapItemsResult(criteria)),
    setZoom: (zoom) => dispatch(changeZoom(zoom)),
    setLocation: (location) => dispatch(changeLocation(location))
  };
}

const mapStateToProps = (state) => {
  return {
    mapCenter: state.map.location,
    mapZoom: state.map.zoom,
    selectedEntry: state.quicksearch.entry,
    visibleEntries: state.map.visibleEntries
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BackgroundMap);
