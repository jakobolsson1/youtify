import React from 'react';
import { connect } from 'react-redux';
import './Navbar.css';
import * as firebase from 'firebase';

import { Dropdown, Select } from 'semantic-ui-react';

import Login from '../Login/Login';
import Modal from '../Modal/Modal';

import * as AppActions from '../../Actions/AppActions';
import * as UserActions from '../../Actions/UserActions';
import * as YoutubeActions from '../../Actions/YoutubeActions';

class Navbar extends React.Component {
  constructor() {
    super();
    this.state = { query: '', showModal: false, value: 'videos' };
  }

  handleChange = ({ target }) => {
    this.setState({ query: target.value });
  }

  handleSelectChange = (event, { value }) => {
    this.setState({ value: value });
  }

  onSearch = (event) => {
    event.preventDefault();
    if(this.state.value==='videos'){
      this.props.history.push('search');
      this.props.dispatch(YoutubeActions.search(this.state.query));
      this.props.dispatch(AppActions.search(this.state.query));
    }
    else if(this.state.value==='playlists'){
      this.props.dispatch(AppActions.playlistSearch(this.state.query));
    }
  }

  showSignInModal = () => this.setState({ showModal: true });

  hideSignInModal = () => this.setState({ showModal: false });

  signOut = () => {
    this.props.dispatch(UserActions.signOut());
  }

  render() {
    const trigger = (
      <span>
        <i className="large user circle outline icon" size="big" /> {this.props.user.name}
      </span>
    );
    const options = [
      { key: 'videos', text: 'Videos', value: 'videos' },
      { key: 'playlists', text: 'Playlists', value: 'playlists' },
    ];
    return (
      <nav id="Navbar">
        <Modal
          title={'Sign in'}
          show={this.state.showModal}
          onHide={this.hideSignInModal}>
          <Login
            onSignIn={this.hideSignInModal} />
        </Modal>
        <div className="content">
          <form id="search" onSubmit={this.onSearch}>
            <div className="ui inverted left icon action input">
              <input type="text" placeholder="Search..." onChange={this.handleChange} value={this.state.query} />
              <i className="search icon" />
              <Select value={this.state.value} onChange={this.handleSelectChange} compact options={options} defaultValue={this.state.value} />
              <button className="ui button">Search</button>
            </div>
          </form>
          { this.props.user.uid ?
            <Dropdown trigger={trigger} pointing>
              <Dropdown.Menu>
                <Dropdown.Item
                  text="Settings" icon="settings" />
                <Dropdown.Item
                  text="Sign out" icon="sign out" onClick={this.signOut}/>
              </Dropdown.Menu>
            </Dropdown> :
            <button className="ui blue labeled icon button" onClick={this.showSignInModal}>
              <i className="sign in icon"></i>
              Sign in
            </button>
          }
        </div>
      </nav>
    )
  }
}

export default connect(store => {
  return {
    user: store.user,
    youtube: store.youtube
  }
})(Navbar);
