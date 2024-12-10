import Link from 'next/link'
import React from 'react'

type Props = {}

const Logo = (props: Props) => {
  return (
    <Link href={'/'} prefetch={false}>
        <div>
            <p className='font-bold text-2xl text-white px-2 py-1 flex flex-row gap-2 text-grad'>
              AssessMe.AI
            </p>
        </div>
    </Link>
  )
}

export default Logo