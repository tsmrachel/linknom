var App = React.createClass({
	
	render: function(){

		var statsData;

		if (this.state.hasStatsData) {
			statsData = <Stats data={this.state.statsData} />
		};

		return(
			<div>
			<Alert data={this.state.alertData} />
			<div>
			<input placeholder='Link' onChange={this.handleChange} value={this.state.value}/>
			<div className='button-container'>
			<button onClick={this.doShortenLink}>Nomnomnom</button>
			<button onClick={this.doDisplayStats}>Stats</button>
			</div>
			</div>
			<div>
			{statsData}
			</div>
			</div>
			)
	},

	handleChange : function(event){
		this.setState({value: event.target.value});
	},

	getInitialState : function(){
		return {
			value : '',
			hasStatsData : false,
			statsData : '',
			alertData : ' '
		}
	},


	doShortenLink : function(){

		var url = this.state.value;

		console.log('input: ' + url);

		// to do : check for empty space in between

		var that = this;
		
		if (url){

			url = url.trim();

			// handle ajax error

			$.get(host+'api/shorten',{url:this.state.value})

			.done(function(data){

				that.setState({hasStatsData : false });

				console.log(data);

				that.replaceState({alertData : "Done! Your link has been nommed!"});

				that.setState({value : data.shorturl});

			})

			.fail(function(data){


				if(data.responseText){


					that.replaceState({alertData : data.responseText});
				}

				else{

					that.replaceState({alertData : "Sorry, something seems to have gone wrong, please try again!"});
				}

			});

		};
		
	},

	doDisplayStats : function(){

		var url = this.state.value;

		console.log('input: ' + url);

		// to do : check for empty space in between

		var that = this;
		
		if (url){

			url = url.trim();

			

			$.get(host+'api/stats',{url:this.state.value})


			.done(function(data){

				that.setState({hasStatsData : true });

				console.log(data);

				that.setState({alertData : "Done! You haz data!"});

				that.setState({statsData : data});



			})
			.fail(function(data){

				console.log(data.responseText);

				if(data.responseText){

					that.replaceState({alertData : data.responseText});
				}

				else{

					that.replaceState({alertData : "Sorry, something went wrong while processing your request, please try again!"});
				}

			});

		};


	}

});







React.render(<App />,document.getElementById('container'));