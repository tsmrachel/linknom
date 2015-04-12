var Alert = React.createClass({
	render: function(){
		return(
			<div className='alert' >
			<p>{this.props.data}</p>
			</div>
			)
	}
});
