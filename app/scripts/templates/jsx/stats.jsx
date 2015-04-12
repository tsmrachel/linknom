var StatsItem = React.createClass({
	render: function(){

		return(
			<div className = {this.props.ofItems}>
			<span className = 'data'>{this.props.data}</span>
			<span className = 'title'>{this.props.title}</span>
			</div>
			)
	}


});


var StatsSection = React.createClass({

	render : function(){

		var statsItems=[];

		var keyCounter = 0;

		console.log("this.props.data : " + this.props.data);

		console.log("data length : " + Object.keys(this.props.data).length);

		var ofItems = this.deriveClassBasedOnLength(Object.keys(this.props.data).length);

		for (var item in this.props.data){
			console.log("item : " + item);
			statsItems.push(<StatsItem key={keyCounter} ofItems={ofItems} title={item} data={this.props.data[item]}/>);

			keyCounter++;
		}

		console.log(statsItems);

		return( 
			<div className = 'section'>
			{statsItems}
			</div>
			);

	},

	deriveClassBasedOnLength : function(num){

		if (num === 1){

			return 'one';
		}

		else {

			return 'four';

		}
	}
});



var Stats = React.createClass({
	render: function(){

		var statsSections=[];

		var keyCounter = 0;

		for (row in this.props.data){
			
			console.log("row : " + this.props.data[row]);

			statsSections.push(<StatsSection key={keyCounter} data={this.props.data[row]}/>);

			keyCounter++;
		}

		console.log(statsSections);

		return( 
			<div className='stats'>
			{statsSections}
			</div>
			);


	}

});
