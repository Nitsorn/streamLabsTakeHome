class AuthorMessages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      live_chats: [],
      expanded_live_chat: null
    }
  }

  componentDidMount() {
    this.fetchChatMessages();
  }

  fetchChatMessages() {
    const { id } = this.props.author;
    $.ajax({
      url: `/api/messages_by_author?author_id=${id}`,
      method: 'GET',
      success: (response) => {
        if (response.live_chats) {
          this.setState({
            live_chats: response.live_chats || []
          })
        }
      },
      error: (err) => {
        debugger;
      }
    })
  }


  render() {
    const { expanded_live_chat } = this.state;
    const { author } = this.props;
    const { display_name, profile_image_url } = author;

    return (
      <div>
        <img
          src={profile_image_url}
          height={50}
          width={50}
        />
        <div>{display_name}</div>
        {
          expanded_live_chat ?
          this.renderMessages() :
          this.renderLiveChats()
        }
      </div>
    )
  }

  renderMessages() {
    const { expanded_live_chat } = this.state;
    return (
      <div>
        <button onClick={ _ => this.setState({expanded_live_chat: null})}>
          back to videos
        </button>
        <br />
        <br />
        <div>
          {
            expanded_live_chat.messages.map( message => {
              const { text_message } = message;
              return (
                <div key={message.id}>
                  {text_message}
                </div>
              )
            })
          }
        </div>

      </div>
    )
  }

  renderLiveChats() {
    const { live_chats } = this.state;
    return (
      <div>
        <h5>Commented on videos</h5>
        {
          live_chats.map( live_chat => {
            return (
              <div
                key={live_chat.id}
                onClick={ _ => this.setState({
                  expanded_live_chat: live_chat
                })}
              >
                <strong>{live_chat.video_title}</strong>
              </div>
            )
          })
        }

      </div>
    )
  }
}
