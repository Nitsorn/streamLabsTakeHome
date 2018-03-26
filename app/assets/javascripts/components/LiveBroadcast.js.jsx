class LiveBroadcast extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      pollIntervalInSeconds: null,
      newMessage: ''
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
          }, _ => {
            if (initiatePolling) {
              this.pollForNewMessages(response.polling_interval_millis)
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
    const { snippet } = broadcast;
    const { thumbnails, title } = snippet;

    return (
      <div>

        <img
          src={thumbnails.high.url}
          height={thumbnails.high.height}
          width={thumbnails.high.width}
        />
        <div>{title}</div>
        <div>{broadcast.id}</div>
        {this.renderMessages()}
        {this.renderNewMessage()}
      </div>
    )
  }

  submit(e) {
    debugger;
    e.preventDefault();
    const { newMessage } = this.state;
    const { broadcast } = this.props;
    const { snippet } = broadcast;

    $.ajax({
      url: `/api/messages?chat_id=${snippet.live_chat_id}&message=${newMessage}`,
      method: 'POST',
      success: (response) => {
        this.setState({newMessage: ''})
        clearInterval(this.poll);
        this.fetchChatMessages(true);
      },
      error: (err) => {
        debugger;
      }
    })
  }

  renderNewMessage() {
    const { newMessage } = this.state;
    return (
      <div>
        <form onSubmit={this.submit.bind(this)}>
          <input
            value={newMessage}
            placeholder='Say something...'
            onChange={ e => {
              this.setState({
                newMessage: e.target.value
              })
            }}
          />
          <button type='submit'>Send</button>
        </form>
      </div>
    )
  }

  renderMessages() {
    const { messages } = this.state;
    return (
      <div>
        {
          messages.map( message => {
            const { snippet, author_details } = message;
            const { display_name } = author_details;
            const { display_text, text_message_details, published_at } = snippet;
            const { message_text } = text_message_details;
            return (
              <div key={message.id}>
                <strong>{display_name}</strong> <span>{message_text}</span>
              </div>
            )
          })
        }

      </div>
    )
  }
}
