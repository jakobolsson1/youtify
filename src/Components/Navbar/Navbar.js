import React from 'react';
import { connect } from 'react-redux';
import './Navbar.css';
import * as firebase from 'firebase';

import { Dropdown, Select, Input, Button } from 'semantic-ui-react';

import Login from '../Login/Login';
import Modal from '../Modal/Modal';

import * as AppActions from '../../Actions/AppActions';
import * as UserActions from '../../Actions/UserActions';
import * as YoutubeActions from '../../Actions/YoutubeActions';

class Navbar extends React.Component {
  constructor() {
    super();
    this.state = { query: '', showModal: false, type: 'videos' };
  }

  handleChange = ({ target }) => {
    this.setState({ query: target.value });
  }

  handleSelectChange = (event, { value }) => {
    this.setState({ type: value });
  }

  onSearch = (event) => {
    event.preventDefault();
    if (this.state.type === 'videos') {
      this.props.history.push(`/search#${this.state.query}`);
      this.props.dispatch(YoutubeActions.search(this.state.query));
    } else if (this.state.type === 'playlists') {
      this.props.history.push(`/playlistSearch#${this.state.query}`);
      this.props.dispatch(AppActions.playlistSearch(
        this.state.query,
        (res) => {
          console.log('res', res);
          this.props.dispatch(YoutubeActions.fetchSongDetails(
            res,
            (fullRes) => {
              console.log('fullRes', fullRes);
              this.props.dispatch(AppActions.setPlaylistSearchResults(fullRes))
            }
          ))
        }
      ));
    }
    else if (this.state.type === '/channel') {
      var query = this.state.hash.slice(0);
      this.props.dispatch(YoutubeActions.search(this.state.query));
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
              <Input type='text' placeholder='Search...' action className='left icon'
                onChange={this.handleChange} value={this.state.query}>
                <input />
                <i className="search icon"></i>
                <Select compact value={this.state.type}
                  onChange={this.handleSelectChange}
                  options={options} />
                <Button type='submit'>Search</Button>
              </Input>
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
    app: store.app,
    user: store.user,
    youtube: store.youtube
  }
})(Navbar);
