import React, { useEffect } from 'react'

type Props = {
  setHeaderTitle: any
}
export const RequestReturningConponent: React.FC<Props> = (props: Props) => {
  useEffect(() => {
    props.setHeaderTitle("Request for Returing");
  }, [])
  return (
    <div>RequestReturningConponent: React.FC</div>
  )
}
