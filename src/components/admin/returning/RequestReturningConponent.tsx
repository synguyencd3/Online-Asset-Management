import React, { ReactNode, useEffect } from 'react'
import { BreadcrumbComponent } from '../../commons/BreadcrumbComponent'

type Props = {
  setHeaderTitle: (title: ReactNode) => void
}
export const RequestReturningConponent: React.FC<Props> = (props: Props) => {
  useEffect(() => {
    props.setHeaderTitle(<BreadcrumbComponent breadcrumb={[
      {
        title: 'Request for Returing',
        href: `${window.location.origin}/admin/request-returning#`
      }
    ]} />);
  }, [])
  return (
    <div>RequestReturningConponent: React.FC</div>
  )
}
