import { QRCodeSVG } from 'qrcode.react'

export default function QrCode({ rsvpId }: String){
  return(
    <QRCodeSVG 
      value={rsvpId}
      size={256}
    />
  )
}
