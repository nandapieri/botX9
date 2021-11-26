//min 4129
//max 4314
//ethbusd

function calcRSI(prices) {
    let ganhos = 0;
    let perdas = 0;
    for (let i = prices.length - 14; i < prices.length; i++) {
        const diferenca = prices[i] - prices[i - 1];
        if (diferenca >= 0)
            ganhos += diferenca;
        else
            perdas -= diferenca;
    }

    const forcaRelativa = ganhos / perdas;
    return 100 - (100 / (1 + forcaRelativa));
}

(async () => {
    require('dotenv').config()
    const axios = require('axios');
    const candles = await axios.get('https://api.binance.com/api/v3/klines?symbol=ETHBUSD&interval=1m');
    const closes = candles.data.map(candle => parseFloat(candle[4]));

    const WebSocket = require('ws');
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/ethbusd@kline_1m');

    const { Telegraf } = require('telegraf');
    const bot = new Telegraf(process.env.BOT_TOKEN);

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.k.x) {
            closes.push(parseFloat(data.k.c));
            const rsi = calcRSI(closes);
            console.log(rsi);

            if (rsi > 70) {
                bot.telegram.sendMessage(process.env.BOT_CHAT_ID, 'Sobrecomprado!');
                console.log('Sobrecomprado!');
            }
            else if (rsi < 30) {
                bot.telegram.sendMessage(process.env.BOT_CHAT_ID, 'Sobrevendido!');
                console.log('Sobrevendido!');
            }
        }
    }

    console.log('conectado');

})()
