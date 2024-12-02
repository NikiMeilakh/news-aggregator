# News aggregator application
Hello! it's my new news aggregator application, and you can test it right now.
Everything what you need is download file with application on your computer,
install node_modules(npm install) and run it using command 'docker compose up --build'.

# What is the purpose of application?
It's very easy, the purpose of my application is delivering fresh news to you as soon as possible.
You have a simple interface that let your choose interesting news categories, country and
preferable communication channel. After it you push the button "get my news" and your
news selection sending to email or telegram, it depends only on your wishes.
Look at this beautiful and minimalistic modern interface!
[Main interface](./news_aggregator_prsentation/Application_view.png)

# Whats technologies does it consist?
My application has really advanced technologies like state management, queueing , database connection, 
and 5 microservices with clear structure for future scalable. Also, it covered in docker compose which let your
run and deploy my application on every computer using only one command.
It's time to look at the scheme of interaction between application parts
[Application scheme](./news_aggregator_prsentation/Application%20scheme.png)

# How to run my application?
1. Clone the repository on your local machine https://github.com/NikiMeilakh/news-aggregator.git
2. Change directory to the project root 'cd news-aggregator'
3. Install dependencies 'npm install'
4. Open docker application on your machine
5. Enter in terminal command 'docker compose up --build'
6. Open in web browser http://localhost:3000 and enjoy the project:)

# How to test my application?
You can do it after run it on your computer and open interface on http://localhost:3000. Application will work
and send you email or telegram messages.
Or you can use News_aggregator_test.postman_collection for test it without interaction with interface,
but I highly recommended to check out it UI part!

## See you soon
I am looking forward to show you everything in details on our defence day meeting. 
I have already prepared a special presentation. See you soon!


