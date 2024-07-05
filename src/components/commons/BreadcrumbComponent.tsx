import React from 'react'
import { Breadcrumb } from 'react-bootstrap'
import { BreadcrumbModel } from '../../models/BreadcrumbModel'

type BreadcrumbProps = {
    breadcrumb: BreadcrumbModel[]
}

export const BreadcrumbComponent: React.FC<BreadcrumbProps> = ({ breadcrumb }) => {
    return (
        <Breadcrumb className='text-white'>
            {breadcrumb.map((crumb: BreadcrumbModel, index) =>
                <Breadcrumb.Item key={index} active={index == breadcrumb.length - 1} href={crumb.href}>{crumb.title}</Breadcrumb.Item>
            )}
        </Breadcrumb>
    )
}

