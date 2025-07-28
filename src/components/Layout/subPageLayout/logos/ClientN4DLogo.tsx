import dynamic from 'next/dynamic'

// Todo: move this component if it is not used after finishing entire Admin Dashboard !
const N4DLogo = dynamic(() => import('./N4DLogo'), {
  ssr: false,
})

export default N4DLogo
