// import { Breadcrumb } from 'antd'
import React from 'react'
import { BreadcrumbModel } from '../../models/BreadcrumbModel'
import { Breadcrumb } from 'react-bootstrap'

type BreadcrumbProps = {
    breadcrumb: BreadcrumbModel[]
}

export const BreadcrumbComponent: React.FC<BreadcrumbProps> = ({ breadcrumb }) => {
    return (
        <Breadcrumb>
            {breadcrumb.map((crumb: BreadcrumbModel, index) =>
                <Breadcrumb.Item key={index} active={index == breadcrumb.length - 1} className='text-white' href={crumb.href}>{crumb.title}</Breadcrumb.Item>
            )}
        </Breadcrumb>
    )
}

