import React from 'react'
import { Button } from 'react-bootstrap'
import { ColorPalette } from '../../utils/ColorPalette'

export const NotHavePermission: React.FC = () => {
    const handleRedirect = () => {
        window.location.href = '/'
    }

    return (
        <section className="bg-white dark:bg-dark">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 text-center">
                <div className="mx-auto max-w-screen-sm">
                    <img style={{ maxWidth: '20vw' }} className='my-5' src='https://img.freepik.com/premium-vector/error-403-character-illustration_854078-606.jpg' alt='403' />
                    {/* <h1 className="mb-4 display-1 fw-bold" style={{ color: ColorPalette.PRIMARY_COLOR }}>403</h1> */}
                    <p className="mb-4 display-6 fw-bold text-dark">Sorry, you are not authorized to access this page.</p>
                    <Button
                        id='btn-redirect'
                        onClick={handleRedirect}
                        className="btn-lg my-4 border-0 fw-semibold"
                        style={{ minWidth: "90px", backgroundColor: ColorPalette.PRIMARY_COLOR }}>
                        Back to Homepage
                    </Button>
                </div>
            </div>
        </section>

    )
}
