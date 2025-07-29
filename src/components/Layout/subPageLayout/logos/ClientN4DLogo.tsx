import dynamic from 'next/dynamic'

// Todo: remove this component as an example if it is not use, after finishing entire Admin Dashboard !
const N4DLogo = dynamic(() => import('./N4DLogo'), {
  ssr: false,
})

export default N4DLogo
