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
      <div className='AuthorMessages_container'>
        <img
          className='AuthorMessages_profile_image'
          src={profile_image_url}
          height={120}
          width={120}
        />
        <br />
        <br />
        <div className='my-bold'>{display_name}</div>
        <br />
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
        <button
          className='my-button my-button-return'
          onClick={ _ => this.setState({expanded_live_chat: null})}>
          Back to videos
        </button>
        <br />
        <br />
        <h5>Comments on video {expanded_live_chat.video_title}</h5>
        <div>
          {
            expanded_live_chat.messages.map( message => {
              const { text_message } = message;
              return (
                <div
                  className='live_chat_message_wrapper my-padding-twenty my-cursor-default'
                  key={message.id}>
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
                className='live_chat_wrapper my-padding-twenty'
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
