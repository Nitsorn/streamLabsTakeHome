class LiveBroadcast extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      pollIntervalInSeconds: null,
      newMessage: '',
      loaded: false,
      submitting: false
    }
    this.poll = null;
  }

  componentDidMount() {
    const { snippet } = this.props.broadcast;
    if (snippet && snippet.live_chat_id)
      this.fetchChatMessages(true);
  }

  componentWillUnmount() {
    clearInterval(this.poll);
  }

  fetchChatMessages(initiatePolling) {
    const { snippet, id } = this.props.broadcast;
    $.ajax({
      url: `/api/messages?chat_id=${snippet.live_chat_id}&video_id=${id}&video_title=${snippet.title}`,
      method: 'GET',
      success: (response) => {
        if (response.messages) {
          this.setState({
            messages: response.messages,
            loaded: true
          }, _ => {
            if (initiatePolling) {
              this.pollForNewMessages(response.polling_interval_millis * 1.5)
            }
          })
        }
      },
      error: (err) => {
        debugger;
      }
    })
  }

  pollForNewMessages(pollIntervalInSeconds) {
    this.poll = setInterval(this.fetchChatMessages.bind(this, false), pollIntervalInSeconds)
  }

  render() {
    const { broadcast } = this.props;
    const { snippet, status } = broadcast;
    const { thumbnails, title ,description } = snippet;
    const { life_cycle_status, privacy_status } = status;

    return (
      <div className='LiveBroadcast_container'>
        <div className='LiveBroadcast_info_container my-padding-twenty'>
          <a href={`https://youtu.be/${broadcast.id}`} target='_blank'>
            <img
              className='LiveBroadcast_thumbnail_image my-full-width'
              src={thumbnails.high.url}
            />
          </a>
          <br />
          <br />
          <div>
            <div className='my-float-right'>
              <a
                href={`https://youtu.be/${broadcast.id}`}
                target='_blank'
                className='my-button'
              >
                Watch
              </a>
            </div>
            <h3 className='my-bold'>{title}</h3>
            <h5>{description || 'No Description Found.'}</h5>
            <span className='broadcast_thumbnail_status'>{life_cycle_status}</span>
            <span className='broadcast_thumbnail_status'>{privacy_status}</span>
          </div>
        </div>
        <div className='LiveBroadcast_chat_container'>
          {this.renderMessages()}
          {this.renderNewMessage()}
        </div>
      </div>
    )
  }

  submit(e) {
    debugger;
    e.preventDefault();
    const { newMessage } = this.state;
    const { broadcast } = this.props;
    const { snippet } = broadcast;

    this.setState({
      submitting: true
    }, _ => {
      $.ajax({
        url: `/api/messages?chat_id=${snippet.live_chat_id}&message=${newMessage}`,
        method: 'POST',
        success: (response) => {
          this.setState({
            newMessage: '',
            submitting: false
          })
          clearInterval(this.poll);
          this.fetchChatMessages(true);
        },
        error: (err) => {
          debugger;
          alert('Error posting a message');
          this.setState({
            submitting: false
          })
        }
      })
    })
  }

  renderNewMessage() {
    const { newMessage, submitting } = this.state;
    return (
      <div className='LiveBroadcast_chat_new_message_container'>
        <form
          className='my-align-items-inline'
          onSubmit={this.submit.bind(this)}>
          <input
            disabled={submitting}
            className='LiveBroadcast_chat_new_message_input'
            value={newMessage}
            placeholder='Say something...'
            onChange={ e => {
              this.setState({
                newMessage: e.target.value
              })
            }}
          />
          <button
            disabled={submitting}
            className='LiveBroadcast_chat_new_message_button'
            type='submit'>{submitting ? "Sending..." :'Send'}</button>
        </form>
      </div>
    )
  }

  renderMessages() {
    const { messages, loaded } = this.state;
    return (
      <div className='LiveBroadcast_chat_messages_container'>
        { messages.length > 0 ?
          messages.map( message => {
            const { snippet, author_details } = message;
            const { display_name, profile_image_url } = author_details;
            const { display_text, text_message_details, published_at } = snippet;
            const { message_text } = text_message_details;
            return (
              <div
                className='LiveBroadcast_chat_messages_message_wrapper my-align-items-inline'
                key={message.id}>
                <img
                  className='LiveBroadcast_chat_messages_message_profile_picture'
                  src={profile_image_url}
                  height={40}
                  width={40}
                />
                <span className='my-bold LiveBroadcast_chat_messages_message_author_name'>{display_name}</span> <span>{message_text}</span>
              </div>
            )
          }) : (
            loaded ? (
              <div className='my-padding-twenty'>No messages found. Start typing to see it here.</div>
            ) : (
              <div className='my-padding-twenty'>Loading...</div>
            )
          )
        }

      </div>
    )
  }
}
