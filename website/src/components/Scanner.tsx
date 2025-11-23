import { Html5QrcodeScanner } from 'html5-qrcode'
import { useEffect } from 'react'
import '../styles/Checkin.css'

export default function Scanner({ onScan }){
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 }
      },
      false
    )

    scanner.render(
      (decodedText) => {
        console.log('QR Code:', decodedText)
        if(onScan){
          onScan(decodedText)
        }
      },
      (errorMessage) => {
        console.error('error scanning, :', errorMessage)
      }
    )

    return () => scanner.clear().catch(() => {})
  }, [])

  return <div id='qr-reader'></div>
}
