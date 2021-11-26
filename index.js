//min 4129
//max 4314
//ethbusd

require('dotenv').config()
const WebSocket = require('ws')
const ws = new WebSocket('wss://stream.binance.com:9443/ws/ethbusd@kline_1h')

const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)
const ethBusdMin = 4129
const ethBusdMax = 4314
console.log('conectado')

ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    const valor = parseFloat(data.k.c)
    console.log('Valor atual:'+data.k.c)
    if(valor >= ethBusdMax) {
      bot.telegram.sendMessage(process.env.BOT_CHAT_ID, 'Vender')
      console.log('Vender')
    }
    if (valor <= ethBusdMin) {
      bot.telegram.sendMessage(process.env.BOT_CHAT_ID, 'Comprar')
      console.log('Comprar')
    }
}
