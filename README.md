# twitterish2.0

##What

A twitterish dashboard for displaying 140 character tweets. Now with postgreSQL!

##Why

To learn how to use postgreSQL, and practice ajax and node.js.

##How

A web app that uses node.js, http server, basic cookie user authentication, and postgreSQL.

The basic logic is as follows:

* A user logs in by entering a username and password and submitting it.
* On submit their username and password is added to the users table and a unique id (primary key) is created for them and sent back to the client. If they already are on the database their unique id is retrieved and returned to the client.
* The client then uses this returned unique id to create a cookie for that user's session. The login form
is then hidden, and the dashboard is shown.
* When a user submits a new tweet, the id in their cookie is sent along with the tweet content to the server. The tweet is then added to the tweets table with the cookie id as its foreign key. This foreign key corresponds to the primary key id that was created in the users table.
* On load, and when a new tweet is posted, the dashboard is updated to show the most recent tweets. The users and tweets tables are joined (using the primary/foreign keys) to retrieve every tweet and the corresponding usernames that posted them back to the client. The client then displays them in the dashboard div.

##Stretch goals

* Full test-suite including learning how to test databases.
* Learn to configure heroku, gitignore, travis, codecov, codeclimate, istanbul and eslint correctly.
* Web-sockets.
