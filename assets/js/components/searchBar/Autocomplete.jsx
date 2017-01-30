import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import { showMarker } from './../../actions/Search';

import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import MapIcon from 'material-ui/svg-icons/maps/map';
import ExploreIcon from 'material-ui/svg-icons/action/explore';
import muiThemeable from 'material-ui/styles/muiThemeable';
import SearchIcon from 'material-ui/svg-icons/action/search';
import I18n from 'react-ghost-i18n';

//TODO: get grotto icons to a font
// import SvgIcon from 'material-ui/SvgIcon';
// const HomeIcon = (props) => (
//   <SvgIcon {...props}>
//     <rect x="0.5" y="0.5" fill="#FFFFFF" stroke="#1D1D1B" width="79.3" height="49"/>
//   </SvgIcon>
// );

class Autocomplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
    };
  }

  onNewRequest(chosenRequest, index) {
    if (chosenRequest.isMappable) {
        this.props.dispatch(showMarker(chosenRequest));
    }
    if (chosenRequest.id) {
      window.open('http://www.grottocenter.org/html/file_En.php?lang=En&check_lang_auto=false&category='+chosenRequest.category+'&id='+chosenRequest.id,'GrottoV2Window');
    }
  }

  isMappable(obj) { // TODO : move to models ?
    return obj.latitude && obj.longitude?true:false;
  }

  isCave(obj) {
    // TODO : better when it will be possible
    return obj.temperature;
  }

  isEntry(obj) {
    // TODO : better when it will be possible
    return obj.isSensitive !== undefined;
  }

  isGrotto(obj) {
    // TODO : better when it will be possible
    return obj.isOfficialPartner !== undefined;
  }

  foundDataToMenuItemMapping(item, i) {
    let primaryText = item.name;
    if (this.isEntry(item)) {
      primaryText+=' (' + item.region + ')';
    }

    let category ='entry';
    let icon = <ExploreIcon />;
    if (this.isCave(item)) {
      category = 'cave';
      icon = <MapIcon />;
    } else if (this.isGrotto(item)) {
      category = 'grotto';
    }

    return {
      id: item.id,
      text: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      altitude: item.altitude,
      author: item.author,
      category:category,
      isMappable:this.isMappable(item),
      value: (
        <MenuItem
          primaryText={primaryText}
          leftIcon={icon}
        />
      )
    };
  }
  onUpdateInput(searchText) {
    if (searchText.length < 3) {
      this.setState({
        dataSource: []
      });
      return;
    }
    $.ajax({
      url: '/search/findAll?name=' +searchText,//TODO: optimize this service for autocomplete
      dataType: 'json',
      success: function(data) {
        this.setState({
          dataSource: data.map(this.foundDataToMenuItemMapping.bind(this))
        });
      }.bind(this)
    });
  }

  render() {
    return (
      <div>
        <span className="searchIcon" style={{backgroundColor: this.props.muiTheme.palette.primary3Color}}>
          <SearchIcon color={this.props.muiTheme.palette.primary1Color} hoverColor={this.props.muiTheme.palette.accent1Color}/>
        </span>
        <AutoComplete
          className='searchAutoComplete'
          style={{backgroundColor: this.props.muiTheme.palette.primary3Color, fontFamily: this.props.muiTheme.fontFamily, width: 'calc(100% - 50px)', marginLeft: '50px'}}
          textFieldStyle={{padding: '0 10px', width: 'calc(100% - 40px)', whiteSpace: 'nowrap'}}
          floatingLabelText={<I18n>Search for a cave or an organization</I18n>}
          dataSource={this.state.dataSource}
          onUpdateInput={this.onUpdateInput.bind(this)}
          onNewRequest={this.onNewRequest.bind(this)}
          fullWidth={true}
          maxSearchResults={50}
          filter={AutoComplete.noFilter}
          popoverProps={{style: {height: '200px'}}}
        />
      </div>
    );
  }
}

Autocomplete.propTypes = {
  muiTheme: PropTypes.object.isRequired
};

Autocomplete = connect()(Autocomplete); // eslint-disable-line no-class-assign

export default muiThemeable()(Autocomplete);
