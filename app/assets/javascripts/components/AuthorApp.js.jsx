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
      <div className='StreamApp_container'>
        {
          expanded_author ?
            (
              <div>
                <button
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
      </div>
    )
  }

  renderAuthors() {
    const { authors } = this.state;
    return (
      <div>
        <h4>Comment authors in external DB!</h4>
        {
          authors.map( author => {
            const { display_name, profile_image_url, channel_url } = author;
            return (
              <div
                key={author.id}
                onClick={ _ => {
                  this.setState({
                    expanded_author: author
                  })
                }}
              >
                <img
                  src={profile_image_url}
                  height={30}
                  width={30}
                />
                <div>{display_name}</div>
              </div>
            )
          })
        }
      </div>
    )
  }

}
