# telegram_bot
##Starting
* Copy this repository `git clone https://github.com/mennya/telegram_bro_bot.git` 
* Type `npm i` to install all dependencies.  
* Create `config.json` file.  
* Type `npm run dev` to start development.  

##Configs
Configs are not sored in git, because of privacy.  
When running development mode (locally) create `config.json`.
When running production mode, create config variables in [heroku Dashboard or through CLI’s](https://devcenter.heroku.com/articles/config-vars)   
config.json example:
```json
{
	"BOT_TOKEN": "token",
	"BRO_GROUP_ID": "ID",
	"PORT": "5000"
}
```

`BOT_TOKEN` - token from [BotFather](https://telegram.me/botfather)  
`BRO_GROUP_ID` - to what group send message on get request  
`PORT` - local server will be started with this port  
`HEROKU_URL` - a url must be specified to run in production(not required to run localy)  
