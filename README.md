# Streamlabs Take Home Assignment

## Assignment
Create a webapp that allows users to login with their Youtube/Google account and
join a live video stream. Once in the stream, it should stream all chat messages
and update live. Store these messages and create another interface that will
return all chat messages from a given username.

## Brief Explanation
Here you will find my solution to the assignment. You can look at https://youtu.be/Y2C3izspq4M for a (completed) live stream of my attempt to connect to that particular live stream via API. It's livestreamception.

## Stack
I am using a Ruby on Rails stack with implementation of webpack on the frontend to introduce React. I have had 1-2 years experience working in a similar stack, although none with this particular gem "react-rails" `https://github.com/reactjs/react-rails`.

# Flow
The flow of the webapp follows the following calls to Google/Youtube APIs
- Registering my app on Google API Dashboard, storing `client_token` and `client_secret`.
- Authenticating user via Oauth2, through `omniauth-google-oauth2` https://github.com/zquestz/omniauth-google-oauth2, requesting required youtube scopes.
- Store `user_token` and `user_refresh_token`.
- Connect to youtube API using google API gem `google-api-client` https://github.com/google/google-api-ruby-client.
- Upon getting `LiveChatMessages` for a broadcasted stream, run a background worker to store this data in postgres database.
- Create a UI for fetching these chat messages based on authors who previously commented.

## Challenges Faced
1. `Creating front-end as single index.html (Make a SPA)` - I made an attempt to build a Single Page Javascript App (SPA), and creating rails as an API. However, I was unable to configure the set-up quickly, and had to settle to my usual stack.

2. `Using One-Time (Hybrid) Oauth2 Flow` - The flow goes as follows:
`call to JS API` => `get one-time code` => `pass that code to server` => `server validates the code` => `get access and refresh token for user` => `store access and refresh token securely`.

The Hybrid flow has significant functional and security advantages over server-side, as it does not leak sensitive info over, and `code` is useless without the `client_secret`.

I almost got it working with `omniauth-google-oauth2` gem, but there was an issue with the gem validating the `callback_uri`, and decided to complete auth purely server-side due to time constraints. Ideally, implementing that is better than what I currently have, which is purely server-side auth via `devise`.

3. `Bonus - Hype in Chat` - Although I did not get to the bonus question, I thought there are few ways to determine "hypeness" of a channel.

3.1 Without updating postgres db - If `broadcast.chat_messages.length/broadcast.duration` is over a certain threshold. Although this would label streams that have recently cooled down as hype as well.

3.2 Without updating postgres db - Get last 20 (or 10 or 30 or 100) and see if they were all `published_at` after `x` minutes ago.

3.3 Without updating postgres db - Get last 20 (or 10 or 30 or 100) and see if they were all from `y` authors (length).

3.4 Run a regression analysis on a test broadcast channel, monitoring whether or not that instance is a hype or not. The analysis will look at `x = rate of message creation in that timespan`, and `y = number of authors messaging in that timespan`. So the algorithm will be `f(x,y)`.
