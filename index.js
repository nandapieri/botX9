//min 4129
//max 4314
//ethbusd
const ethBusdMin = 4129
const ethBusdMax = 4314
console.log('conectado')
const WebSocket = require('ws')
const ws = new WebSocket('wss://stream.binance.com:9443/ws/ethbusd@kline_1h')
let vender = false
let comprar  = false
ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    const valor = parseFloat(data.k.c)
    console.log('Valor atual:'+data.k.c)
    if(valor >= ethBusdMax && !vender) {
      console.log('Vender')
      vender = true
      comprar = false
    }
    if (valor <= ethBusdMin && !comprar) {
      console.log('Comprar')
      comprar = true
      vender = false
    }
}
