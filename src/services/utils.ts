import dataUriToBuffer from 'data-uri-to-buffer'
import {
  ClarityValue
} from '@stacks/transactions'

const utils = {
  fetchBase64FromImageUrl: function (url, document) {
    return new Promise((resolve) => {
      const img = new Image()
      img.setAttribute('crossOrigin', 'anonymous')
      img.onload = function () {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(this, 0, 0)
        const dataURL = canvas.toDataURL('image/png')
        const mimeType = dataURL.substring(dataURL.indexOf(':') + 1, dataURL.indexOf(';')) // => image/png
        const imageBuffer = dataUriToBuffer(dataURL)
        resolve({ dataURL: dataURL, imageBuffer: imageBuffer, mimeType: mimeType })
      }
      img.src = url
    })
  },
  getClarityValueArray: function (functionArgs) {
    const clarityValueArgs: ClarityValue[] = new Array(functionArgs.length)
    for (let i = 0; i < functionArgs.length; i++) {
      clarityValueArgs[i] = functionArgs[i]
    }
    return clarityValueArgs
  },
  getBase64FromImageUrl: function (dataURL) {
    const imageBuffer = dataUriToBuffer(dataURL)
    // const rawImage = dataURL.replace(/^data:image\/(png|jpg);base64,/, '')
    const mimeType = dataURL.substring(dataURL.indexOf(':') + 1, dataURL.indexOf(';')) // => image/png
    return { imageBuffer: imageBuffer, mimeType: mimeType }
  },
  stringToHex: function (str) {
    const arr = []
    for (let i = 0; i < str.length; i++) {
      arr[i] = (str.charCodeAt(i).toString(16)).slice(-4)
    }
    return '0x' + arr.join('')
  },
  toObjectApplication: function (o) {
    const td = new TextDecoder('utf-8')
    return {
      owner: td.decode(o.value.data.owner.buffer),
      contractId: td.decode(o.value.data['app-contract-id'].buffer),
      status: o.value.data.status.value,
      storageModel: o.value.data['storage-model'].value
    }
  },
  toObjectAsset: function (o) {
    const td = new TextDecoder('utf-8')
    return {
      owner: td.decode(o.value.data.owner.buffer),
      assetHash: o.value.data['asset-hash'].buffer.toString('hex'),
      bh: o.value.data.date.value
    }
  },
  toObjectString: function (o) {
    const td = new TextDecoder('utf-8')
    return td.decode(o.buffer)
  }
}
export default utils
