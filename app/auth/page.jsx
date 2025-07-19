import React from 'react'

const Page = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen gap-4'>
      <h1 className='text-4xl font-bold'>Not Authenticated</h1>
      <p className='text-gray-400'>You do not have access to this page.</p>
    </div>
  )
}

export default Page
