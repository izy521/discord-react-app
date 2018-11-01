import React from 'react';
import DiscordModal from './Modal.js';
import './App.css';


class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = { tabsOpen: 0 };
	}

	updateTabNumber(n) {
		this.setState({tabsOpen: n})
	}

	render() {
		return (
			<div className="App">
				<div className="App-flex-container">
					<DiscordAppHeader tabsOpen={this.state.tabsOpen}/>
					<DiscordModal updateTabNumber={this.updateTabNumber.bind(this)}/>
				</div>
			</div>
		);
	}
}

class DiscordAppHeader extends React.Component {
  handleClick() {
	const modal = document.getElementsByClassName('Modal')[0];
	modal.classList.add('Modal-visible');
  }

  render() {
	return(
	  <div className="App-button-counter">
		<button className="App-button" onClick={this.handleClick.bind(this)}>
		  Open
		</button>
		<div className="App-tab-counter">Number of tabs: {this.props.tabsOpen}</div>
	  </div>
	);
  }
}

export default App;
