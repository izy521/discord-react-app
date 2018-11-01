import React from 'react';
import crypto from 'crypto';
import './Modal.css';

class DiscordModal extends React.Component {
	constructor(props) {
		super(props);
		var localStorageState;

		try {
			localStorageState = JSON.parse(localStorage.previousState);
		} catch (e) { localStorage.removeItem('previousState'); }

		this.state = localStorageState ? localStorageState : {
			openTabs: [],
			/*Wanted to use Object and Keys for O(1)
			but mixing that with React's templating
			and matching sounds like it might be
			trouble*/
			activeTab: {key: null, text: null}
		};
		this.props.updateTabNumber(this.state.openTabs.length);
	}
  
	closeModal() {
		const modal = document.getElementsByClassName('Modal')[0];
		modal.classList.remove('Modal-visible');
	}

	addTab() {
		const key = generateID(null);
		const newTab = {key, text: null};
		this.setState(function(prevState) {
			prevState.openTabs.push(newTab);
			localStorage.setItem('previousState', JSON.stringify(this.state));
			this.props.updateTabNumber(this.state.openTabs.length);
			return prevState;
		});
	}

	closeTab(key) {
		/*part of the reason I wanted to use O(1)
		I'm sure there's a much better way for all
		of this...*/
		this.setState(function(prevState) {
			const tab = prevState.openTabs.find( oTab => oTab.key === key );
			prevState.openTabs.splice(prevState.openTabs.indexOf(tab), 1);
			prevState.activeTab = {key: null, text: null};
			localStorage.setItem('previousState', JSON.stringify(prevState));
			this.props.updateTabNumber(this.state.openTabs.length);
			return prevState;
		});
	}

	onTabClick(key, event) {
		if (!event.target.classList.contains('Modal-tab')) return;
		
		Array.prototype.forEach.call(
			event.target.parentElement.children,
			function(element) {
				if (!element.classList.contains('Modal-tab')) return;
				element.classList.remove('Modal-tab-selected');
			}
		)
		event.target.classList.add('Modal-tab-selected');

		const tab = this.state.openTabs.find(function(oTab) {
			return oTab.key === key;
		});
		this.setState(function(prevState) {
			prevState.activeTab = tab;
			localStorage.setItem('previousState', JSON.stringify(prevState));
			return prevState;
		});
	}

	saveData(event) {
		const userInput = event.target.value;
		this.setState(function(prevState) {
			updateTab(prevState.openTabs, prevState.activeTab.key, userInput);
			localStorage.setItem('previousState', JSON.stringify(prevState));
			return prevState;
		});
	}
  
	render() {
		return(
			<div className='Modal'>
				<div className='Modal-content-container'>
					<div className='Modal-tab-bar'>
						{ this.state.openTabs.map( tab => 
							<ModalTab 
								text={tab.text} 
								onCloseButtonClick={this.closeTab.bind(this, tab.key)} 
								onTabClick={this.onTabClick.bind(this, tab.key)} 
								key={tab.key} 
							/> )}
						<button 
							onClick={this.addTab.bind(this)} 
							className='Modal-tab-add-button'>+</button>
					</div>
					<textarea 
						disabled={!this.state.activeTab.key}
						value={
							this.state.activeTab.text !== null ?
								this.state.activeTab.text : ""
						}
						onChange={this.saveData.bind(this)}
						className='Modal-content-area'></textarea>

					<button onClick={this.closeModal.bind(this)}
						className='Modal-close-button'>x</button>
				</div>
			</div>
		);
	}
}

class ModalTab extends React.Component {
	render() {
		return(
			<div onClick={this.props.onTabClick} className='Modal-tab'>
				<button onClick={this.props.onCloseButtonClick} className='Modal-tab-close-button'>x</button>
				<span className='Modal-tab-preview'>{this.props.text && this.props.text.slice(0, 15)}</span>
			</div>
		);
	}
}

function generateID(last) {
	const id = crypto.randomBytes( 3 * 4 ).toString('base64');
	if (last === id) return generateID(id);
	return id;
}

function updateTab(tabArray, tabKey, text) {
	var tab = tabArray.find( oTab => oTab.key === tabKey );
	tab.text = text;
}

export default DiscordModal;