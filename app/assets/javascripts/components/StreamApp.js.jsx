class StreamApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      broadcasts: [],
      expanded_broadcast: null,
      loaded: false
    }
  }

  componentDidMount() {
    $.ajax({
      url: '/api/streams',
      method: 'GET',
      success: (response) => {
        this.setState({
          broadcasts: response.broadcasts || [],
          loaded: true
        })
      },
      error: (err) => {
        alert('error fetching broadcasts')
      }
    })

  }

  render() {
    const { expanded_broadcast } = this.state;
    return (
      <div className='StreamApp_container my-content-wrapper'>
        <div className='AuthorApp_link_to_profile my-position-fixed my-top my-right my-padding-twenty'>
          {this.renderLinkToAuthorsDashboard()}
        </div>
        {
          expanded_broadcast ?
            (
              <div>
                <button
                  className='my-button my-button-return'
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

  renderLinkToAuthorsDashboard() {
    return (
      <button
        onClick={ _ => window.location = '/authors'}
        className='my-button my-button-author'>Query Messages By Author
      </button>
    )
  }



  renderBroadcasts() {
    const { current_user } = this.props;
    const { broadcasts, loaded } = this.state;
    return (
      <div className='broadcast_thumbnails_container'>
        <h3 className='my-bold'>Welcome, {current_user.email}</h3>
        <button
          className='my-button my-button-return'
          onClick={ _ => {
            window.location = '/users/sign_out'
          }}
        >
          Sign Out
        </button>
        <br />
        <br />
        <h4>Here are your streams!</h4>
        { broadcasts.length > 0 ?
          broadcasts.map( broadcast => {
            const { snippet, status } = broadcast;
            const {thumbnails, title } = snippet;
            const { life_cycle_status, privacy_status } = status;
            return (
              <div
                key={broadcast.id}
                className='broadcast_thumbnail_wrapper'

              >
                <img
                  className='broadcast_thumbnail_image'
                  src={thumbnails.high.url}
                  height={thumbnails.medium.height}
                  width={thumbnails.medium.width}
                  onClick={ _ => {
                    this.setState({
                      expanded_broadcast: broadcast
                    })
                  }}
                />
                <h4 className='my-bold'>
                  {title}
                  <span className='broadcast_thumbnail_status'>{life_cycle_status}</span>
                  <span className='broadcast_thumbnail_status'>{privacy_status}</span>
                </h4>

              </div>
            )
          }) : (
            loaded ? (
              <div className='my-padding-twenty'>No streams found. Start streaming to see it here.</div>
            ) : (
              <div className='my-padding-twenty'>Loading...</div>
            )
          )
        }
      </div>
    )
  }

}
