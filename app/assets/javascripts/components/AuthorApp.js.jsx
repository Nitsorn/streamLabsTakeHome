class AuthorApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authors: props.authors || [],
      expanded_author: null
    }
  }

  render() {
    const { expanded_author } = this.state;
    return (
      <div className='AuthorApp_container my-content-wrapper'>
        <div className='AuthorApp_link_to_profile my-position-fixed my-top my-right my-padding-twenty'>
          {this.renderLinkToProfile()}
        </div>
        {
          expanded_author ?
            (
              <div>
                <button
                  className='my-button my-button-return'
                  onClick={ _ => {
                    this.setState({expanded_author: null})
                  }}
                >
                  Back to list
                </button>
                <br />
                <br />
                <AuthorMessages
                  author={expanded_author}
                />
              </div>

            ) :
            this.renderAuthors()
        }
        <br />

      </div>
    )
  }

  renderLinkToProfile() {
    const { current_user } = this.props;
    if (current_user) {
      return (
        <button
          onClick={ _ => window.location = '/home'}
          className='my-button my-button-sign-in'>Go to Portal
        </button>
      )
    }
    else return (
      <button
        onClick={ _ => window.location = '/users/auth/google_oauth2'}
        className='my-button my-button-sign-in'>Log in with Youtube
      </button>
    )
  }

  renderAuthors() {
    const { authors } = this.state;
    return (
      <div className='author_thumbnails_container'>
        <h4 className='my-bold'>Authors in external Database</h4>
        { authors.length > 0 ?
          authors.map( author => {
            const { display_name, profile_image_url, channel_url } = author;
            return (
              <div
                key={author.id}
                className='my-align-items-inline author_thumbnail_wrapper'
                onClick={ _ => {
                  this.setState({
                    expanded_author: author
                  })
                }}
              >
                <img
                  className='author_thumbnail_profile_image'
                  src={profile_image_url}
                  height={50}
                  width={50}
                />
                <div>{display_name}</div>
              </div>
            )
          }) : (
            <div className='my-padding-twenty'>No Authors Found.</div>
          )
        }
      </div>
    )
  }

}
