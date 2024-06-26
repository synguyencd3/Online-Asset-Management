import React, { useEffect } from 'react'

type Props = {
  setHeaderTitle: any
}

export const ReportComponent: React.FC<Props> = (props: Props) => {
  useEffect(() => {
    props.setHeaderTitle("Reports");
}, [])
  return (
    <div>ReportComponent: React.FC</div>
  )
}
