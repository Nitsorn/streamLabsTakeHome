class StreamApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      broadcasts: props.broadcasts || [],
      expanded_broadcast: null
    }
  }

  componentDidMount() {
    $.ajax({
      url: '/api/streams',
      method: 'GET',
      success: (response) => {
        debugger;
        if (response.broadcasts) this.setState({
          broadcasts: response.broadcasts
        })
      },
      error: (err) => {
        alert('error fetching broadcasts')
        debugger;
      }
    })

  }

  render() {
    const { expanded_broadcast } = this.state;
    return (
      <div className='StreamApp_container'>
        {
          expanded_broadcast ?
            (
              <div>
                <button
                  onClick={ _ => {
                    this.setState({expanded_broadcast: null})
                  }}
                >
                  Back to list
                </button>
                <br />
                <br />
                <LiveBroadcast
                  broadcast={expanded_broadcast}
                />
              </div>

            ) :
            this.renderBroadcasts()

        }
      </div>
    )
  }

  renderBroadcasts() {
    const { current_user } = this.props;
    const { broadcasts } = this.state;
    return (
      <div>
        <h3>Welcome, {current_user.email}</h3>
        <h4>Here are your streams!</h4>
        {
          broadcasts.map( broadcast => {
            const { snippet } = broadcast;
            const {thumbnails, title } = snippet;
            return (
              <div
                key={broadcast.id}
                onClick={ _ => {
                  this.setState({
                    expanded_broadcast: broadcast
                  })
                }}
              >
                <img
                  src={thumbnails.medium.url}
                  height={thumbnails.medium.height}
                  width={thumbnails.medium.width}
                />
                <div>{title}</div>
                <div>{broadcast.id}</div>
              </div>
            )
          })
        }
      </div>
    )
  }

}
